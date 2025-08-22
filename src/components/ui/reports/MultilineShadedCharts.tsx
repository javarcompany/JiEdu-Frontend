import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type MultiLineShadedChartProps = {
	title?: string;
	categories: string[]; // x-axis labels (e.g., weeks, dates)
	presentData: number[];
	lateData: number[];
	absentData: number[];
};

export default function MultiLineShadedChart({
	title = "Attendance Trend",
	categories,
	presentData,
	lateData,
	absentData,
}: MultiLineShadedChartProps) {
	const visiblePoints = 10;
	const startIndex = Math.max(categories.length - visiblePoints, 0);
	const initialMin = startIndex;
	const initialMax = categories.length;

	const options: ApexOptions = {
		chart: {
			type: "area",
			fontFamily: "Outfit, sans-serif",
			toolbar: { show: true, tools: { zoom: false, pan: true, reset: true }  },
			zoom: { enabled: true },
			animations: { enabled: false },
		},
		colors: ["#22C55E", "#FACC15", "#EF4444"], // green, yellow, red
		dataLabels: { enabled: false },
		stroke: {
			curve: "smooth",
			width: 2,
		},
		fill: {
			type: "gradient",
			gradient: {
				shade: "light",
				type: "vertical",
				shadeIntensity: 0.25,
				opacityFrom: 0.4,
				opacityTo: 0,
				stops: [0, 100],
			},
		},
		xaxis: {
			categories: categories,
			labels: { show: true },
			axisTicks: { show: false },
			axisBorder: { show: false },
			range: visiblePoints, // try limiting to visible range
			min: initialMin,
			max: initialMax,
		},
		yaxis: {
			labels: { show: true },
		},
		tooltip: {
			theme: "light",
		},
		legend: {
			position: "top",
			horizontalAlign: "left",
		},
		grid: {
			strokeDashArray: 4,
			borderColor: "#e5e7eb",
		},
	};

	const series = [
		{ name: "Present", data: presentData },
		{ name: "Late", data: lateData },
		{ name: "Absent", data: absentData },
	];

	return (
		<div className="bg-white p-4 rounded-xl shadow-md dark:bg-white/[0.05]">
			<h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
				{title}
			</h2>
			<Chart options={options} series={series} type="area" height={200} />
		</div>
	);
}
