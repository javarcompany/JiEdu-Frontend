import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import axios from "axios";
import { Calendar1Icon, Trash2 } from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import Swal from "sweetalert2";
import Select from "../../../components/form/Select";

import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";

export interface Day {
	id: number;
    name: string;
}

export default function DaysPreview() {
    const token = localStorage.getItem("access");
	const [days, setDays] = useState<Day[]>([]);
	const { isOpen, openModal, closeModal } = useModal();

	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [daysoptions, setDaysOptions] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

	console.log("Days: ", days)

	const [formData, setFormData] = useState({
        name: "",
    });

	const fetchDays = debounce( async (page = 1) => {
		axios.get(`/api/days/?page=${page}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.then(response => {
			setDays(response.data.results);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setPage(response.data.page);
		})
		.catch(error => {
			console.error("Error fetching days:", error);
		});
	}, 100);

	useEffect(() => {
		const fetchDaysOptions = async () => {
            axios.get('/api/days-options/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                setDaysOptions(response.data);
            })
            .catch(error => {
                console.error("Error fetching days choices:", error);
            });
        };

		fetchDaysOptions();
		fetchDays(page);
	}, [page]);

	const handleSelectChange = (option: any, field: string) => {
        console.log(field, ":", option )
        if (!option) return; // handle deselection
        const value = typeof option === 'string' ? option : option?.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
	
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh

        try {
            await axios.post("/api/days/", 
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            Swal.fire("Success", "Day added successfully!", "success");
            setFormData({ name: ""});
            closeModal();
        } catch (err: any) {
			const errorMsg = err?.response?.data?.name || "An unexpected error occurred";
			Swal.fire("Error", `${errorMsg}`, "error");
			setFormData({ name: "" });
			closeModal();
		}
    };
	
	const handleDeleteDay = async (dayId: number, dayName: string) => {
		const confirmed = await Swal.fire({
			title: "Are you sure?",
			text: `You are about to delete "${dayName}". This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (confirmed.isConfirmed) {
			try {
				await axios.delete(`/api/days/${dayId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${dayName}" has been removed.`, "success");
				fetchDays(page); // Refresh list
			} catch (error) {
				console.error("Error deleting day:", error);
				Swal.fire("Error", "Failed to delete the day.", "error");
			}
		}
	};


    return (
		<>
			<div className="overflow-hidden py-4 rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Week Days
						</h3>
					</div>

					<div className="flex items-center gap-3">
						<button onClick={openModal} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
							<Calendar1Icon />
							Add Day
						</button>
					</div>
				</div>
				
				<div className="max-w-full overflow-x-auto relative overflow-hidden">
					<Table> 
						
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Day
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									.
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
							className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
						>
							{days.length === 0 ? (
								<TableRow>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No day found....</div>
									</TableCell>
								</TableRow>
							) : (

								days.map((day) => (
									<TableRow key={day.id} className="">

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{day.name}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														.
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">

											<button
												title="Delete Day"
												className="text-red-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleDeleteDay(day.id, day.name)}
											>
												<Trash2 size={16} />
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

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Day
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand Timetable functionality
                        </p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Name</Label>
                                    <Select
										options={daysoptions}
										placeholder = "Select day"
										onChange={(name) => handleSelectChange(name, "name")}
									/>
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>

                            <button
                                type="submit"
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Save Day
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
    );
  }
  