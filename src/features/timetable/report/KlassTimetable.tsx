import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import { TimeTable } from "../dashboard/TablesPreview";
import { Day } from "../setup/Days";
import { Lesson } from "../setup/SetupPreview";

import DictSearchableSelect from "../../../components/form/DictSelect";
import { PrinterIcon } from "lucide-react";

type SelectOption = {
    value: string;
    label: string;
    class_?: string;
    term?: string;
};

export default function KlassTimetable({branch}: {branch: string}) {
    const token = localStorage.getItem("access");
    const [resetKey, setResetKey] = useState(0);
    const [filters, setFilters] = useState<SelectOption>({
        value:"", label: "", class_:"", term: ""
    });
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [days, setDays] = useState<Day[]>([]);
    const [timetables, setTables] = useState<TimeTable[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [terms, setTerms] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);
    const [selectedClass, setSelectedClass] = useState("0");
    
    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const response = await axios.get(`/api/timetable/class/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {class_id: selectedClass, branch_id: branch}
                    }
                );
                setDays(response.data.days);
                setTables(response.data.timetable);
                setLessons(response.data.lessons);
            } catch (error) {
                console.error("Failed to fetch Timetable", error);
                setError('Failed to fetch timetable');
            } finally{
                setLoading(false);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get(`/api/classes/?all=true`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((cls: any) => ({
                    value: cls.id.toString(),
                    label: cls.name.toString(),
                    term: cls.intake.toString()
                }));
                setClasses(formatted);
            } catch (error) {
                console.error("Failed to load classes", error);
            }
        };

        const fetchTerms = async () => {
            try {
                const response = await axios.get("/api/terms/?range=1", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((term: any) => ({
                    value: term.id.toString(),
                    label: term.termyear
                }));
                setTerms(formatted);
            } catch (error) {
                console.error("Failed to load intakes", error);
            }
        };

        fetchClasses();
        fetchTerms();

        fetchTimetables();

    }, [selectedClass]);

    useEffect(() => {
        setResetKey(prev => prev + 1);
        setClasses([]);

        const fetchTimetables = async () => {
            try {
                const response = await axios.get(`/api/timetable/class/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {class_id: selectedClass, branch_id: branch}
                    }
                );
                setDays(response.data.days);
                setTables(response.data.timetable);
                setLessons(response.data.lessons);
            } catch (error) {
                console.error("Failed to fetch Timetable", error);
                setError('Failed to fetch timetable');
            } finally{
                setLoading(false);
            }
        };
        
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`/api/classes/?branch_id=${branch}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((cls: any) => ({
                    value: cls.id.toString(),
                    label: cls.name.toString(),
                    term: cls.intake.toString()
                }));
                setClasses(formatted);
            } catch (error) {
                console.error("Failed to load classes", error);
            }
        };

        fetchClasses();
        fetchTimetables();
    }, [branch])

	const filteredClasses = classes.filter((cls) => {
        const intakeMatch = !filters.term || cls.term?.toString() === filters.term;
        return intakeMatch;
    });

    const handleChangeTerm = async (selected_id: string) => {
        setResetKey(prev => prev + 1);
        setFilters({ ...filters, term: selected_id, class_: "" });
    };

    const handleSelectClass = async (selected_id: string) => {
		setSelectedClass(selected_id);
    };

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading timetable...</div>;
    }

    if (error) {
        return <div className="p-4 text-sm text-red-500">Error Loading timetable...{error}</div>;
    }

    // Helper: Get entry by day + lesson
    const getCell = (day: string, lessonName: string) => {
        const entry = timetables.find(
            e => e.day_name === day && e.lesson_name === lessonName
        );
        return entry ? (
            <div className="">
                <div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {entry.unit_name}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {entry.lecturer_fname} {entry.lecturer_mname}
                    </span><br/>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {entry.classroom_name}
                    </span>
                </div>
            </div>
        ) : null;
    };

    return(
        <>
            {/* Header Actions */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="col-span-4 flex gap-4">
                    <DictSearchableSelect
                        items={terms}
                        placeholder="Select Term..."
                        onSelect={(val) => handleChangeTerm(val)}
                    />
                    <DictSearchableSelect
                        items={filteredClasses}
                        resetTrigger={resetKey}
                        placeholder="Select Class.."
                        onSelect={(val) => handleSelectClass(val)}
                    />
                </div>

                <div className="">
                    Timetable Report
                </div>

                <button
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-blue-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-gray-200"
                >
                    <PrinterIcon size={18} /> Print Timetable
                </button>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 bg-blue-800 dark:border-white/[0.05] dark:bg-gray-900">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 font-medium text-white text-start text-theme-sm dark:text-gray-400"
                                >
                                    Day
                                </TableCell>
                                {lessons.map(lesson => (
                                    <TableCell
                                        key={lesson.id}
                                        isHeader
                                        className="px-5 py-3 font-medium text-white text-center text-theme-xs dark:text-gray-400"
                                    >
                                        {lesson.name}<br/>
                                        {lesson.start}-{lesson.end}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {days.map(day => (
                            
                                <TableRow key={day.id}>
                                    <TableCell className="px-5 py-1 sm:px-6 text-start">
                                        <p className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                                            {day.name}
                                        </p>
                                    </TableCell>
                                    
                                    {lessons.map(lesson => (
                                        <TableCell className="px-5 py-1 sm:px-6 text-center" key={lesson.id}>
                                            {getCell(day.name, lesson.name)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
            </div>
        </>
    )
}