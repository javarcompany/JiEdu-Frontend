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
import debounce from 'lodash.debounce';
import Pagination from "../../components/ui/pagination";

export interface Units {
    id: string;
    name: string;
    abbr: string;
    uncode: string;
    weekly_hours: number;
    course: string;
	course_name: string;
    module: string;
	module_name: string;
    dor: string;
}
  
export default function UnitsTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [units, setUnits] = useState<Units[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const fetchUnits = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/units/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUnits(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Units", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		console.log("Save: ", saveValue);
		fetchUnits(searchTerm, page);
	},[token, searchTerm, page, saveValue]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
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
								Abbreviation
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Course
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
							{units.map((unit) => (
								<TableRow key={unit.id}>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{unit.name}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													{unit.uncode}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										<div className="flex items-center gap-3">
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{unit.weekly_hours} Hrs
												</span>
												<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
													{unit.abbr}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{unit.course_name}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													Module {unit.module_name}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										<div className="flex items-center gap-3">
											<div>
												<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
													{unit.dor}
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
							))}
						</TableBody>

					</Table>
				</div>
			</div>

			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

		</>
	);
}
  