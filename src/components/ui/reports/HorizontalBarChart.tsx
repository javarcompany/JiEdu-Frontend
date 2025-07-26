import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface HorizontalBarChartProps {
    data: any[];
    categories: string[];
    title: string;
}

export default function HorizontalBarChart ({ 
    data, 
    categories, 
    title 
}: HorizontalBarChartProps) {
    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            stacked: false,
            toolbar: { show: false },
        },
        xaxis: {
            categories,
            title: { text: "Number of Attendances" },
        },
        yaxis: {
            show: true,
        },
        dataLabels: { enabled: false, },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 2,
                barHeight: '50%',
            },
        },
        fill: { opacity: 1, },
        colors: ["#22c55e", "#eab308", "#ef4444", "#555555"],
        legend: { position: "top" },
    };

    return(
        <div className="bg-white shadow-lg dark:bg-white/[0.02] p-4 rounded-xl border dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <Chart options={chartOptions} series={data} type="bar" height={400} />
        </div>
    ); 
};
