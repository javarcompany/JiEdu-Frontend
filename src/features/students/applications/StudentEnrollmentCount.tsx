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
    name: "Joined" | "Approved" | "Pending" | "Declined"; // Status of the product;
    count: string;
}

export function formatCount(count: number) {
	if (count >= 10000) {
		return `${Math.round(count / 1000)}K`;
	}
	return count.toLocaleString();
}

export default function StudentEnrollmentCount() {
    const [pending_enrollment, setPendingEnrollment] = useState(0);
    const [joined_enrollment, setJoinedEnrollment] = useState(0);
    const [approved_enrollment, setApprovedEnrollment] = useState(0);
    const [declined_enrollment, setDeclinedEnrollment] = useState(0);
    const token = localStorage.getItem("access");

    const tableData: Status[] = [
        {
            id: 1,
            name: "Joined",
            count: formatCount(joined_enrollment),
        },
        {
            id: 2,
            name: "Approved",
            count: formatCount(approved_enrollment),
        },
        {
            id: 3,
            name: "Pending",
            count: formatCount(pending_enrollment),
        },
        {
            id: 4,
            name: "Declined",
            count: formatCount(declined_enrollment),
        },
    ]

    useEffect(() => {
        const fetchPendingEnrollment = async () => {
            try {
                const response = await axios.get("/api/student_count/pending_enrollment",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setPendingEnrollment(response.data.count);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };

        const fetchDeclinedEnrollment = async () => {
            try {
                const response = await axios.get("/api/student_count/declined_enrollment",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setDeclinedEnrollment(response.data.count);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };

        const fetchApprovedEnrollment = async () => {
            try {
                const response = await axios.get("/api/student_count/approved_enrollment",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setApprovedEnrollment(response.data.count);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };

        const fetchJoinedEnrollment = async () => {
            try {
                const response = await axios.get("/api/student_count/joined_enrollment",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setJoinedEnrollment(response.data.count);
            } catch (error) {
                console.error("Failed to fetch student count:", error);
            }
        };

        fetchJoinedEnrollment();
        fetchApprovedEnrollment();
        fetchDeclinedEnrollment();
        fetchPendingEnrollment();
    }, []);

    return(
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Status
                    </h3>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>  
                    
                    {/* Table Body */}

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {tableData.map((state) => (
                            <TableRow key={state.id} className="">
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            state.name === "Joined"
                                            ? "success"

                                            : state.name === "Approved"
                                            ? "primary"

                                            : state.name === "Pending"
                                            ? "warning"

                                            : "error"
                                        }
                                        >
                                        {state.name}
                                    </Badge>
                                </TableCell>

                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {state.count}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};