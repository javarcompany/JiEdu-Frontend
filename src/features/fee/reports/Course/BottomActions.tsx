import { useEffect, useState } from "react";
import axios from "axios";
import ModuleFeeView from "../../Invoice"; // Component for grouped module fees

import { Loader2 } from "lucide-react"; // Spinner icon (requires lucide-react)
import CourseIncomeStatement from "./CourseIncomeStatement";
import CourseFeeAnalysis from "./CourseFeeAnalysis";

// Types

type ActionsProps = {
  filters: { course_abbr: string;  course: string; term: string };
  setFilters: React.Dispatch<React.SetStateAction<{ course_abbr: string;  course: string; term: string }>>;
};

type FeeParticular = {
  votehead: string;
  amount: number;
};

type ModuleFeeData = {
  particulars: FeeParticular[];
  total: number;
};

export type GroupedModuleFees = {
  [module: string]: ModuleFeeData;
};

export default function BottomAction({ filters, setFilters }: ActionsProps) {
	const token = localStorage.getItem("access");
	const [activeTab, setActiveTab] = useState<"invoice" | "income" | "analysis">("invoice");
	const [groupedFees, setGroupedFees] = useState<GroupedModuleFees>({});

	const [loadingLogs, setLoadingLogs] = useState(false);
	const [loadingInvoices, setLoadingInvoices] = useState(false);

	useEffect(() => {

		const fetchInvoices = async () => {
			setLoadingLogs(true);
			setLoadingInvoices(true);
			try {
				const res = await axios.get("/api/fetch-course-invoices/", {
					headers: { Authorization: `Bearer ${token}` },
					params: { course_id: filters.course, term_id: filters.term },
				});
				setGroupedFees(res.data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingLogs(false);
				setLoadingInvoices(false);
			}
		};

		fetchInvoices();
	}, [filters]);

	return (
		<div className="mt-4">
			{/* Tab Buttons */}
			<div className="flex space-x-4 border-b pb-2 dark:border-gray-700 mb-4">
				<button
					onClick={() => setActiveTab("invoice")}
					className={`px-4 py-2 rounded-t-md text-sm font-medium ${
					activeTab === "invoice"
						? "bg-blue-600 text-white"
						: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
					}`}
				>
					Invoice Summary
				</button>

				<button
					onClick={() => setActiveTab("income")}
					className={`px-4 py-2 rounded-t-md text-sm font-medium ${
					activeTab === "income"
						? "bg-blue-600 text-white"
						: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
					}`}
				>
					Class Income
				</button>

				<button
					onClick={() => setActiveTab("analysis")}
					className={`px-4 py-2 rounded-t-md text-sm font-medium ${
					activeTab === "analysis"
						? "bg-blue-600 text-white"
						: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
					}`}
				>
					Analysis
				</button>
			</div>

			{/* Filter Summary */}
			<div className="mb-4 flex items-center justify-between px-2">
				<div className="text-sm text-gray-600 dark:text-gray-400">
					<span className="font-medium">Course:</span> {filters.course || "N/A"} &nbsp;&nbsp;
					<span className="font-medium">Term:</span> {filters.term || "Current Term"}
				</div>
				<button
					className="text-sm text-blue-600 hover:underline"
					onClick={() => setFilters({ course_abbr: "",  course: "", term: "" })}
				>
					Reset Filters
				</button>
			</div>

			{/* Tab Content */}
			<div className="min-h-[300px]">
				{activeTab === "invoice" && (
					loadingInvoices ? (
						<div className="flex justify-center items-center h-40">
							<Loader2 className="animate-spin h-10 w-10 text-blue-600" />
						</div>
					) : (
						<ModuleFeeView groupedFees={groupedFees} />
					)
				)}

				{activeTab === "income" && (
					loadingLogs ? (
						<div className="flex justify-center items-center h-40">
							<Loader2 className="animate-spin h-10 w-10 text-blue-600" />
						</div>
					) : (
						<CourseIncomeStatement courseId={filters.course} termId={filters.term} />
					)
				)}

				{activeTab === "analysis" && (
					loadingLogs ? (
						<div className="flex justify-center items-center h-40">
							<Loader2 className="animate-spin h-10 w-10 text-blue-600" />
						</div>
					) : (
						<CourseFeeAnalysis courseId={filters.course} termId={filters.term} />
					)
				)}
			</div>
		</div>
	);
}
