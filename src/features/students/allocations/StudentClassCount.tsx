import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableHeader,
    TableCell,
    TableRow,
} from "../../../components/ui/table";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export interface Classes {
    class_name: string;
    student_count: number;
}

const ITEMS_PER_PAGE = 4;
const INTERVAL_MS = 3000;

export default function StudentClassCount() {
    const token = localStorage.getItem("access");
    const [counts, setAllocation] = useState<Classes[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchAllocation = async () => {
            try {
                const response = await axios.get("/api/students-allocations/class_counts",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setAllocation(response.data);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };
        
        
        fetchAllocation();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPage((prev) => (prev + 1) % Math.ceil(counts.length / ITEMS_PER_PAGE));
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, [counts]);

    const currentItems = counts.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

    return(
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Class Allocation
                    </h3>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto relative overflow-hidden">
                <Table>  
                    {/* Table Header */}
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Class
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Students
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}

                    <TableBody className="overflow-hidden scrollbar-hide divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out">
                        <AnimatePresence mode="wait">
                            {currentItems.map((class_, index) => (
                                <motion.tr
                                    key={class_.class_name || `Unassigned-${index}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="transition-all gap-4 overflow-hidden"
                                >
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {class_.class_name || "Unassigned"}
                                        </TableCell>

                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {class_.student_count}
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