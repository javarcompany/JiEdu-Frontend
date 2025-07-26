import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
    title?: string;
    categories: string[]; // e.g., ["Module 1", "Module 2", "Module 3"]
    presentData: number[];
    lateData: number[];
    absentData: number[];
}

export default function AttendanceBarChart({
	title = "Module Attendance",
	categories,
	presentData,
	lateData,
	absentData,
}: Props) {
	const options: ApexOptions = {
		chart: {
			type: "bar",
			stacked: false, 
			toolbar: { show: false },
		},
		xaxis: {
			categories,
			labels: {
			style: { fontSize: "12px" },
			},
		},
		yaxis: {
			show: true,
			labels: {
			formatter: (val) => `${val}`,
			},
		},
		dataLabels: { enabled: false, },
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "50%",
				borderRadius: 2,
			},
		},
		fill: { opacity: 1, },
		colors: ["#22c55e", "#eab308", "#ef4444"],
		legend: { position: "bottom", },
	};

	const series = [
		{
			name: "Present",
			data: presentData,
		},
		{
			name: "Late",
			data: lateData,
		},
		{
			name: "Absent",
			data: absentData,
		},
	];

	return (
		<div className="bg-white dark:bg-white/[0.02] p-4 rounded-xl border dark:border-gray-800">
			<h3 className="text-lg font-semibold mb-3">{title}</h3>
			<Chart options={options} series={series} type="bar" height={320} />
		</div>
	);
}
