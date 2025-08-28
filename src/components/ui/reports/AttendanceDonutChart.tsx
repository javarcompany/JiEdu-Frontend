// components/charts/RadialAttendanceChart.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type RadialAttendanceChartProps = {
	value: number; // percentage value (0-100)
	label: string; // e.g. "Present", "Late", "Absent"
	color: string; // main color for this status
	bgColor: string; // background badge color
	textColor: string; // badge text color
};

export default function RadialAttendanceChart({
	value,
	label,
	color,
	bgColor,
	textColor,
}: RadialAttendanceChartProps) {
	const series = [value];

	const options: ApexOptions = {
		colors: [color],
		chart: {
			fontFamily: "Outfit, sans-serif",
			type: "radialBar",
			height: 40,
			sparkline: {
				enabled: true,
			},
		},
		plotOptions: {
			radialBar: {
			startAngle: -180,
			endAngle: 100,
			hollow: {
				size: "60%",
			},
			track: {
				background: "#E4E7EC",
				strokeWidth: "100%",
				margin: 3,
			},
			dataLabels: {
				name: {
					show: false,
				},
				value: {
				fontSize: "100%",
				fontWeight: "600",
				offsetY: 0,
				color: "#1D2939",
				formatter: function (val) {
					return val + "%";
				},
				},
			},
			},
		},
		fill: {
			type: "gradient",
			colors: [color],
		},
		stroke: {
			lineCap: "round",
		},
		labels: ["Progress"],
	};

	return (
		<div className="relative">
			<div id="chartDarkStyle">
				<Chart options={options} series={series} type="radialBar" height={150} />
			</div>
			<span
				className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[170%] rounded-full px-3 py-1 text-xs font-medium ${bgColor} ${textColor}`}
			>
				{label}
			</span>
		</div>
	);
}
