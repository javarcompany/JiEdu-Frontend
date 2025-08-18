import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { useState, useEffect } from 'react';
import Checkbox from "../../../components/form/input/Checkbox";
import axios from "axios";
import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";

// Define the TypeScript interface for the table rows
export interface Applicant {
	id: number;
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

export default function ApproveTable({ searchTerm, selectedIds, setSelectedIds }: { searchTerm: string; selectedIds: number[]; setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;  }) {
	const token = localStorage.getItem("access");
	const [applicants, setApplicants] = useState<Applicant[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const isAllSelected = selectedIds.length === applicants.length && applicants.length > 0;

	const handleSelectAll = (e: boolean) => {
        if (e) {
            setSelectedIds(applicants.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

	const handleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

	const fetchApplicants = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/applications/?status=Pending&search=${query}&page=${page}`,
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
							<Checkbox
								className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500"
								checked={isAllSelected}
								onChange={(e) => {handleSelectAll(e)}}
							/>
							</TableCell>
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
							Intake/Year
						</TableCell>
						<TableCell
							isHeader
							className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							Status
						</TableCell>
						</TableRow>
					</TableHeader>

					{/* Table Body */}

					<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
						{applicants.length === 0 ? (
								<TableRow>
									<TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No Enrollment found.....</div>
									</TableCell>
								</TableRow>
							) : (
							applicants.map((applicant) => (
								<TableRow key={applicant.id} className="">
									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
									<Checkbox
										checked={selectedIds.includes(applicant.id)}
										onChange={() => handleSelectOne(applicant.id)}
									/>
									</TableCell>
									<TableCell className="py-3">
									<div className="flex items-center gap-3">
										<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
										<img
											src={applicant.passport}
											className="h-[50px] w-[50px]"
											alt={applicant.id.toLocaleString()}
										/>
										</div>
										<div>
										<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
											{applicant.fname} {applicant.mname} {applicant.sname}
										</p>
										<span className="text-gray-500 text-theme-xs dark:text-gray-400">
											{applicant.nat_id}
										</span>
										</div>
									</div>
									</TableCell>

									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										{applicant.course_name}
									</TableCell>

									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										{applicant.category}
									</TableCell>

									<TableCell>
										<div>
											<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{applicant.year_name}
											</p>
											<span className="text-gray-500 text-theme-xs dark:text-gray-400">
												{applicant.intake_name}
											</span>
										</div>
									</TableCell>
									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										<Badge
											size="sm"
											color={
											applicant.state === "Joined"
												? "success"
												
												:applicant.state === "Approved"
												? "primary"

												: applicant.state === "Pending"
												? "warning"

												: "error"
											}
										>
											{applicant.state}
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
