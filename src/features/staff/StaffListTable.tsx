import {
Table,
TableBody,
TableCell,
TableHeader,
TableRow,
} from "../../components/ui/table";

import { EyeIcon } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import debounce from 'lodash.debounce';
import Pagination from "../../components/ui/pagination";

interface Staff {
	id: number;
    regno: string;
    fname: string;
    mname: string;
    sname: string;
    gender: string;
    nat_id: string;
    phone: string;
    email: string;
	dob: string;
    branch: string;
    department: string;
    branch_name: string;
    department_name: string;
    designation: string;
    weekly_hours: string;
    passporturl: string;
	state: string;
}

export default function StaffTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [staffs, setStaffs] = useState<Staff[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();

	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const handleViewStaff = (staff: Staff) => {
		const app = staff.id
		navigate(`/view-staff/${encodeURIComponent(app)}`);
	}

	const fetchStaffs = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/staffs/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setStaffs(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			console.log(response)
		} catch (error) {
			console.error("Failed to fetch Staffs", error);
			setLoading(false);
		}
	}, 100); 
	
	useEffect(() => {
		if (!token) {return;}
		
		fetchStaffs(searchTerm, page);
	},[token, searchTerm, page]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading staffs...</div>;
	}	

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
				<div className="max-w-full overflow-x-auto">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Staff
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Department
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Contact
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Status
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Action(s)
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{staffs.length === 0 ? (
								<TableRow>
									<TableCell  colSpan={4} className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No Staff found.....</div>
									</TableCell>
								</TableRow>
							) : (
								staffs.map((staff) => (
									<TableRow key={staff.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<img src={staff.passporturl} alt={staff.fname} />
												</div>
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{staff.fname} {staff.mname} {staff.sname}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{staff.regno}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{staff.department_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{staff.branch_name} Campus
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{staff.email}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{staff.phone}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
												staff.state === "Active"
													? "success"
													: staff.state === "Suspended"
													? "warning"
													: "error"
												}
											>
												{staff.state}
											</Badge>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="View Staff"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleViewStaff(staff)}
											>
												<EyeIcon size={20} />
											</button>
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
  