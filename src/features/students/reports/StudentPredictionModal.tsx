import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { Modal } from '../../../components/ui/modal';

interface DataProp{
    year: string;
    total_predicted: string;
}

interface PredProp{
    open: boolean,
    onClose: () => void;
}
 
const StudentPredictionModal = ({ open, onClose }: PredProp) => {
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
            const response = await axios.get('/api/predict-applications/',
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
                        Student Prediction ({data?.year})
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
                                    <p className="text-xl font-bold text-white">{data.total_predicted}</p>
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
                                            <th className="px-4 py-2">Gender</th>
                                            <th className="px-4 py-2">{"< "}18 Years</th>
                                            <th className="px-4 py-2">18 - 24 Years</th>
                                            <th className="px-4 py-2">Above 24 Years</th>
                                            <th className="px-4 py-2">Total</th>
                                            <th className="px-4 py-2">Dev</th>
                                        </tr>
                                    </thead>

                                    <tbody>

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

export default StudentPredictionModal;