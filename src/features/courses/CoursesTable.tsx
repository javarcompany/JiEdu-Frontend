import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../components/ui/table";

import debounce from "lodash.debounce";

import {  EyeIcon } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/ui/pagination";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import SearchableSelect from "../../components/form/DictSelect";
import Swal from "sweetalert2";

export interface Course {
	id: number;
	name: string;
	abbr: string;
	code: string;
	department: string;
	department_name: string;
	dor: string;
	module_duration: number;
	durations: {
		module_abbr: string;
		duration: number;
	}[];
}

export interface CourseDuration {
	id: number;
	course_abbr: string;
	course_code: string;
	course_name: string;
	module_name: string;
	module_abbr: string;
	duration: string;
	course_department_name: string;
	course_department_abbr: string;
}

export default function CoursesTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
	const { isOpen, openModal, closeModal } = useModal();
	const [saved, onSave] = useState<boolean>(false);
	const [editingCourse, setEditingCourse] = useState<Course | null>(null);
	const isEditing = Boolean(editingCourse);
    const [step, setStep] = useState<"course" | "terms">("course");
	const [departments, setDepartments] = useState<{value: string; label: string; }[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	
    const [moduleTerms, setModuleTerms] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        abbr: "",
        department: "",
        module_duration: 1,
    });

	const fetchCourses = debounce(async (searchTerm, page = 1) => {
		try {
			const response = await axios.get(`/api/courses/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            setPage(response.data.page);
			setCourses(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Courses", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		fetchCourses(searchTerm, page);
	}, [page, searchTerm, saveValue]);

	
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("/api/departments/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert departments to the format expected by SearchableSelect
                const formatted = data.map((dept: any) => ({
                    value: dept.id.toString(),
                    label: dept.name,      // or dept.title if that’s your field
                }));
                
                setDepartments(formatted);
                } catch (error) {
                console.error("Failed to load departments", error);
            }
        };

        fetchDepartments();
    }, []);

	const filteredData = courses.filter((item) =>
		Object.values(item)
			.join(" ")
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
	}

	const handleEditCourse = async (course: Course) => {
		setEditingCourse(course);
		setFormData({
			name: course.name,
			code: course.code,
			abbr: course.abbr,
			department: course.department,
			module_duration: course.module_duration
		});
		openModal();
	}

	const handleClose = () => {
		setEditingCourse(null);
		setFormData({ name: "", code: "", abbr: "", department: "", module_duration: 1 });
		closeModal();
	};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === "module_duration" ? Number(value) : value }));
    };

    const handleSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, department: selected,
        }));
    };

    const handleTermChange = (index: number, value: number) => {
        const updated = [...moduleTerms];
        updated[index] = value;
        setModuleTerms(updated);
    };

	const handleInitialEdit = (e: React.FormEvent) => {
        e.preventDefault();

        const numModules = formData.module_duration  || 1;
        setModuleTerms(Array(numModules).fill(1)); // default 1 term/module
        setStep("terms");
    };
	
    const handleFinalEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                code: formData.code,
                abbr: formData.abbr,
                department: formData.department,
                module_durations: formData.module_duration, // <- list like [2, 3]
            };

            await axios.put(`/api/courses/${editingCourse?.id}/`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire("Success", "Course editted successfully!", "success");
            setFormData({ name: "", code: "", abbr: "", department: "", module_duration: 1 });
            setModuleTerms([]); // Reset term durations state
            closeModal();
            setStep("course");
            setIsSubmitting(false);
            onSave(!true);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to edit course", "error");
            setFormData({ name: "", code: "", abbr: "", department: "", module_duration: 1 });
            setModuleTerms([]);
            closeModal();
            setStep("course");
            setIsSubmitting(false);
        }
    };

	console.log("Editting Course; ", formData)

	const handleDeleteCourse = async (courseId: number, courseName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete ${courseName} Course? This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (result.isConfirmed) {
			handleClose();
			try {
				await axios.delete(`/api/course/${courseId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `${courseName} Course has been deleted.`, "success");
				fetchCourses(searchTerm, page); // Refresh list
            	onSave(!saved);
			} catch (error) {
				console.error("Failed to delete classes", error);
				Swal.fire("Error", "Something went wrong. Could not delete the class.", "error");
			}
		}
	};

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
									Abbreviation
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Code
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Course Durations
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
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{filteredData.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No course found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((course) => (
									<TableRow key={course.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{course.name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{course.abbr}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{course.code}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<ul className="space-y-1">
												{course.durations.map((d, idx) => (
													<li key={idx}>
														<span className="font-semibold">{d.module_abbr}:</span> {d.duration} term(s)
													</li>
												))}
											</ul>
										</TableCell>
										<TableCell>
											<button
												title="Edit Course "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditCourse(course)}
											>
												<EyeIcon size={20} />
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
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    { step === "course" ?  (
                        <>
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Edit Course
                                </h4>
                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                    Expand the functionality and services offered in the institution
                                </p>
                            </div>

                            <form className="flex flex-col" onSubmit={handleInitialEdit}>
                                <div className="px-2 custom-scrollbar">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                        
                                        <div>
                                            <Label>Name</Label>
                                            <Input type="text"  name="name" value={formData.name} onChange={handleChange}  />  
                                        </div>

                                        <div>
                                            <Label>Abbreviation</Label>
                                            <Input type="text"   name="abbr" value={formData.abbr} onChange={handleChange} />  
                                        </div>

                                        <div className="">
                                            <Label>Code</Label>
                                            <Input type="text"   name="code" value={formData.code} onChange={handleChange} />  
                                        </div>

                                        <div className="">
                                            <Label>Modules</Label>
                                            <Input type="number" name="module_duration" value={formData.module_duration} min="1" onChange={handleChange} />  
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 py-4">
                                        <div className="overflow-visible">
                                            <Label>Department   [Currently: {editingCourse?.department_name}] </Label>
                                            <SearchableSelect items={departments} onSelect={handleSelect} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
									{isEditing ? (
										<button
											type="button"
											onClick={() => {
												if (editingCourse){
													handleDeleteCourse(editingCourse.id, editingCourse.name)
												}
											}}
											className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
										>
											Delete Course
										</button>
									) : (
										<Button size="sm" variant="outline" onClick={handleClose}>
											Close
										</Button>
									)}
									<button
										type="submit"
										className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
									>
										Save Class
									</button>
								</div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Edit Course Durations
                                </h4>
                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                    Improve functionality by setting terms for each module in the course.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h4 className="text-lg font-semibold mb-2">Edit Terms for Each Module</h4>
                                {moduleTerms.map((term, index) => (
                                    <div key={index}>
                                        <Label>Module {index + 1} - Terms</Label>
                                        <Input type="number" min="1" value={term} onChange={(e) => handleTermChange(index, parseInt(e.target.value))}
                                        />
                                    </div>
                                ))}

                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">
                                    <Button size="sm" variant="outline" onClick={() => setStep("course")}>
                                        Back
                                    </Button>
                                    <button
                                        onClick={handleFinalEdit}
                                        className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                    >
                                        {isSubmitting ? "Editting Course...." : "Edit Course"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
		</>
	);
}
