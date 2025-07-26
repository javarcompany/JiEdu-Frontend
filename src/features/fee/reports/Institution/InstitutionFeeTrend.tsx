import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TrendingUp } from "lucide-react";
import FeePredictionModal from "./FeePredictionModl";

type FeeTrendData = {
	year: string;
	invoiced: number;
	received: number;
};

export default function InstitutionFeeTrendChart() {
    const [showPrediction, setShowPrediction] = useState(false);
    const token = localStorage.getItem("access");
	const [data, setData] = useState<FeeTrendData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/api/institution-fee-trend/",
                    { headers: { Authorization: `Bearer ${token}` },});
				if (!res.ok) throw new Error("Failed to fetch trend data.");
				const result = await res.json();
				setData(result); // Should be an array of FeeTrendData
			} catch (err: any) {
				setError(err.message || "Error fetching data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const categories = data.map((item) => item.year);
	const invoicedSeries = data.map((item) => item.invoiced);
	const receivedSeries = data.map((item) => item.received);

	const options: ApexOptions = {
		chart: {
			type: "area",
			fontFamily: "Outfit, sans-serif",
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		colors: ["#EF4444", "#3B82F6"],
		dataLabels: { enabled: false },
		stroke: { curve: "smooth", width: 3 },
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
		},
		yaxis: {
			labels: {
				formatter: (value) => `KES ${value.toLocaleString()}`,
				style: { fontSize: "11px" },
			},
		},
		legend: {
			show: true,
			position: "top",
			horizontalAlign: "right",
			fontSize: "12px",
		},
		grid: { show: false },
		tooltip: {
			theme: "light",
			y: {
				formatter: (val) => `KES ${val.toLocaleString()}`,
			},
		},
	};

	const series = [
		{ name: "Invoiced", data: invoicedSeries },
		{ name: "Received", data: receivedSeries },
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-sm text-gray-500 animate-pulse">Loading chart...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-red-500 text-center p-4">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="bg-white p-4 rounded-xl shadow-md mb-4 dark:bg-white/[0.05]">
			<div className="flex justify-between items-center mb-2">
				<h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">
					Institution Fee Trend (Last 5 Years)
				</h2>
                <button
					className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors
						md:px-4 md:py-2"
					onClick={() => setShowPrediction(true)}
				>
					<span className="hidden sm:inline">Predict Trend</span>
					<TrendingUp size={16} className="shrink-0" />
				</button>
                
                <FeePredictionModal open={showPrediction} onClose={() => setShowPrediction(false)} />
			</div>
			<Chart options={options} series={series} type="area" height={320} />
		</div>
	);
}

