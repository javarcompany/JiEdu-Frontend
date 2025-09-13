import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import InstitutionFeeTrendChart from "./InstitutionFeeTrend";
import MonthlyFeeBarChart from "./InstitutionFeeMonthlyTrend";
import { formatCurrencyShort } from "../../../../utils/format";

interface DepartmentSummaryProp {
    id: number;
    name: string;
    abbr: string;
    invoiced: string;
    paid: string;
    balance: string;
    status: string;
    courses: [{
        id: number;
        name: string;
        abbr: string;
        invoiced: number;
        paid: number;
        balance: number;
        status: string;
    }]
}

interface ClassProp{
    name: string;
    balance: number;
}

export default function InstitutionFeeDashboard() {
    const token = localStorage.getItem("access");
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
    const [topClasses, setTopClasses] = useState<ClassProp[]>([]);
    const [clearedClasses, setClearedClasses] = useState<ClassProp[]>([]);
    const [overpaidClasses, setOverpaidClasses] = useState<ClassProp[]>([]);
    const [byDepartment, setByDepartment] = useState<DepartmentSummaryProp[]>([]);
    const [expandedDept, setExpandedDept] = useState(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/institution-fee-summary/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { summary, topClasses, clearedClasses, overpaidClasses, byDepartment } = res.data;
                setSummary(summary);
                setTopClasses(topClasses);
                setClearedClasses(clearedClasses);
                setOverpaidClasses(overpaidClasses);
                setByDepartment(byDepartment);
            } catch (err) {
                console.error("Error fetching institution data:", err);
            }
        };

        fetchData();
    }, []);

    const getComparison = (current: number, previous: number) => {
        if (previous === 0 && current === 0) return { type: "same", text: "Same as previous" };
        if (previous === 0) return { type: "up", percent: 100 };
        const change = ((current - previous) / previous) * 100;
        if (change > 0) return { type: "up", percent: Math.round(change) };
        if (change < 0) return { type: "down", percent: Math.abs(Math.round(change)) };
        return { type: "same", text: "Same as previous" };
    };

    const filteredDepartments = byDepartment.map((dep) => {
        const filteredCourses = dep.courses.filter((c) => {
            if (filter === "All") return true;
            if (filter === "Cleared") return c.balance === 0;
            if (filter === "Overpaid") return c.balance < 0;
            if (filter === "Not Cleared") return c.balance > 0;
        });
        const depFiltered = { ...dep, courses: filteredCourses, };
        return depFiltered;
    }).filter((dep) => filter === "All" || dep.courses.length > 0);

    const toggleDepartment = (deptId: any) => {
        setExpandedDept(expandedDept === deptId ? null : deptId);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Institution Fee Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Invoiced */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 mb-1">Total Invoiced</p>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-blue-600">
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
                <Card>
                    <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Paid</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-green-600">
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
                <Card>
                    <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-red-600">
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

            <Tabs defaultValue="trends">
                <TabsList className="mb-4 flex flex-wrap justify-between lg:justify-start gap-2 text-sm md:text-base w-full">
                    <TabsTrigger value="trends" className="flex-1 lg:flex-none">Trends</TabsTrigger>
                    <TabsTrigger value="by-course" className="flex-1 lg:flex-none">Department Breakdown</TabsTrigger>
                    <TabsTrigger value="top" className="flex-1 lg:flex-none">Top & Bottom Classes</TabsTrigger>
                </TabsList>

                <TabsContent value="trends">
                    <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                        <MonthlyFeeBarChart />
                        
                        <InstitutionFeeTrendChart />
                    </div>
                </TabsContent>

                <TabsContent value="by-course">
                    <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                        <div className="flex gap-2 mb-3">
                            {['All', 'Cleared', 'Overpaid', 'Not Cleared'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded text-sm font-medium border ${
                                        filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left">Department</th>
                                    <th className="px-4 py-2 text-center">Invoiced</th>
                                    <th className="px-4 py-2 text-center">Paid</th>
                                    <th className="px-4 py-2 text-center">Balance</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {filteredDepartments.length > 0 ? (
                                    filteredDepartments.map((dep) => (
                                        <React.Fragment key={dep.id}>
                                            {/* Department Row */}
                                            <tr
                                                className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={(e) => {
                                                    const isExpanding = expandedDept !== dep.id;
                                                    toggleDepartment(dep.id)

                                                    // Scroll into view after setting expanded
                                                    if (isExpanding) {
                                                        setTimeout(() => {
                                                            const rowElement = e.currentTarget;
                                                            rowElement?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                        }, 100);
                                                    }
                                                }}
                                                key={dep.id}
                                            >
                                                <td className="px-4 py-2 flex items-center gap-2 font-medium">
                                                    <button onClick={() => toggleDepartment(dep.id)}>
                                                        {expandedDept === dep.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </button>
                                                    <span className="block md:hidden">{dep.abbr}</span>
                                                    <span className="hidden md:block">{dep.name}</span>
                                                </td>

                                                <td className="px-4 py-2 text-center">
                                                    <span className="block md:hidden">KES {formatCurrencyShort(dep.invoiced)}</span>
                                                    <span className="hidden md:block">KES {dep.invoiced.toLocaleString()}</span>
                                                </td>

                                                <td className="px-4 py-2 text-center">
                                                    <span className="block md:hidden">KES {formatCurrencyShort(dep.paid)}</span>
                                                    <span className="hidden md:block">KES {dep.paid.toLocaleString()}</span>
                                                </td>

                                                <td className="px-4 py-2 text-center">
                                                    <span className="block md:hidden">KES {formatCurrencyShort(dep.balance)}</span>
                                                    <span className="hidden md:block">KES {dep.balance.toLocaleString()}</span>
                                                </td>

                                            </tr>

                                            {/* Course Rows (Expanded) */}
                                            {expandedDept === dep.id && (
                                                dep.courses.map((c) => (
                                                    <tr
                                                        key={c.id}
                                                        className="border-t dark:border-gray-700 bg-gray-100/60 dark:bg-gray-800 text-sm"
                                                    >
                                                        <td className="pl-10 py-2 text-blue-600">
                                                            <span className="block md:hidden">{c.abbr}</span>
                                                            <span className="hidden md:block">{c.name}</span>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className="block md:hidden">KES {formatCurrencyShort(c.invoiced)}</span>
                                                            <span className="hidden md:block">KES {c.invoiced.toLocaleString()}</span>
                                                        </td>

                                                        <td className="py-2 text-center">
                                                            <span className="block md:hidden">KES {formatCurrencyShort(c.paid)}</span>
                                                            <span className="hidden md:block">KES {c.paid.toLocaleString()}</span>
                                                        </td>

                                                        <td className="py-2 text-center">
                                                            <span className="block md:hidden">KES {formatCurrencyShort(c.balance)}</span>
                                                            <span className="hidden md:block">KES {c.balance.toLocaleString()}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                                            No record found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                <TabsContent value="top">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                            <h4 className="font-semibold mb-2">Top 5 Owing Classes</h4>
                            {topClasses.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Class</th>
                                            <th className="px-4 py-2 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topClasses.map((cls, i) => (
                                            <tr key={i} className="border-t dark:border-gray-700">
                                                <td className="px-4 py-2">{cls.name}</td>
                                                <td className="px-4 py-2 text-right text-red-600">KES {cls.balance.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-gray-500">No record found...</p>
                            )}
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                            <h4 className="font-semibold mb-2">Top 5 Cleared Classes</h4>
                            {clearedClasses.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Class</th>
                                            <th className="px-4 py-2 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clearedClasses.map((cls, i) => (
                                            <tr key={i} className="border-t dark:border-gray-700">
                                            <td className="px-4 py-2">{cls.name}</td>
                                            <td className="px-4 py-2 text-right text-green-600">KES {cls.balance.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-gray-500">No record found...</p>
                            )}
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                            <h4 className="font-semibold mb-2">Top 5 Overpaid Classes</h4>
                            {overpaidClasses.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Class</th>
                                            <th className="px-4 py-2 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overpaidClasses.map((cls, i) => (
                                            <tr key={i} className="border-t dark:border-gray-700">
                                            <td className="px-4 py-2">{cls.name}</td>
                                            <td className="px-4 py-2 text-right text-blue-600">KES {cls.balance.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-gray-500">No record found...</p>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
