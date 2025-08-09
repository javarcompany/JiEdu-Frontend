import { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrencyShort } from "../../utils/format";

export default function KPI() {
    const [data, setData] = useState([
        { title: "Total Collected", value: "...", color: "bg-green-100", icon: "💰" },
        { title: "Pending Dues", value: "...", color: "bg-red-100", icon: "📉" },
        { title: "Total Students", value: "...", color: "bg-blue-100", icon: "🎓" },
        { title: "Term's Txns", value: "...", color: "bg-yellow-100", icon: "📆" },
    ]);

    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchKPI = async () => {
            try {
                const res = await axios.get("/api/dashboard/kpi/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = res.data;

                setData([
                    { title: "Total Collected", value: `KES. ${formatCurrencyShort(result.total_collected)}`, color: "bg-green-100", icon: "💰" },
                    { title: "Pending Dues", value: `KES. ${formatCurrencyShort(result.pending_dues)}`, color: "bg-red-100", icon: "📉" },
                    { title: "Total Students", value: `${formatCurrencyShort(result.total_students)}`, color: "bg-blue-100", icon: "🎓" },
                    { title: "Term's Txns", value: `KES. ${formatCurrencyShort(result.term_txns)}`, color: "bg-yellow-100", icon: "📆" },
                ]);
            } catch (err) {
                console.error("Failed to load KPIs", err);
            }
        };

        fetchKPI();
    }, []);

    return (
        <div className="grid mt-4 grid-cols-2 md:grid-cols-2 gap-4">
            {data.map((kpi, i) => (
                <div key={i} className={`rounded-lg p-4 ${kpi.color}`}>
                    <div className="text-sm text-gray-600">{kpi.title}</div>
                    <div className="text-xl font-semibold dark:text-gray-800">{kpi.value}</div>
                    <div className="text-2xl mt-2">{kpi.icon}</div>
                </div>
            ))}
        </div>
    );
}
