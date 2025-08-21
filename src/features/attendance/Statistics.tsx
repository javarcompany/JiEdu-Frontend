import {
    Table,
    TableBody,
    TableCell,
} from "../../components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import Badge from "../../components/ui/badge/Badge";

const ITEMS_PER_PAGE = 7;
const INTERVAL_MS = 3000;

export interface Register{
    id: number;
    student_passport: string;
    student_regno: string;
    student_fname: string;
    student_mname: string;
    student_sname: string;
    percentage: number;
}

export default function AttendanceSummary() {
    const token = localStorage.getItem("access");
    const [counts, setCount] = useState<Register[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchRegisters = async () => {
            try {
                const response = await axios.get("/api/attendance-summary/",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log("Registers: ", response.data)
                setCount(response.data);
            } catch (error) {
                console.error("Failed to fetch registers:", error);
            }
        };
        
        fetchRegisters();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPage((prev) => (prev + 1) % Math.ceil(counts.length / ITEMS_PER_PAGE));
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, [counts]);

    const currentRegisters = counts.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
    
    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Summary
                        </h3>
                    </div>
                </div>
                
                <div className="max-w-full overflow-x-auto relative overflow-hidden">
                    <Table>

                        {/* Table Body */}
                        <TableBody 
                            className="divide-y-8 divide-transparent overflow-hidden transition-transform duration-1000 ease-in-out"
                        >
                            <AnimatePresence>
                                {currentRegisters.map((register, index) => (
                                    <motion.tr
                                        key={register.student_regno || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="transition-all gap-4 overflow-hidden"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3 pl-2 py-2 dark:bg-gray-800 rounded-lg bg-blue-600 duration-300 ">
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    <img
                                                        src={register.student_passport  || "/default-avatar.png"}
                                                        alt={register.student_regno}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-theme-sm text-white/90">
                                                        {register.student_fname} {register.student_mname} {register.student_sname}
                                                    </span>
                                                    <span className="block text-white dark:text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {register.student_regno}
                                                    </span>
                                                    <Badge
                                                        size="sm"
                                                        color={
                                                            register.percentage >= 80
                                                            ? "success"

                                                            : register.percentage >= 50
                                                            ? "warning"

                                                            : register.percentage >= 25
                                                            ? "primary"
                                                            
                                                            : "error"
                                                        }
                                                    >
                                                        {register.percentage} %
                                                    </Badge>
                                                </div>

                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </div>

        </>
    );
  }
  