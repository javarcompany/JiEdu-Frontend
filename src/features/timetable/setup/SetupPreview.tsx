import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import axios from "axios";
import { ClockIcon, EditIcon, TimerIcon, TrashIcon } from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import Swal from "sweetalert2";
import Select from "../../../components/form/Select";
import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";
import { SearchButton } from "../../../components/dashboard/SearchButton";

export interface Lesson {
	id: number;
	name: string;
    start: string;
    duration: string;
    end: string;
    code: string;
}

export default function TablesPreview() {
    const token = localStorage.getItem("access");
	const [lessons, setLessons] = useState<Lesson[]>([]);
	const { isOpen, openModal, closeModal } = useModal();

	const [searchTerm, setSearchTerm] = useState<string>("");

	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [codeoptions, setCodeOptions] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

	const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
	const isEditing = Boolean(editingLesson);

	const [formData, setFormData] = useState({
        name: "",
		start: "",
		duration: "00:30:00",
		code: ""
    });

	const fetchLessons = debounce(async (searchTerm, page = 1) => {
		await axios.get(`/api/lessons/?search=${searchTerm}&page=${page}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		).then(response => {
			setLessons(response.data.results);
			setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setPage(response.data.page);
		})
		.catch (error => {
			console.error("Failed to fetch Lessons", error);
		});
	}, 100);

	useEffect(() => {
		const fetchCodeOptions = async () => {
            axios.get('/api/code-options/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                setCodeOptions(response.data);
            })
            .catch(error => {
                console.error("Error fetching days choices:", error);
            });
        };

		fetchLessons(searchTerm, page);
		fetchCodeOptions();
	}, [page, searchTerm]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

	const handleSelectChange = (option: any, field: string) => {
        console.log(field, ":", option )
        if (!option) return; // handle deselection
        const value = typeof option === 'string' ? option : option?.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh

        try {
			if (isEditing && editingLesson) {
				await axios.put(`/api/lessons/${editingLesson.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Lesson updated successfully!", "success");
			} else {
				await axios.post("/api/lessons/", formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Lesson added successfully!", "success");
			}

			setFormData({ name: "", start: "", duration: "00:30:00", code: "" });
			setEditingLesson(null);
			closeModal();
			fetchLessons(searchTerm, page);
		} catch (err: any) {
			console.error(err);
			const errorMsg =
				err?.response?.data?.name ||
				"An unexpected error occurred during save.";
			Swal.fire("Error", `${errorMsg}`, "error");
		}
    };

	const handleDeleteLesson = async (lessonId: number, lessonName: string) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the lesson "${lessonName}"? This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (result.isConfirmed) {
			try {
				await axios.delete(`/api/lessons/${lessonId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${lessonName}" has been deleted.`, "success");
				fetchLessons(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete lesson", error);
				Swal.fire("Error", "Something went wrong. Could not delete the lesson.", "error");
			}
		}
	};

	const handleEditLesson = (lesson: Lesson) => {
		setEditingLesson(lesson);
		setFormData({
			name: lesson.name,
			start: lesson.start,
			duration: lesson.duration,
			code: lesson.code,
		});
		openModal();
	};

	const handleClose = () => {
		setEditingLesson(null);
		setFormData({ name: "", start: "", duration: "00:30:00", code: "" });
		closeModal();
	};

    return (
		<>
			<div className="overflow-hidden py-4 rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Lesson Plan List
						</h3>
					</div>

					<div className="flex items-center gap-3">
						<SearchButton onSearch={setSearchTerm} />
						<button onClick={openModal} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
							<TimerIcon />
							Add Lesson
						</button>
					</div>
				</div>

				<div className="max-w-full overflow-x-auto">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
								<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Name
								</TableCell>

								<TableCell	
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Start Time
								</TableCell>

								<TableCell	
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Duration
								</TableCell>

								<TableCell	
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									End Time
								</TableCell>

								<TableCell	
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Mode
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Action(s)
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody 
							className="divide-y px-2 divide-gray-100 dark:divide-gray-800"
						>
							{lessons.length === 0 ? (
								<TableRow>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No lesson found....</div>
									</TableCell>
								</TableRow>
							) : (

								lessons.map((lesson) => (
									<TableRow key={lesson.id} className="px-4">

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.name}
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.start}
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.duration}
										</TableCell>
										
										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.end}
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.code}
										</TableCell>

										<TableCell>
											<button
												title="Edit Lesson"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditLesson(lesson)}
											>
												<EditIcon size={20} />
											</button>
											<button
												title="Delete Lesson"
												className="text-red-500 hover:text-blue-600 transition-colors  px-4"
												onClick={() => handleDeleteLesson(lesson.id, lesson.name)}
											>
												<TrashIcon size={20} />
											</button>
										</TableCell>

									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

			<Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
				<div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{isEditing ? "Edit Lesson" : "Add Lesson"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand Timetable functionality
						</p>
					</div>

					<form className="flex flex-col" onSubmit={handleSave}>
						<div className="px-2 custom-scrollbar">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 py-5 lg:grid-cols-1">
								<div>
									<Label>Name</Label>
									<Input type="text"  name="name" value={formData.name} onChange={handleChange}  />  
								</div>
							</div>
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 py-2 lg:grid-cols-2">

								<div>
									<Label>Start Time</Label>
									<div className="relative">
										<input
											type="time"
											name="start"
											value={formData.start}
											onChange={handleChange}
											className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
										/>

										<span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
											<ClockIcon className="size-6" />
										</span>
									</div>
								</div>

								<div>
									<Label>Duration</Label>
									<div className="relative">
										<select
											name="duration"
											value={formData.duration}
											onChange={(e) => handleSelectChange(e.target.value, "duration")}
											className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
										>
											<option value="00:30:00">30 minutes</option>
											<option value="00:45:00">45 minutes</option>
											<option value="01:00:00">1 hour</option>
											<option value="01:30:00">1 hour 30 minutes</option>
											<option value="02:00:00">2 hours</option>
										</select>

										<span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
											<ClockIcon className="size-6" />
										</span>
									</div>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 py-2 lg:grid-cols-1">

								<div>
									<Label>Mode</Label>
									<Select
										options={codeoptions}
										placeholder = "Select Mode"
										onChange={(code) => handleSelectChange(code, "code")}
									/>
								</div>

							</div>
						</div>

						<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							<Button size="sm" variant="outline"  onClick={handleClose}>
								Close
							</Button>

							<button
								type="submit"
								
								className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
							>
								Save Lesson
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
    );
}
  