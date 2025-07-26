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

const ITEMS_PER_PAGE = 4;
const INTERVAL_MS = 3000;

interface Department {
    id: number;
    department_name: string;
    student_count: number;
}

export default function StudentDepartment() {
    const token = localStorage.getItem("access");
    const [counts, setCount] = useState<Department[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchAllocation = async () => {
            try {
                const response = await axios.get("/api/students/department_counts",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setCount(response.data);
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
                        Department
                    </h3>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>  
                    {/* Table Header */}
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Department
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

                    <TableBody className="overflow-hidden scrollbar-hide divide-y divide-gray-100 dark:divide-gray-800">
                        <AnimatePresence mode="wait">
                            {currentItems.map((department, index) => (
                                <motion.tr
                                    key={department.department_name || `Unassigned-${index}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="transition-all duration-300"
                                >
                                    
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {department.department_name}
                                </TableCell>

                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {department.student_count}
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