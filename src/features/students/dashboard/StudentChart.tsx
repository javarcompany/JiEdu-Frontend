import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentChart() {
    const token = localStorage.getItem("access");
	const [categories, setCategories] = useState<string[]>([]);
	const [dataSeries, setDataSeries] = useState<number[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get("/api/students-allocations/class_counts",
					{
                        headers: { Authorization: `Bearer ${token}` },
                    }
				);
				const data = response.data;

				const labels = data.map((item: any) => item.class_name || "Unassigned");
				const values = data.map((item: any) => item.student_count || 0);

				setCategories(labels);
				setDataSeries(values);
			} catch (error) {
				console.error("Failed to fetch class allocation data", error);
			}
		}

		fetchData();
	}, []);

	const options: ApexOptions = {
		colors: ["#465fff", "#845EC2", "#FFBB28", "#00C49F","#FF5733"],
		chart: {
			fontFamily: "Outfit, sans-serif",
			type: "bar",
			height: 300,
			width: "100%",
			toolbar: { show: false },
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "45%",
				borderRadius: 5,
				borderRadiusApplication: "end",
				distributed: true,
			},
		},
		dataLabels: { enabled: false },
		stroke: {
			show: true,
			width: 4,
			colors: ["transparent"],
		},
		xaxis: {
			categories: categories,
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		legend: {
			show: false,
			position: "top",
			horizontalAlign: "left",
			fontFamily: "Outfit",
		},
		yaxis: { title: { text: undefined } },
		grid: {
			yaxis: { lines: { show: true } },
		},
		fill: { opacity: 1 },
		tooltip: {
			x: { show: false },
			y: { formatter: (val: number) => `${val}` },
		},
		// ✅ Responsive breakpoints
		responsive: [
			{
				breakpoint: 1024,
				options: {
					chart: { height: 260 },
					plotOptions: { bar: { columnWidth: "55%" } },
				},
			},
			{
				breakpoint: 640,
				options: {
					chart: { height: 220 },
					xaxis: { labels: { rotate: -30 } },
					plotOptions: { bar: { columnWidth: "60%" } },
				},
			},
		],
	};

	const series = [{ name: "Student Count", data: dataSeries }];

	function toggleDropdown() {
		setIsOpen(!isOpen);
	}

	function closeDropdown() {
		setIsOpen(false);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
					Student Class Allocation
				</h3>
				<div className="relative inline-block">
					<button className="dropdown-toggle" onClick={toggleDropdown}>
						<MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
					</button>

					<Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
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

			{/* Chart Container */}
			<div className="w-full">
				<Chart options={options} series={series} type="bar" height={300} width="100%" />
			</div>
		</div>
	);

}
