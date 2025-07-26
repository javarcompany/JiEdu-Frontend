import { useEffect, useState } from "react";
import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { FileIcon, GroupIcon } from "../../../icons";
import axios from "axios";

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

export default function StaffActions() {
    const [workload_count, setWorkloadCount] = useState(0);
    const [tutor_count, setTutorCount] = useState(0);
    const [workload, setWorkload] = useState({ current: 0, previous: 0 });
    const [tutor, setTutor] = useState({ current: 0, previous: 0 });

    const token = localStorage.getItem("access");
    useEffect(() => {
		const fetchWorkloadCount = async () => {
			try {
				const response = await axios.get("/api/staff_count/workload/",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setWorkloadCount(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

        const fetchEnrollmentComparison = async () => {
			try {
				const response = await axios.get("/api/staff-workload-count-comparision", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setWorkload({
					current: response.data.current,
					previous: response.data.previous,
				});
			} catch (error) {
				console.error("Failed to fetch enrollment data:", error);
			}
		};

        const fetchTutorComparison = async () => {
			try {
				const response = await axios.get("/api/staff-tutor-count-comparision", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setTutor({
					current: response.data.current,
					previous: response.data.previous,
				});
			} catch (error) {
				console.error("Failed to fetch enrollment data:", error);
			}
		};

        const fetchTutorCount = async () => {
			try {
				const response = await axios.get("/api/staff_count/tutor/",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setTutorCount(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

		fetchWorkloadCount();
        fetchTutorCount();
        fetchEnrollmentComparison();
        fetchTutorComparison();
	}, []);

    const workloadRate = calculatePercentageChange(workload.current, workload.previous);
    const tutorRate = calculatePercentageChange(tutor.current, tutor.previous);

    return (
        <div className="grid grid-cols-12 gap-4 md:col-span-12">
            <div className="col-span-12">
                <ClickableStatCard
                    title="Unit Workloads"
                    value={formatCount(workload_count)}
                    percentageChange={workloadRate}
                    contextText="vs last intake"
                    classvalue={
                        workloadRate.includes("+")
                            ? "bg-green-800 dark:text-white text-white"
                            : workloadRate.includes("-")
                            ? "bg-red-600 dark:text-white text-white"
                            : "bg-gray-700 dark:text-white text-white"
                    }
                    icon={<FileIcon className="w-5 h-5" />}
                    href="/unit-workload"
                />
            </div>

            <div className="col-span-12 py-4">
                <ClickableStatCard
                    title="Class Tutors"
                    value={formatCount(tutor_count)}
                    percentageChange={tutorRate}
                    classvalue={
                        tutorRate.includes("+")
                            ? "bg-green-800 dark:text-white text-white"
                            : tutorRate.includes("-")
                            ? "bg-red-600 dark:text-white text-white"
                            : "bg-gray-700 dark:text-white text-white"
                    }
                    contextText="Course Tutors"
                    icon={<GroupIcon className="w-5 h-5" />}
                    href="/class-tutors"
                />
            </div>
        </div>
    )
}