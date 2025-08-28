import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import { TimeTable } from "../../timetable/dashboard/TablesPreview";
import { Day } from "../../timetable/setup/Days";
import { Lesson } from "../../timetable/setup/SetupPreview";

export default function TutorTimetable({staff_regno}: {staff_regno: string}) {
    const token = localStorage.getItem("access");

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [days, setDays] = useState<Day[]>([]);
    const [timetables, setTables] = useState<TimeTable[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const response = await axios.get(`/api/timetable/staff/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {staff_regno: staff_regno}
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

        fetchTimetables();

    }, []);

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading timetable...</div>;
    }

    if (error) {
        return <div className="p-4 text-sm text-red-500">Error Loading timetable...</div>;
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
                        {entry.class_name}
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 bg-blue-800 dark:border-white/[0.05] dark:bg-gray-900">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-white text-start text-theme-sm dark:text-gray-400"
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