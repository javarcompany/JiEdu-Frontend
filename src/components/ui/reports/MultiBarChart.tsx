import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
    title?: string;
    categories: string[];
    DataA_Title: string;
    DataB_Title: string;
    DataA: number[];
    DataB: number[];
}

export default function MultiBarChart({
    title = "Bar Title",
    categories,
    DataA_Title,
    DataB_Title,
    DataA,
    DataB,
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
                borderRadius: 1,
            },
        },
        fill: { opacity: 1, },
        colors: ["#22c55e", "#eab308", "#ef4444"],
        legend: { position: "bottom", },
    };

    const series = [
        { name: DataA_Title, data: DataA, },
        { name: DataB_Title, data: DataB, },
    ];

    return (
        <div className="bg-white dark:bg-white/[0.02] p-4 rounded-xl border dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <Chart options={options} series={series} type="bar" height={200} />
        </div>
    );
}
