import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";

interface MonthlySummary {
	month: string;
	invoiced: number;
	paid: number;
}

export default function MonthlyFeeBarChart() {
    const token = localStorage.getItem("access");
	const [categories, setCategories] = useState<string[]>([]);
	const [invoicedData, setInvoicedData] = useState<number[]>([]);
	const [paidData, setPaidData] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get<MonthlySummary[]>("/api/institution-monthly-fee-summary/",
                    { headers: { Authorization: `Bearer ${token}` },}
                );
				const months: string[] = res.data.map((item) => item.month);
				const invoiced: number[] = res.data.map((item) => item.invoiced);
				const paid: number[] = res.data.map((item) => item.paid);

				setCategories(months);
				setInvoicedData(invoiced);
				setPaidData(paid);
			} catch (error) {
				console.error("Failed to fetch fee summary:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

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
			labels: {
				formatter: (val) => `KES ${val.toLocaleString()}`,
			},
		},
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "45%",
				borderRadius: 1,
			},
		},
		fill: {
			opacity: 1,
		},
		colors: ["#EF4444", "#10B981"],
		legend: {
			position: "bottom",
		},
		tooltip: {
			y: {
				formatter: (val: number) => `KES ${val.toLocaleString()}`,
			},
		},
	};

	const series = [
		{
			name: "Invoiced",
			data: invoicedData,
		},
		{
			name: "Paid",
			data: paidData,
		},
	];

	return (
		<div className="bg-white dark:bg-white/[0.02] p-4 rounded-xl border dark:border-gray-800 shadow-md mb-4">
			<h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
				Monthly Fee Summary
			</h3>
			{loading ? (
				<div className="text-gray-500 dark:text-gray-400 text-sm">Loading chart...</div>
			) : (
				<Chart options={options} series={series} type="bar" height={250} />
			)}
		</div>
	);
}
