import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import CountryMap from "./CountryMap";

interface Branch{
	id: number;
	name: string;
	student_count: string;
	percentage: string;
}

export default function DemographicCard() {
	const [isOpen, setIsOpen] = useState(false);
	const [branchStats, setBranchStats] = useState<Branch[]>([]);
    const token = localStorage.getItem("access");

	function toggleDropdown() {
		setIsOpen(!isOpen);
	}

	function closeDropdown() {
		setIsOpen(false);
	}

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch("/api/branch-student-stats/",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const data = await res.json();
				setBranchStats(data);
			} catch (err) {
				console.error("Failed to fetch branch stats", err);
			}
		};
		fetchStats();
	}, []);

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
			<div className="flex justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Branches
					</h3>
					<p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
						Number of students based on branches
					</p>
				</div>

				<div className="relative inline-block">
					<button className="dropdown-toggle" onClick={toggleDropdown}>
						<MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
					</button>
					<Dropdown
						isOpen={isOpen}
						onClose={closeDropdown}
						className="w-40 p-2"
					>
						<DropdownItem
							onItemClick={closeDropdown}
							className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							View More
						</DropdownItem>
						<DropdownItem
							onItemClick={closeDropdown}
							className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
						>
							Delete
						</DropdownItem>
					</Dropdown>
				</div>
			</div>

			<div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl dark:border-gray-800 sm:px-6">
				<div
					id="mapOne"
					className="mapOne map-btn -mx-4 -my-6 h-[212px]  sm:-mx-6w-[252px] 2xsm:w-[307px] xsm:w-[358px] md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
				>
					<CountryMap />
				</div>
			</div>

			<div className="space-y-5">
				{branchStats.map(branch => (
					<div key={branch.id} className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div>
								<p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
									{branch.name}
								</p>
								<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
									{branch.student_count.toLocaleString()} Students
								</span>
							</div>
						</div>

						<div className="flex w-full max-w-[140px] items-center gap-3">
							<div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
								<div className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white" style={{ width: `${branch.percentage}%` }}></div>
							</div>
							<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
								{branch.percentage}%
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
