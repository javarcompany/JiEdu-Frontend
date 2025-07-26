import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type FeeTrendData = {
    year: string;
    male: number;
    female: number;
};

export default function StudentStatusTrendChart() {
    const token = localStorage.getItem("access");
    const [data, setData] = useState<FeeTrendData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/student-gender-trend/",
                    { headers: { Authorization: `Bearer ${token}` },});
                if (!res.ok) throw new Error("Failed to fetch trend data.");
                const result = await res.json();
                setData(result); // Should be an array of StudentTrendData
            } catch (err: any) {
                setError(err.message || "Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const categories = data.map((item) => item.year);
    const maleSeries = data.map((item) => item.male);
    const femaleSeries = data.map((item) => item.female);

    const options: ApexOptions = {
        chart: {
            type: "area",
            fontFamily: "Outfit, sans-serif",
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: ["#EF4444", "#FFFF00", "#4400FF", "#44FF00"],
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
                formatter: (value) => `${value.toLocaleString()}`,
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
                formatter: (val) => `${val.toLocaleString()}`,
            },
        },
    };

    const series = [
        { name: "Declined", data: maleSeries },
        { name: "Pending", data: femaleSeries },
        { name: "Approved", data: femaleSeries },
        { name: "Joined", data: femaleSeries },
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
            <div className="justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Enrollment Status Trend (Last 5 Years)
                </h2>
            </div>
            <Chart options={options} series={series} type="area" height={320} />
        </div>
    );
}

 