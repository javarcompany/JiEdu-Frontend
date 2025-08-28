import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import axios from "axios";
import { useUser } from "../../../context/AuthContext";

const FeeCard = ({updated}: {updated: boolean}) => {
    const token = localStorage.getItem("access");
    const { user } = useUser();
    const [summary, setSummary] = useState({
        totalInvoiced: 0,
        totalPaid: 0,
        totalBalance: 0,
        cleared: 0,
        owing: 0,
        overpaid: 0,
        prevInvoiced: 0,
        prevPaid: 0,
        prevBalance: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/student-fee-summary/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { student_regno: user?.regno },
                });
                setSummary(res.data.summary);
            } catch (err) {
                console.error("Error fetching student data:", err);
            }
        };

        fetchData();
    }, [updated, token]);

    const getComparison = (current: number, previous: number) => {
        if (previous === 0 && current === 0) return { type: "same", text: "Same as previous" };
        if (previous === 0) return { type: "up", percent: 100 };
        const change = ((current - previous) / previous) * 100;
        if (change > 0) return { type: "up", percent: Math.round(change) };
        if (change < 0) return { type: "down", percent: Math.abs(Math.round(change)) };
        return { type: "same", text: "Same as previous" };
    };
 
    return (
        <div className="flex flex-row  min-w-max grid grid-cols-3 gap-4 mb-6">
            {/* Invoiced */}
            <Card className="hover:scale-105 transition-all duration-200">
                <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Invoiced</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xs lg:text-xl font-bold text-blue-600">
                            KES {summary.totalInvoiced.toLocaleString()}
                        </p>
                        {(() => {
                        const comparison = getComparison(summary.totalInvoiced, summary.prevInvoiced);
                        if (comparison.type === "up") {
                            return (
                            <span className="text-green-600 text-sm flex items-center">
                                ▲ {comparison.percent}% ↑
                            </span>
                            );
                        } else if (comparison.type === "down") {
                            return (
                            <span className="text-red-600 text-sm flex items-center">
                                ▼ {comparison.percent}% ↓
                            </span>
                            );
                        } else {
                            return <span className="text-blue-600 text-sm">~ same</span>;
                        }
                        })()}
                    </div>
                </CardContent>
            </Card>

            {/* Paid */}
            <Card className="hover:scale-105 transition-all duration-200">
                <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">Total Paid</p>
                <div className="flex items-center justify-between">
                    <p className="text-xs lg:text-xl font-bold text-green-600">
                    KES {summary.totalPaid.toLocaleString()}
                    </p>
                    {(() => {
                    const comparison = getComparison(summary.totalPaid, summary.prevPaid);
                    if (comparison.type === "up") {
                        return (
                        <span className="text-green-600 text-sm flex items-center">
                            ▲ {comparison.percent}% ↑
                        </span>
                        );
                    } else if (comparison.type === "down") {
                        return (
                        <span className="text-red-600 text-sm flex items-center">
                            ▼ {comparison.percent}% ↓
                        </span>
                        );
                    } else {
                        return <span className="text-blue-600 text-sm">~ same</span>;
                    }
                    })()}
                </div>
                </CardContent>
            </Card>

            {/* Balance */}
            <Card className="hover:scale-105 transition-all duration-200">
                <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                <div className="flex items-center justify-between">
                    <p className="text-xs lg:text-xl font-bold text-red-600">
                    KES {summary.totalBalance.toLocaleString()}
                    </p>
                    {(() => {
                    const comparison = getComparison(summary.totalBalance, summary.prevBalance);
                    if (comparison.type === "up") {
                        return (
                        <span className="text-green-600 text-sm flex items-center">
                            ▲ {comparison.percent}% ↑
                        </span>
                        );
                    } else if (comparison.type === "down") {
                        return (
                        <span className="text-red-600 text-sm flex items-center">
                            ▼ {comparison.percent}% ↓
                        </span>
                        );
                    } else {
                        return <span className="text-blue-600 text-sm">~ same</span>;
                    }
                    })()}
                </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default FeeCard;