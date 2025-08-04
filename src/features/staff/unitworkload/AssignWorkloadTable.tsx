import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import Checkbox from "../../../components/form/input/Checkbox";
import { useEffect, useState } from "react";
import axios from "axios";
import { Units } from "../../units/UnitsTable";
import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";

export default function AssignTutorTable({filters, selectedIds, setSelectedIds, }: { filters: { course: string; term: string; module: string; class_: string; lecturer: string; }; selectedIds: string[]; setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>; }) {
	
	const { course, module } = filters;

	const token = localStorage.getItem("access");
	const [units, setUnits] = useState<Units[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const fetchUnits = debounce(async (page=1) => {
		try {
			const response = await axios.get(`/api/units/?page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUnits(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
			setTotalPages(response.data.total_pages || response.data.num_pages || 2);
		} catch (error) {
			console.error("Failed to fetch Units", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
				
		fetchUnits(page);
	},[token, page]);
	
	const filteredData = units.filter((unit) => {
        const matchesCourse = !course || unit.course.toString() === course;
        const matchesModule = !module || unit.module.toString() === module;
		return matchesCourse && matchesModule;
	});
	
	const isAllSelected = selectedIds.length === filteredData.length && filteredData.length > 0;

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedIds(filteredData.map((item) => item.id));
		} else {
			setSelectedIds([]);
		}
	};
	
	const handleSelectOne = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};
	
	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading units...</div>;
	}

	return (
		<>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Units
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
									className="py-3 px-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									<input
										type="checkbox"
										className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500"
										checked={isAllSelected}
										onChange={handleSelectAll}
									/>
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Unit Code
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Unit Name
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Weekly Hours
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}

						<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
							{filteredData.length === 0 ? (
								<TableRow>
									<TableCell  colSpan={4} className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No Unit(s) found.....</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((unit) => (
									<TableRow key={unit.id} className="">
										<TableCell className="py-3 gap-2 px-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<Checkbox
												checked={selectedIds.includes(unit.id)}
												onChange={() => handleSelectOne(unit.id)}
											/>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<span className="text-gray-500 text-theme-xs dark:text-gray-400">
												{unit.uncode}
											</span>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{unit.name}
											</p>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
												unit.weekly_hours >= 6
													? "error"
													: unit.weekly_hours >= 4
													? "primary"
													: "success"
												}
											>
												{unit.weekly_hours}
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
