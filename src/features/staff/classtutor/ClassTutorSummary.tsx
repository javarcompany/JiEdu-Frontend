import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableHeader,
    TableCell,
    TableRow,
} from "../../../components/ui/table"
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const ITEMS_PER_PAGE = 8;
const INTERVAL_MS = 3000;

interface Classes {
    id: number;
    name: string;
}

export default function ClassTutorSummary({ save }: { save:boolean; }) {
    const token = localStorage.getItem("access");
    
    const [counts, setCount] = useState<Classes[]>([]);
    const [page, setPage] = useState(0);
 
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("/api/unassigned-classes/",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setCount(response.data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };
        
        
        fetchClasses();
    }, [save]);

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
                        Classes
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
                                Pending Classes
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        <AnimatePresence mode="wait">
                            {currentItems.map((class_, index) => (
                                <motion.tr
                                    key={class_.name || `Unassigned-${index}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="transition-all duration-300 overflow-hidden"
                                >
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {class_.name}
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