import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../../components/ui/table";
import axios from "axios";
import { CalendarPlus2Icon, FileEditIcon } from "lucide-react";
import { SearchButton } from "../../../components/dashboard/SearchButton";
import Pagination from "../../../components/ui/pagination";

import { useNavigate } from "react-router";
import debounce from "lodash.debounce";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import DictSearchableSelect from "../../../components/form/DictSelect";
import Button from "../../../components/ui/button/Button";
import Swal from "sweetalert2";

export interface TimeTable {
	id: number;
    year: string;
    intake: string;
    course: string;
    branch: string;
    module: string;
	Class: string;
    class_name: string;
    day_name: string;
    classroom_name: string;
	lesson_name: string;
	lecturer_fname: string;
	lecturer_mname: string;
	lecturer_sname: string;
	lecturer_regno: string;
    unit_name: string;
    unit_uncode: string;
}

export default function TimetablePreview() {
    const token = localStorage.getItem("access");

	const navigate = useNavigate();

	const [lessons, setLessons] = useState<TimeTable[]>([]);

	const [searchTerm, setSearchTerm] = useState<string>("");

	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [saving, setSaving] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const [selectedTable, setSelectedTable] = useState<TimeTable | null>(null);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);
	const [selectedTime, setSelectedTime] = useState<number | null>(null);
	const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
	const [resetKey, setResetKey] = useState(0);
	const [lessonresetKey, setLessonResetKey] = useState(0);
	
	const [days, setDays] = useState<{
		value: string;
        label: string;
	}[]>([]);
	const [classrooms, setClassrooms] = useState<{
		value: string;
        label: string;
	}[]>([]);
	const [times, setTimes] = useState<{
		value: string;
        label: string;
	}[]>([]);

	const isClassroomDisabled = !selectedTime;
	const isLessonDisabled = !selectedDay;

	const fetchTables = debounce(async (searchTerm, page=1) => {
		try {
			const response = await axios.get(`/api/tables/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setPage(response.data.page);
			setLessons(response.data.results);
		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Staffs", error);
		}
	}, 100);

	useEffect(() => {
		fetchTables(searchTerm, page);
	}, [page, searchTerm]);

	useEffect(() => {
        if (selectedDay) {
            const fetchAvailableSlots = async () => {
                const response = await axios.get(`/api/available-slots?class_id=${selectedTable?.Class}&day=${selectedDay}`, {
                        headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data.map((lesson: any) => ({
                        value: lesson.id.toString(),
                        label: lesson.name,
                }));
                setTimes(data);
            }

            fetchAvailableSlots();

			const fetchClassrooms = async () => {
				try {
					const response = await axios.get(`/api/classrooms/?all=true`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const formatted = response.data.results.map((lesson: any) => ({
						value: lesson.id.toString(),
						label: lesson.name,
					}));
					setClassrooms(formatted);
				} catch (error) {
				console.error("Failed to load classrooms", error);
				}
			};
        	fetchClassrooms();
            
        } else {
            setTimes([]);
        }

    }, [selectedDay]);

	const fetchDaysForTable = async () => {
		try {
			const response = await axios.get(`/api/days/?all=true`, {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			});
			const formatted = response.data.results.map((day: any) => ({
				value: day.id.toString(),
				label: day.name
			}));
			setDays(formatted);
		} catch (error) {
			console.error("Failed to fetch days", error);
		}
	};

	const handleEditTable = async (table: TimeTable) => {
		setSelectedTable(table);
		fetchDaysForTable();
		setIsOpen(true);
		
		setSelectedDay(null);
		setSelectedClassroom(null);
		setSelectedTime(null);
		setResetKey(prev => prev+1);
		setLessonResetKey(prev => prev + 1);
	}

	const closeModal = () => {
		setIsOpen(false);
		setSelectedTable(null);
		setSelectedDay(null);
	};

	const handleSelectDay = (val: number | string, key: string) => {
		setLessonResetKey(prev => prev + 1);
		setSelectedTime(null);
		if (key === "id") {
			setSelectedDay(Number(val));
		}
	};
	const handleSelectLessons = (val: number | string, key: string) => {
		if (key === "id") {
			setSelectedTime(Number(val));
		}
		setResetKey(prev => prev+1);
		setSelectedClassroom(null);
	};
	const handleSelectClassroom = (val: number | string, key: string) => {
		if (key === "id") {
			setSelectedClassroom(Number(val));
		}
	};
	
	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedDay || !selectedTime || !selectedClassroom) return;

		try {
			setSaving(true);
			const response = await axios.post(
				`api/change-timetable/`,
				{},
				{ 
					headers: { Authorization: `Bearer ${token}` },
					params: { table_id: selectedTable?.id, 
							day_id: selectedDay, 
							time_id: selectedTime,
							classroom_id: selectedClassroom
					}
				}
			);
			if (response.data.success){
				Swal.fire("Success", response.data.success, "success");
				closeModal();
				setSearchTerm("");
				fetchTables(searchTerm, page);
			}
			if (response.data.error){
				Swal.fire("Error", response.data.error, "error");
				return;
			}
		} catch (error: any) {
			console.error("Failed to update timetable", error);
			Swal.fire(
				"Error",
				error.response?.data?.error || "An unexpected error occurred.",
				"error"
			);
		} finally {
			setSaving(false);
		}
	};

    return (
		<>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Timetable
						</h3>
					</div>

					<div className="flex items-center gap-3">
						<SearchButton onSearch={setSearchTerm} />
						<button onClick={() => navigate("/add-timetable")} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
							<CalendarPlus2Icon />
							Add Timetable
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
									Term
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Course
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Class
								</TableCell>

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
									Unit
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
							{lessons.length === 0 ? (
								<TableRow>
                                    <TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
									    <div className="p-4 text-sm text-gray-500">No Timetable found.....</div>
                                    </TableCell>
								</TableRow>
							) : (
								lessons.map((lesson) => (
									<TableRow key={lesson.id} className="">
										<TableCell className="py-3">
											<div className="flex items-center gap-3">
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{lesson.year}
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														{lesson.intake}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.course}
											<div>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													{lesson.module}
												</span>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.class_name}
											<div>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													{lesson.classroom_name}
												</span>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											{lesson.day_name}
											<div>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													{lesson.lesson_name}
												</span>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{lesson.unit_uncode} ({lesson.unit_name})
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														{lesson.lecturer_fname} {lesson.lecturer_mname} {lesson.lecturer_sname} - {lesson.lecturer_regno}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
													title="Edit Timetable"
													className="text-blue-500 hover:text-red-600 transition-colors  px-4"
													onClick={() => handleEditTable(lesson)}
												>
												<FileEditIcon size={20} />
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
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedTable?.class_name}'s Timetable
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand functionality of the system by modifying the timetable values.
                        </p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Day</Label>
									<DictSearchableSelect
										items={days}
										placeholder= "Select Day"
										onSelect={(val) => handleSelectDay(val, "id")}
									/>
                                </div>

								<div>
                                    <Label>Lesson</Label>
									<DictSearchableSelect
										items={times}
										resetTrigger={lessonresetKey} 
										placeholder={isLessonDisabled ? "Select Day to enable." : "Select Lesson..."}
										disabled={isLessonDisabled}
										onSelect={async (val) => {
											// If no conflict, update state
											handleSelectLessons(val, "id")
										}}
									/>
                                </div>

								<div>
                                    <Label>Classroom</Label>
									<DictSearchableSelect
										items={classrooms}
										resetTrigger={resetKey} 
										placeholder={isClassroomDisabled ? "Select Day and Lesson to enable." : "Select Classroom..."}
										disabled={isClassroomDisabled}
										onSelect={async (val) => {
											const response = await axios.get("/api/check_classroom_conflict/", {
												params: {
													classroom_id: val,
													lesson_id: selectedTime,
													day: selectedDay,
													class_id: selectedTable?.Class,
												},
												headers: { Authorization: `Bearer ${token}` },
											});

											if (response.data.conflict) {
												Swal.fire({
													icon: "error",
													title: "Conflict Detected",
													text: response.data.message,
												});
												setResetKey(prev => prev + 1);
												return; // Don't set selection
											}

											// If no conflict, update state
											handleSelectClassroom(val, "id")
										}}
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
								disabled={saving}
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                {saving ? "Saving..." : "Change Timetable"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
    );
  }
  