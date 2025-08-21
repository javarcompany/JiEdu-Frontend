import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type LineShadedChartProps = {
	title?: string;
	categories: string[];
	seriesData: number[];
	color?: string;
};

export default function LineShadedChart({
	title = "Attendance Trend",
	categories,
	seriesData,
	color = "#3B82F6",
}: LineShadedChartProps) {
	const visiblePoints = 10;
	const startIndex = Math.max(categories.length - visiblePoints, 0);
	const initialMin = startIndex;
	const initialMax = categories.length;

	const options: ApexOptions = {
		chart: {
			type: "area",
			fontFamily: "Outfit, sans-serif",
			toolbar: { show: true, tools: { zoom: true, pan: true, reset: true } },
			zoom: { enabled: true },
			animations: { enabled: true }, // smoother scroll feel
		},
		colors: [color],
		dataLabels: { enabled: false },
		stroke: {
			curve: "smooth",
			width: 3,
		},
		fill: {
			type: "gradient",
			gradient: {
				shade: "light",
				type: "vertical",
				shadeIntensity: 0.4,
				inverseColors: false,
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
			labels: { show: false },
		},
		grid: {
			show: true,
		},
		tooltip: {
			theme: "light",
		},
	};
	const series = [
		{
			name: title,
			data: seriesData,
		},
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
