import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import StudentEnrollmentCount from "./StudentEnrollmentCount";
import { BoxIcon } from "../../../icons";
import { SearchButton } from "../../../components/dashboard/SearchButton";
import { useEffect, useState } from "react";
import axios from "axios";

import { formatCount } from "./StudentEnrollmentCount";
import { calculatePercentageChange } from "../dashboard/StudentActions";

export default function StudentActions({ onSearch }: { onSearch: (value: string) => void }) {
	const [pending_enrollment, setPendingEnrollment] = useState(0);
	const token = localStorage.getItem("access");
	const [enrollment, setEnrollment] = useState({ current: 0, previous: 0 });

	useEffect(() => {
		const fetchPendingEnrollment = async () => {
			try {
				const response = await axios.get("/api/student_count/pending_enrollment", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPendingEnrollment(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

		const fetchEnrollmentComparison = async () => {
			try {
				const response = await axios.get("/api/student-count-pending", {
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

		fetchPendingEnrollment();
		fetchEnrollmentComparison();
	}, []);

	const enrollmentRate = calculatePercentageChange(enrollment.current, enrollment.previous);

	return (
		<div className="space-y-4 md:space-y-6">

			{/* Search + Stat Card on same row for sm/md, stacked on lg+ */}
			<div className="flex flex-col-reverse sm:flex-row lg:flex-col gap-4 md:gap-6">

				<div className="w-full">
					<SearchButton onSearch={onSearch} />
				</div>

				<div className="w-full">
					<ClickableStatCard
						title="Pending Registration No"
						value={formatCount(pending_enrollment)}
						percentageChange={enrollmentRate}
						classvalue={
							enrollmentRate.includes("+")
								? "bg-green-800 dark:text-white text-white"
								: enrollmentRate.includes("-")
								? "bg-red-600 dark:text-white text-white"
								: "bg-gray-700 dark:text-white text-white"
						}
						contextText="vs last intake"
						icon={<BoxIcon className="w-5 h-5" />}
						href="/approve"
					/>
				</div>

			</div>

			{/* Enrollment Stats below */}
			<div>
				<StudentEnrollmentCount />
			</div>
		</div>
	);
}
