import { useEffect, useState } from "react";
import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { BoxIcon, PieChartIcon } from "../../../icons";
import axios from "axios";
import Actions from "./Actions";

function formatCount(count: number) {
	if (count >= 10000) {
		return `${Math.round(count / 1000)}K`;
	}
	return count.toLocaleString();
}

// Helper to calculate percent change
export function calculatePercentageChange(current: number, previous: number): string {
	if ((previous === 0) && (current === 0)) return "0%";
    if (previous === 0)  return "+100%";
	const change = ((current - previous) / previous) * 100;
    const rounded = Math.round(Math.abs(change));
    const prefix = change > 0 ? "+" : change < 0 ? "-" : "";
    return `${prefix}${rounded}%`;
}

export default function StudentActions() {
    const [pending_allocation, setPendingAllocation] = useState(0);
    const [pending_enrollment, setPendingEnrollment] = useState(0);
	const [enrollment, setEnrollment] = useState({ current: 0, previous: 0 });

    const token = localStorage.getItem("access");
    useEffect(() => {
		const fetchPendingAllocation = async () => {
			try {
				const response = await axios.get("/api/student_count/pending_allocation",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setPendingAllocation(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

        const fetchEnrollmentComparison = async () => {
			try {
				const response = await axios.get("/api/student-count-enrollment", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setEnrollment({
					current: response.data.current,
					previous: response.data.previous,
				});
			} catch (error) {
				console.error("Failed to fetch enrollment data:", error);
			}
		};

        const fetchPendingEnrollment = async () => {
			try {
				const response = await axios.get("/api/student_count/enrollment",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setPendingEnrollment(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

		fetchPendingAllocation();
        fetchPendingEnrollment();
		fetchEnrollmentComparison();
	}, []);

    const enrollmentRate = calculatePercentageChange(enrollment.current, enrollment.previous);

    return (
        <div className="flex flex-wrap gap-4 md:gap-6">
            <div className="w-full sm:w-auto flex-1 min-w-[250px]">
                <ClickableStatCard
                    title="Enrollments"
                    value={formatCount(pending_enrollment)}
                    percentageChange={enrollmentRate}
                    contextText="vs last intake"
                    classvalue={
                        enrollmentRate.includes("+")
                            ? "bg-green-800 dark:text-white text-white"
                            : enrollmentRate.includes("-")
                            ? "bg-red-600 dark:text-white text-white"
                            : "bg-gray-700 dark:text-white text-white"
                    }
                    icon={<BoxIcon className="w-5 h-5" />}
                    href="/enrollments"
                />
            </div>
            <div className="w-full sm:w-auto flex-1 min-w-[250px]">
                <ClickableStatCard
                    title="Allocations"
                    value={formatCount(pending_allocation)}
                    percentageChange="Pending"
                    contextText="students"
                    classvalue="bg-red-800  dark:text-white-900 text-white"
                    href="/allocations"
                    icon={<PieChartIcon className="w-5 h-5" />}
                />
            </div>
            <div className="w-full sm:w-auto flex-1 min-w-[250px]">
                <Actions />
            </div>
        </div>
    )
}