import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { Modal } from '../../../../components/ui/modal';

import { formatCurrencyShort } from '../../../../utils/format';

interface DataProp{
    total_students: string;
    total_invoice: string;
    total_receipt: string;
    total_balance: string;
    departments: [{
        id: number;
        abbr: string;
        name: string;
        students: string;
        invoice: string;
        receipt: string;
        balance: string;
        courses: [{
            id: string;
            abbr: string;
            name: string;
            students: string;
            invoice: string;
            receipt: string;
            balance: string;
        }]
    }];
}

interface PredProp{
    open: boolean,
    onClose: () => void;
}

const FeePredictionModal = ({ open, onClose }: PredProp) => {
    const token = localStorage.getItem("access");
    const [data, setData] = useState<DataProp>();
    const [expandedDept, setExpandedDept] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchPrediction();
        }
    }, [open]);

    const fetchPrediction = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/predict-fee-payments/',
                {headers: { Authorization: `Bearer ${token}` },}
            );
            setData(response.data);
        } catch (error) {
            console.error('Error fetching prediction:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDepartment = (deptId: any) => {
        setExpandedDept(expandedDept === deptId ? null : deptId);
    };

    return (
        <Modal isOpen={open} onClose={onClose} className="max-w-[900px] m-4">
            <div className="relative w-full p-4 bg-white dark:bg-gray-900 rounded-3xl lg:p-11">
                <div className="px-2 pb-8">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Fee Prediction (Next Year)
                    </h4>
                </div>

                <div className="overflow-x-auto max-h-[60vh]">
                    {loading ? (
                        <div className="text-center py-10">Loading prediction...</div>
                    ) : data ? (
                        <>
                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 bg-blue-800 rounded-xl shadow text-center">
                                    <p className="text-sm text-yellow-500">Total Predicted Students</p>
                                    <p className="text-xl font-bold text-white">{data.total_students}</p>
                                </div>
                                <div className="p-4 bg-green-800 rounded-xl shadow text-center">
                                    <p className="text-sm text-yellow-500">Predicted Invoice</p>
                                    <p className="text-xl font-bold text-white">KES {data.total_invoice.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-indigo-800 rounded-xl shadow text-center">
                                    <p className="text-sm text-yellow-500">Predicted Receipt</p>
                                    <p className="text-xl font-bold text-white">KES {data.total_receipt.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-red-800 rounded-xl shadow text-center">
                                    <p className="text-sm text-yellow-500">Predicted Balance</p>
                                    <p className="text-xl font-bold text-white">KES {data.total_balance.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Departments Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full md:table-auto table-fixed rounded-lg border text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">
                                                <span className="block md:hidden">Dept</span>
                                                <span className="hidden md:block">Department</span>
                                            </th>
                                            <th className="px-4 py-2">Students</th>
                                            <th className="px-4 py-2">Invoice</th>
                                            <th className="px-4 py-2">Receipt</th>
                                            <th className="px-4 py-2">Balance</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.departments.map((dept) => (
                                            <React.Fragment key={dept.id}>
                                                <tr
                                                    className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                    onClick={(e) => {
                                                        const isExpanding = expandedDept !== dept.id;
                                                        toggleDepartment(dept.id)

                                                        // Scroll into view after setting expanded
                                                        if (isExpanding) {
                                                            setTimeout(() => {
                                                                const rowElement = e.currentTarget;
                                                                rowElement?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                            }, 100);
                                                        }
                                                    }}
                                                    key={dept.id}
                                                >
                                                    <td className="px-4 py-2 font-semibold">
                                                        <span className="block md:hidden">{dept.abbr}</span>
                                                        <span className="hidden md:block">{dept.name}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        {dept.students}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className="block md:hidden">KES {formatCurrencyShort(dept.invoice)}</span>
                                                        <span className="hidden md:block">KES {dept.invoice.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className="block md:hidden">KES {formatCurrencyShort(dept.receipt)}</span>
                                                        <span className="hidden md:block">KES {dept.receipt.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className="block md:hidden">KES {formatCurrencyShort(dept.balance)}</span>
                                                        <span className="hidden md:block">KES {dept.balance.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <button onClick={() => toggleDepartment(dept.id)}>
                                                            {expandedDept === dept.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {expandedDept === dept.id && (
                                                    <tr>
                                                        <td colSpan={6} className="">
                                                            <table className="w-full text-xs mt-2">
                                                                <thead>
                                                                    <tr className="text-gray-600">
                                                                        <th className="px-4 py-1 text-left">Course</th>
                                                                        <th className="px-4 py-1 text-center">Students</th>
                                                                        <th className="px-4 py-1 text-center">Invoice</th>
                                                                        <th className="px-4 py-1 text-center">Receipt</th>
                                                                        <th className="px-4 py-1 text-center">Balance</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {dept.courses.map((course) => (
                                                                        <tr key={course.id} className="border-t bg-gray-200 dark:bg-gray-700">
                                                                            <td className="px-4 py-1">
                                                                                <span className="block md:hidden">{course.abbr}</span>
                                                                                <span className="hidden md:block">{course.name}</span>
                                                                            </td>
                                                                            <td className="px-4 py-1 text-center">{course.students}</td>
                                                                            <td className="px-4 py-2 text-center">
                                                                                <span className="block md:hidden">KES {formatCurrencyShort(course.invoice)}</span>
                                                                                <span className="hidden md:block">KES {course.invoice.toLocaleString()}</span>
                                                                            </td>
                                                                            <td className="px-4 py-2 text-center">
                                                                                <span className="block md:hidden">KES {formatCurrencyShort(course.receipt)}</span>
                                                                                <span className="hidden md:block">KES {course.receipt.toLocaleString()}</span>
                                                                            </td>
                                                                            <td className="px-4 py-2 text-center">
                                                                                <span className="block md:hidden">KES {formatCurrencyShort(course.balance)}</span>
                                                                                <span className="hidden md:block">KES {course.balance.toLocaleString()}</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-red-500">Failed to load prediction data.</p>
                    )}  
                </div>
            </div>
        </Modal>
    );
};

export default FeePredictionModal;