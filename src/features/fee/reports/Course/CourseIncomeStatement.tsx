import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../../../components/ui/modal";
import Input from "../../../../components/form/input/InputField";

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
};

type StudentDetail = {
  regno: string;
  profile_picture?: string;
  student_name: string;
  invoice_amount: number;
  amount_paid: number;
  balance: number;
  status: "Cleared" | "Owing" | "Overpaid";
};

export default function CourseIncomeStatement({ courseId, termId }: Props) {
    const token = localStorage.getItem("access");
    const [data, setData] = useState<ClassSummary[]>([]);
    const [filter, setFilter] = useState<"All" | "Cleared" | "Owing" | "Overpaid">("All");
    const [loading, setLoading] = useState(false);

    const [selectedClass, setSelectedClass] = useState<ClassSummary | null>(null);
    const [students, setStudents] = useState<StudentDetail[]>([]);
    const [studentFilter, setStudentFilter] = useState<"All" | "Cleared" | "Owing" | "Overpaid">("All");
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleClassClick = async (cls: ClassSummary) => {
        setSelectedClass(cls);
        try {
            const res = await axios.get("/api/class-student-breakdown/", {
            headers: { Authorization: `Bearer ${token}` },
            params: { class_id: cls.class_id, term_id: termId },
            });
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        }
    };

    const filteredClasses = () => {
        switch (filter) {
            case "Cleared": return data.filter((c) => c.total_balance === 0);
            case "Owing": return data.filter((c) => c.total_balance > 0);
            case "Overpaid": return data.filter((c) => c.total_balance < 0);
            default: return data;
        }
    };

    const filteredStudents = () => {
        return students.filter((s) => {
            const matchesStatus =
            studentFilter === "All" || s.status === studentFilter;
            const matchesQuery =
            s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.regno.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesQuery;
        });
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Income Statement by Class</h2>
                <div className="flex gap-2">
                    {["All", "Cleared", "Owing", "Overpaid"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as typeof filter)}
                        className={`px-3 py-1 rounded text-sm font-medium border ${
                        filter === f
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                    >
                        {f}
                    </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            ) : (
                <div className="overflow-x-auto rounded-md border border-blue-200 bg-blue-50 dark:bg-transparent dark:border-gray-700">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-left">Class</th>
                                <th className="px-4 py-3 font-semibold text-right">Invoiced</th>
                                <th className="px-4 py-3 font-semibold text-right">Paid</th>
                                <th className="px-4 py-3 font-semibold text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses().map((cls) => (
                            <tr
                                key={cls.class_id}
                                onClick={() => handleClassClick(cls)}
                                className="cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                <td className="px-4 py-3">{cls.class_name}</td>
                                <td className="px-4 py-3 text-right">KES {cls.total_invoiced.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">KES {cls.total_paid.toLocaleString()}</td>
                                <td
                                className={`px-4 py-3 text-right ${
                                    cls.total_balance > 0 ? "text-red-600" :
                                    cls.total_balance < 0 ? "text-green-600" :
                                    "text-gray-700 dark:text-white"
                                }`}
                                >
                                KES {cls.total_balance.toLocaleString()}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={!!selectedClass} onClose={() => setSelectedClass(null)} className="max-w-[900px] m-4">
                <div className="relative w-full p-4 bg-white dark:bg-gray-900 rounded-3xl lg:p-11">

                    <div className="px-2 pb-8">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedClass?.class_name} - Student Breakdown
                        </h4>

                        <div className="flex flex-col gap-2 md:flex-row md:justify-between mb-4 pt-2">
                            <div className="flex gap-2">
                                {["All", "Cleared", "Owing", "Overpaid"].map((f) => (
                                    <button
                                    key={f}
                                    onClick={() => setStudentFilter(f as typeof studentFilter)}
                                    className={`px-3 py-1 rounded text-sm font-medium border ${
                                        studentFilter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                    >
                                    {f}
                                    </button>
                                ))}
                            </div>

                            <Input
                                type="text"
                                placeholder="Search by name or regno"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-3 py-1 text-sm rounded border dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left">Student</th>
                                    <th className="px-4 py-2 text-right">Invoice</th>
                                    <th className="px-4 py-2 text-right">Receipt</th>
                                    <th className="px-4 py-2 text-right">Balance</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStudents().map((s, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t dark:border-gray-700 text-gray-700 dark:text-white"
                                    >
                                        {/* Student cell with image, name, regno */}
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <img
                                            src={s.profile_picture || "/default-profile.png"}
                                            alt={s.student_name}
                                            className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div className="flex flex-col text-sm leading-tight">
                                            <span className="font-medium">{s.student_name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{s.regno}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm">KES {s.invoice_amount}</td>
                                        <td className="px-4 py-3 text-right text-sm">KES {s.amount_paid}</td>
                                        <td className="px-4 py-3 text-right text-sm">KES {s.balance}</td>

                                        <td
                                            className={`px-4 py-3 text-sm font-medium ${
                                            s.status === "Cleared"
                                                ? "text-green-600"
                                                : s.status === "Overpaid"
                                                ? "text-blue-600"
                                                : "text-red-600"
                                            }`}
                                        >
                                            {s.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            {/* Total Row */}
                            <tfoot>
                                <tr className="font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white border-t">
                                    <td className="px-4 py-3 text-left">Total</td>
                                    <td className="px-4 py-3 text-right">
                                        KES {filteredStudents().reduce((sum, s) => sum + s.invoice_amount, 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        KES {filteredStudents().reduce((sum, s) => sum + s.amount_paid, 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        KES {filteredStudents().reduce((sum, s) => sum + s.balance, 0).toLocaleString()}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-6">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-700 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z"
                                />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-white font-medium">Print</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
