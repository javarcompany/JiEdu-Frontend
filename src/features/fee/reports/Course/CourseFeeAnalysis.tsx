import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Props {
  courseId: string;
  termId: string;
}

type ClassSummary = {
  class_id: string;
  class_name: string;
  total_invoiced: number;
  total_paid: number;
  total_balance: number;
  status: "Cleared" | "Owing" | "Overpaid";
};

export default function CourseFeeAnalysis({ courseId, termId }: Props) {
  const [data, setData] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/class-income-statement/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { course_id: courseId, term_id: termId },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, termId]);

  const totalInvoice = data.reduce((sum, c) => sum + c.total_invoiced, 0);
  const totalPaid = data.reduce((sum, c) => sum + c.total_paid, 0);
  const totalBalance = data.reduce((sum, c) => sum + c.total_balance, 0);

  const cleared = data.filter((c) => c.total_balance === 0).length;
  const clearedPercentage = data.length > 0 ? ((cleared / data.length) * 100).toFixed(1) : "0.0";

  const pieData = [
    { name: "Cleared", value: data.filter((c) => c.total_balance === 0).length },
    { name: "Owing", value: data.filter((c) => c.total_balance > 0).length },
    { name: "Overpaid", value: data.filter((c) => c.total_balance < 0).length },
  ];

  const COLORS = ["#16a34a", "#dc2626", "#2563eb"];

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading analysis...</p>
      ) : (
        <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card title="Total Invoiced" value={`KES ${totalInvoice.toLocaleString()}`}  className="bg-blue-800"/>
                <Card title="Total Paid" value={`KES ${totalPaid.toLocaleString()}`}  className="bg-green-800"/>
                <Card title="Total Balance" value={`KES ${totalBalance.toLocaleString()}`}  className="bg-red-700"/>
                <Card title="Cleared %" value={`${clearedPercentage}%`} className="bg-gray-700" />
            </div>

            {/* Bar Chart */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                <h4 className="mb-2 font-semibold text-lg">Class Balances</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <XAxis dataKey="class_name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="total_balance" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                <h4 className="mb-2 font-semibold text-lg">Class Payment Status Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Top 5 Owing Classes */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                    <h4 className="mb-3 font-semibold text-lg text-gray-800 dark:text-white">Top 5 Owing Classes</h4>
                    <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 dark:text-gray-400">
                        <tr>
                        <th className="py-1">Class</th>
                        <th className="py-1 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((cls) => cls.total_balance > 0).length === 0 ? (
                        <tr>
                            <td colSpan={2} className="py-2 text-center text-gray-500 dark:text-gray-400">
                            No record found...
                            </td>
                        </tr>
                        ) : (
                        data
                            .filter((cls) => cls.total_balance > 0)
                            .sort((a, b) => b.total_balance - a.total_balance)
                            .slice(0, 5)
                            .map((cls) => (
                            <tr key={cls.class_id} className="border-t border-gray-100 dark:border-gray-700">
                                <td className="py-1">{cls.class_name}</td>
                                <td className="py-1 text-right">KES {cls.total_balance.toLocaleString()}</td>
                            </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>

                {/* Top 5 Cleared Classes */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                    <h4 className="mb-3 font-semibold text-lg text-gray-800 dark:text-white">Top 5 Cleared Classes</h4>
                    <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 dark:text-gray-400">
                        <tr>
                        <th className="py-1">Class</th>
                        <th className="py-1 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((cls) => cls.total_balance === 0).length === 0 ? (
                        <tr>
                            <td colSpan={2} className="py-2 text-center text-gray-500 dark:text-gray-400">
                            No record found...
                            </td>
                        </tr>
                        ) : (
                        data
                            .filter((cls) => cls.total_balance === 0)
                            .slice(0, 5)
                            .map((cls) => (
                            <tr key={cls.class_id} className="border-t border-gray-100 dark:border-gray-700">
                                <td className="py-1">{cls.class_name}</td>
                                <td className="py-1 text-right">KES 0</td>
                            </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>

                {/* Top 5 Overpaid Classes */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                    <h4 className="mb-3 font-semibold text-lg text-gray-800 dark:text-white">Top 5 Overpaid Classes</h4>
                    <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 dark:text-gray-400">
                        <tr>
                        <th className="py-1">Class</th>
                        <th className="py-1 text-right">Overpaid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((cls) => cls.total_balance < 0).length === 0 ? (
                        <tr>
                            <td colSpan={2} className="py-2 text-center text-gray-500 dark:text-gray-400">
                            No record found...
                            </td>
                        </tr>
                        ) : (
                        data
                            .filter((cls) => cls.total_balance < 0)
                            .sort((a, b) => a.total_balance - b.total_balance)
                            .slice(0, 5)
                            .map((cls) => (
                            <tr key={cls.class_id} className="border-t border-gray-100 dark:border-gray-700">
                                <td className="py-1">{cls.class_name}</td>
                                <td className="py-1 text-right">KES {Math.abs(cls.total_balance).toLocaleString()}</td>
                            </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>


        </>
      )}
    </div>
  );
}

function Card({ title, value, className }: { title: string; value: string; className: string; }) {
  return (
    <div className={`dark:bg-gray-800 shadow rounded-lg p-4 ${className}`} >
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
