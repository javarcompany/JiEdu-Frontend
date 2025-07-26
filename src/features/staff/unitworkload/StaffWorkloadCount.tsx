import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "../../../components/ui/table"
import Badge from "../../../components/ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
  
interface Status {
    id: number;
    load_state_name: string;
    staff_count: number;
}

export function formatCount(count: number) {
	if (count >= 10000) {
		return `${Math.round(count / 1000)}K`;
	}
	return count.toLocaleString();
}

export default function StaffWorkloadCount() {
    const [staffcount, setStaffCount] = useState<Status[]>([]);
    const token = localStorage.getItem("access");
    useEffect(() => {
        const fetchStaffCount = async () => {
            try {
                const response = await axios.get("/api/staffs/load_counts",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setStaffCount(response.data);
            } catch (error) {
                console.error("Failed to fetch staff count:", error);
            }
        };
        fetchStaffCount();
    }, []);

    return(
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Load
                    </h3>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>  
                    
                    {/* Table Body */}

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {staffcount.map((staff) => (
                            <TableRow key={staff.id} className="">
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            staff.load_state_name === "Available"
                                            ? "success"
                                            : staff.load_state_name === "Average"
                                            ? "primary"
                                            : staff.load_state_name === "Above Optimum"
                                            ? "warning"
                                            : "error"
                                        }
                                        >
                                        {staff.load_state_name}
                                    </Badge>
                                </TableCell>

                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {formatCount(staff.staff_count)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};