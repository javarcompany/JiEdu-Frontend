import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table";
import axios from "axios";
import {  UserCheck2Icon } from "lucide-react";
import { SearchButton } from "../../components/dashboard/SearchButton";
import Pagination from "../../components/ui/pagination";

import { useNavigate } from "react-router";
import debounce from "lodash.debounce";
import Badge from "../../components/ui/badge/Badge";

export interface Register{
    id: number;
    passport: string;
    regno: string;
    fname: string;
    mname: string;
    sname: string;
    unit_name: string;
    class_name: string;
    year_name: string;
    intake_name: string;
    day: string;
    lesson: string;
    dor_date: string;
    state: string;
    percentage: string;
}

export default function AttendancePreview() {
    const token = localStorage.getItem("access");

    const navigate = useNavigate();

    const [registers, setRegisters] = useState<Register[]>([]);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchRegisters = debounce(async (searchTerm, page=1) => {
        try {
            const response = await axios.get(`/api/attendance/?search=${searchTerm}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPage(response.data.page);
            setRegisters(response.data.results);
        setTotalPages(response.data.total_pages || response.data.num_pages || 1);
        } catch (error) {
            console.error("Failed to fetch registers", error);
        }
    }, 100);

    useEffect(() => {
        fetchRegisters(searchTerm, page);
    }, [page, searchTerm]);
    
    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Register
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchButton onSearch={setSearchTerm} />
                        <button onClick={() => navigate("/mark-attendance")} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <UserCheck2Icon />
                            Record Attendance
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
                                    Student
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
                                    Term
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Lesson
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody 
                            className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
                        >
                            {registers.length === 0 ? (
								<TableRow>
									<div className="p-4 text-sm text-gray-500">No Staff Workload found.....</div>
								</TableRow>
							) : (
                                registers.map((register) => (
                                    <TableRow key={register.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    <img
                                                        width={40}
                                                        height={40}
                                                        src={register.passport  || "/default-avatar.png"}
                                                        alt={register.regno}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {register.fname} {register.mname} {register.sname}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {register.regno}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {register.unit_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {register.class_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {register.year_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {register.intake_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {register.day} - {register.dor_date}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {register.lesson}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={
                                                    register.state === "Present"
                                                    ? "success"

                                                    : register.state === "Late"
                                                    ? "warning"
                                                    
                                                    : "error"
                                                }
                                            >
                                                {register.state}
                                            </Badge>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        </>
    );
  }
  