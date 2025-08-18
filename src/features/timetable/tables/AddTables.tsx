import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import DictSearchableSelect from "../../../components/form/DictSelect";
import Swal from "sweetalert2";

export type SelectOption = {
    value: string;
    label: string;
    branch: string;
    course: string;
    module: string;
    term: string;
    class_: string;
};

export type SelectedIds = {
    workload?: number;
    classroom?: number;
    lesson?: number;
    [key: string]: number | undefined;
};

export default function AddTable({filters, setFilters, setSelectedIds }: { filters: { branch: string; course: string; module: string; term: string; class_: string; day: string; }; setFilters: React.Dispatch<React.SetStateAction<{ branch: string, course: string, module: string, term: string, class_: string, day: string }>>; setSelectedIds: React.Dispatch<React.SetStateAction<SelectedIds[]>>; }) {
    const { class_, branch } = filters;
    const token = localStorage.getItem("access");
    const [workloads, setWorkloads] = useState<SelectOption[]>([]);

    const [days, setDays] = useState<SelectOption[]>([]);
    const [classrooms, setClassrooms] = useState<SelectOption[]>([]);

    const isSelectionDisabled = !filters.class_ || !filters.day;

    const [resetKey, setResetKey] = useState(0);

    const [lessonSelections, setLessonSelections] = useState<{
        [lessonId: string]: { workload?: string; classroom?: string };
    }>({});

    const [availableLessons, setAvailableLessons] = useState<SelectOption[]>([]);

    const [page, setPage] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(true);
 
    const fetchWorkloads = debounce(async () => {
        try {
            const response = await axios.get(`/api/staff-workloads/?all=true`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const formatted = response.data.results.map((workload: any) => ({
                value: workload.id.toString(),
                label: workload.staff_regno + ' (' + workload.unit_name+ ')',
                class_: workload.Class
            }));
            setWorkloads(formatted);
            setLoading(false);
            setPage(response.data.page || 1);
        } catch (error) {
            console.error("Failed to fetch Workloads: ", error);
            setLoading(false);
        }
    }, 100);

    useEffect(() => {
        if (!token) {return;}

        const fetchDays = async () => {
            try {
                const response = await axios.get(`/api/days/?all=true`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((day: any) => ({
                    value: day.id.toString(),
                    label: day.name,
                }));
                setDays(formatted);
            } catch (error) {
            console.error("Failed to load days", error);
            }
        };

        const fetchClassrooms = async () => {
            try {
                const response = await axios.get(`/api/classrooms/?all=true`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((classroom: any) => ({
                    value: classroom.id.toString(),
                    label: classroom.name,
                    branch: classroom.branch
                }));
                setClassrooms(formatted);
            } catch (error) {
            console.error("Failed to load classrooms", error);
            }
        };

        fetchWorkloads();
        fetchDays();
        fetchClassrooms();
    },[token, page]);

    useEffect(() => {
        const updatedSelections: SelectedIds[] = Object.entries(lessonSelections).map(([lessonId, values]) => ({
            lesson: Number(lessonId),
            workload: values.workload ? Number(values.workload) : undefined,
            classroom: values.classroom ? Number(values.classroom) : undefined,
        }));

        setSelectedIds(updatedSelections);
    }, [lessonSelections]);

    useEffect(() => {
        if (filters.class_ && filters.day) {
            const fetchAvailableSlots = async () => {
                const response = await axios.get(`/api/available-slots?class_id=${filters.class_}&day=${filters.day}`, {
                        headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data.map((lesson: any) => ({
                        value: lesson.id.toString(),
                        label: lesson.name,
                }));
                setAvailableLessons(data);
                setSelectedIds([]);
                setLessonSelections({});
            }

            fetchAvailableSlots();
            
        } else {
            setAvailableLessons([]);
        }

    }, [filters.class_, filters.day]);

    const filteredData = workloads.filter((workload) => {
        const matchesClass = !class_ || workload.class_.toString() === class_;
        return matchesClass;
    });

    const filteredClassroom = classrooms.filter((classroom) => {
        const matchesBranch = !branch || classroom.branch.toString() === branch;
        return matchesBranch;
    });
 
    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading timetable data...</div>;
    }

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Add Timetable
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
						<DictSearchableSelect
                            items={days}
                            placeholder="Select Day..."
                            onSelect={(val) =>
                                setFilters({ ...filters, day: val })
                            }
                        />
					</div>
                </div>

                <div className="max-w-full">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>

                                {["Lesson", "Unit", "Classroom"].map((header) => (
                                    <TableCell
                                        key={header}
                                        isHeader
                                        className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                                
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {availableLessons.length === 0 ? (
                                <TableRow>
                                    <TableCell>
                                        <div className="p-4 text-sm text-gray-500">
                                            All Lessons are booked...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                availableLessons.map(({ label, value }) => (
                                    <TableRow key={value} className="py-4">
                                        <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                                            <p className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                                {label}
                                            </p>
                                        </TableCell>

                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="px-3">
                                                <DictSearchableSelect
                                                    items={filteredData}
                                                    resetTrigger={resetKey} 
                                                    placeholder={isSelectionDisabled ? "Select Class and Day to enable." : "Select Workload..."}
                                                    disabled={isSelectionDisabled}
                                                    onSelect={async (val) => {
                                                        const response = await axios.get("/api/check_trainer_conflict/", {
                                                            params: {
                                                                workload_id: val,
                                                                lesson_id: value,
                                                                day: filters.day,
                                                                class_id: filters.class_,
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
                                                            return;  // Don't update state
                                                        }

                                                        // Update selection if no conflict
                                                        setLessonSelections((prev) => ({
                                                            ...prev,
                                                            [value]: {
                                                                ...prev[value],
                                                                workload: val,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="px-3">
                                                <DictSearchableSelect
                                                    items={filteredClassroom}
                                                    resetTrigger={resetKey} 
                                                    placeholder={isSelectionDisabled ? "Select Class and Day to enable." : "Select Classroom..."}
                                                    disabled={isSelectionDisabled}
                                                    onSelect={async (val) => {
                                                        const response = await axios.get("/api/check_classroom_conflict/", {
                                                            params: {
                                                                classroom_id: val,
                                                                lesson_id: value,
                                                                day: filters.day,
                                                                class_id: filters.class_,
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
                                                        setLessonSelections((prev) => ({
                                                            ...prev,
                                                            [value]: {
                                                                ...prev[value],
                                                                classroom: val,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </>
    );
  }
  