import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import {  EyeIcon } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash.debounce';
import Pagination from "../../components/ui/pagination";

export interface Users {
	id: number;
	picture: string;
	userfullname: string;
	username: string;
	group: string;
	status: string;
	branch_name: string;
	group_name: string;
	email: string;
	phone: string;
	lastlogin: string;
}

export default function UserListTable({ searchTerm }: { searchTerm: string }) {
    const token = localStorage.getItem("access");

	const [users, setUsers] = useState<Users[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const navigate = useNavigate();

	const fetchUsers = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/users/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUsers(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Users", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		
		fetchUsers(searchTerm, page);
	},[token, searchTerm, page]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading users...</div>;
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
							User
						</TableCell>
						<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							Group
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
							Status/ Last Login
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
						{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell className="px-5 py-4 sm:px-6 text-start">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 overflow-hidden rounded-full">
										<img
											width={40}
											height={40}
											src={user.picture}
											alt={user.username}
										/>
									</div>
									<div>
										<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
											{user.userfullname}
										</span>
										<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
											{user.username}
										</span>
									</div>
								</div>
							</TableCell>

							<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
								<div className="flex items-center gap-3">
									<div>
										<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
											{user.group}
										</span>
										<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
											{user.branch_name}
										</span>
									</div>
								</div>
							</TableCell>

							<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
								<div className="flex items-center gap-3">
									<div>
										<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
											{user.email}
										</span>
										<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
											{user.phone}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
							<Badge
								size="sm"
								color={
								user.status === "True"
									? "success"
									: "error"
								}
							>
								{user.status == "True" ? "Active" : "Inactive"}
							</Badge>
							<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
								{user.lastlogin}
							</span>
							</TableCell>
							<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
								<button
									title="View User"
									className="text-green-500 hover:text-blue-600 transition-colors"
									onClick={() => navigate(`/user-profiles/${encodeURIComponent(user.id)}/`)}
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
  