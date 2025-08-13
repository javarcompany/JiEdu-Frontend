import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
  
import {  Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/ui/pagination";
import debounce from "lodash.debounce";
import { formatDateTime } from "../../utils/format";

interface Classroom {
	id: number;
	name: string;
	branch_name: string;
	branch: string;
	dor: string;
}

export default function ClassroomTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [classrooms, setClassrooms] = useState<Classroom[]>([]);
	const [loading, setLoading] = useState<boolean>(true);  

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

	const fetchClassrooms = debounce( async (searchTerm, page = 1) => {
		try {
			const response = await axios.get(`/api/classrooms/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            setPage(response.data.page);
			setClassrooms(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Classrooms", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		fetchClassrooms(searchTerm, page);
	}, [page, searchTerm]);

	const filteredData = classrooms.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading classrooms...</div>;
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
								Name
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Branch
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Date Registered
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
							{filteredData.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No classroom found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((classroom) => (
									<TableRow key={classroom.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{classroom.name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{classroom.branch_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(classroom.dor)}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="Edit Group"
												className="text-green-500 hover:text-green-600 transition-colors"
												onClick={() => console.log("Edit")}
											>
												<Pencil size={16} />
											</button>

											<button
												title="Delete Group"
												className="text-red-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => console.log("Delete")}
											>
												<Trash2 size={16} />
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
  