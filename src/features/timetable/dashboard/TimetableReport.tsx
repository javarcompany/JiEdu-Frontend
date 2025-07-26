import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableHeader,
    TableCell,
    TableRow,
} from "../../../components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface CurrentLesson {
    id: number;
    class_name: string;
    unit: string;
    lecturer: string;
    classroom: string;
}

const ITEMS_PER_PAGE = 4;
const INTERVAL_MS = 3000;

export default function TimetableDepartment() {
    const [currentLessons, setCurrentLesson] = useState<CurrentLesson[]>([]);
    
    const [page, setPage] = useState(0);
	const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchLessons = () => {
            axios
                .get("/api/timetable/current-lessons/", {
                headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                setCurrentLesson(res.data);
                })
                .catch((err) => console.error("Error fetching lessons:", err));
        };

        fetchLessons(); // Fetch immediately on mount

        // Calculate time until the next :00 or :30 mark
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        let delayMinutes = 0;
        if (minutes < 30) {
            delayMinutes = 30 - minutes;
        } else {
            delayMinutes = 60 - minutes;
        }

        const delay = (delayMinutes * 60 - seconds) * 1000 - milliseconds;

        const initialTimeout = setTimeout(() => {
            fetchLessons(); // Fetch at the next aligned time
            const interval = setInterval(fetchLessons, 30 * 60 * 1000); // Then every 30 mins

            // Clear interval on unmount
            return () => clearInterval(interval);
        }, delay);

        // Cleanup
        return () => clearTimeout(initialTimeout);
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPage((prev) => (prev + 1) % Math.ceil(currentLessons.length / ITEMS_PER_PAGE));
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, [currentLessons]);
    
    const currentItems = currentLessons.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

    return(
        <div className="overflow-hidden hover:shadow-lg hover:border hover:border-brand-500 bg-blue-900 text-white rounded-2xl border border-gray-200 px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white/90">
                        Current Lessons
                    </h3>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>  
                    {/* Table Header */}
                    <TableHeader className="border-blue-900 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-yellow-400 text-start text-theme-xs dark:text-gray-400"
                            >
                                Class
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-yellow-400 text-end text-theme-xs dark:text-gray-400"
                            >
                                Lesson
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        <AnimatePresence mode="wait">
                            {currentItems.map((lesson, index) => (
                                <motion.tr
                                    key={lesson.class_name || `Unassigned-${index}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="transition-all duration-300"
                                >
                                    <TableCell className="py-3 text-white text-theme-sm dark:text-gray-400">
                                        {lesson.class_name}
                                    </TableCell>

                                    <TableCell className="py-3 text-white text-theme-sm text-end dark:text-gray-400">
                                        <p className="text-white text-theme-xs dark:text-gray-400">
                                            {lesson.unit}
                                        </p>
                                        <span className="text-white text-theme-xs dark:text-gray-400">
                                            {lesson.lecturer} - {lesson.classroom}
                                        </span>
                                    </TableCell>
                            
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};