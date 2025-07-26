import { Users2Icon } from "lucide-react";
import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { useEffect, useState } from "react";
import axios from "axios";

export function formatStudentCount(count: number) {
	if (count >= 10000) {
		return `${Math.round(count / 1000)}K`;
	}
	return count.toLocaleString();
}

export default function EcommerceMetrics() {
	const [studentCount, setStudentCount] = useState(0);
	const [staffCount, setStaffCount] = useState(0);
	const [usersCount, setUsersCount] = useState(0);

	const token = localStorage.getItem("access");
	
	useEffect(() => {
		const fetchStudentCount = async () => {
			try {
				const response = await axios.get("/api/student_count/all",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setStudentCount(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

		const fetchStaffCount = async () => {
			try {
				const response = await axios.get("/api/staff_count/all",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setStaffCount(response.data.count);
			} catch (error) {
				console.error("Failed to fetch staff count:", error);
			}
		};

		const fetchUserCount = async () => {
			try {
				const response = await axios.get("/api/users_count/",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setUsersCount(response.data.count);
			} catch (error) {
				console.error("Failed to fetch users count:", error);
			}
		};

		fetchStudentCount();
		fetchStaffCount();
		fetchUserCount();
	}, []);

	return (
		<div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:gap-6">
			{/* <!-- Metric Item Start --> */}
			<div className="rounded-2xl shadow-lg border border-gray-200 bg-blue-900 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
				<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
					<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
				</div>

				<div className="flex items-end justify-between mt-5">
					<div>
						<span className="text-sm text-white dark:text-gray-400">
							Staffs
						</span>
						<h4 className="mt-2 font-bold text-white text-title-sm dark:text-white/90">
							{formatStudentCount(staffCount)}
						</h4>
					</div>
					<div className="">
					</div>
				</div>
			</div>
			{/* <!-- Metric Item End --> */}

			{/* <!-- Metric Item Start --> */}
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
				<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
					<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
				</div>
				<div className="flex items-end justify-between mt-5">
					<div>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Students
						</span>
						<h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
							{formatStudentCount(studentCount)}
						</h4>
					</div>
				</div>
			</div>
			{/* <!-- Metric Item End --> */}

			{/* <!-- Metric Item Start --> */}
			<div className="rounded-2xl shadow-lg border border-gray-200 bg-blue-900 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
				<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
					<Users2Icon className="text-white-800 size-6 dark:text-white/90" />
				</div>
				<div className="flex items-end justify-between mt-5">
					<div>
						<span className="text-sm text-white dark:text-gray-400">
							Users
						</span>
						<h4 className="mt-2 font-bold text-white text-title-sm dark:text-white/90">
							{formatStudentCount(usersCount)}
						</h4>
					</div>
				</div>
			</div>
			{/* <!-- Metric Item End --> */}
		</div>
	);
}
