import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import {  EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import debounce from 'lodash.debounce';
import Pagination from "../../../components/ui/pagination";

// Define the TypeScript interface for the table rows
export interface Applicant {
	id: string;
	fname: string;
	mname: string;
	sname: string;
	nat_id: string;
	course: string;
	course_name: string; 
	year: string;
	year_name: string;
	intake: string;
	intake_name: string;
	category: string; 
	passport: string;
	state: string;
}

export default function StudentEnrollmentTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [applicants, setApplicants] = useState<Applicant[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const navigate = useNavigate();

	const handleViewApplicant = (applicant: Applicant) => {
        const app = applicant.id
		navigate(`/view-applicant/${encodeURIComponent(app)}`);
	}

	const fetchApplicants = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/applications/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setApplicants(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Applicants", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		
		fetchApplicants(searchTerm, page);
	},[token, searchTerm, page]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading applications...</div>;
	}

	return (
		<>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Enrollment List
						</h3>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => navigate("/new-student")}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
						>
							<svg
								className="stroke-current fill-white dark:fill-gray-800"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								{/* User circle */}
								<path
								d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4 -4 1.79-4 4 1.79 4 4 4z"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								/>
								{/* User body */}
								<path
								d="M4 20c0-2.67 4-4 8-4s8 1.33 8 4"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								/>
								{/* Plus sign */}
								<path
								d="M19 8v4M21 10h-4"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								/>
							</svg>
							Register New Student
						</button>

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
								Applicant
							</TableCell>
							<TableCell
								isHeader
								className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Course
							</TableCell>
							<TableCell
								isHeader
								className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Category
							</TableCell>
							<TableCell
								isHeader
								className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Status
							</TableCell>
							<TableCell
								isHeader
								className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Action(s)
							</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}

						<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
							{applicants.map((applicant) => (
								<TableRow key={applicant.id} className="">
									<TableCell className="py-3">
										<div className="flex items-center gap-3">
											<div className="h-[50px] w-[50px] overflow-hidden rounded-lg">
												<img
													src={applicant.passport}
													className="h-[50px] w-[50px]"
													alt={applicant.nat_id}
												/>
											</div>
											<div>
												<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{applicant.fname} {applicant.sname} {applicant.mname}
												</p>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													{applicant.nat_id}
												</span>
											</div>
										</div>
									</TableCell>

									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
											{applicant.course_name}
										</p>
										<span className="text-gray-500 text-theme-xs dark:text-gray-400">
											{applicant.year_name} | {applicant.intake_name}
										</span>
									</TableCell>

									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										{applicant.category}
									</TableCell>

									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										<Badge
											size="sm"
											color={
											applicant.state === "Approved"
												? "primary"

												: applicant.state === "Pending"
												? "warning"

												: applicant.state === "Joined"
												? "success"

												: "error"
											}
										>
											{applicant.state}
										</Badge>
									</TableCell>

									<TableCell>
										<button
											title="View Application"
											className="text-blue-500 hover:text-red-600 transition-colors  px-4"
											onClick={() => handleViewApplicant(applicant)}
										>
											<EyeIcon size={20} />
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

		</>
	);
}
  