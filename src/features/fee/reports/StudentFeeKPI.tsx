
import PaymentProgressBar from "./PaymentProgress";
import LineShadedChart from "../../../components/ui/reports/LineShadedCharts";
import { useEffect, useState } from "react";
import axios from "axios";
import MultiBarChart from "../../../components/ui/reports/MultiBarChart";

type KPIProps = {
    student: string;
    term: string;
    mode: string;
}

export interface FeeStatus{
    status: string;
    arrears: string;
}

interface TermTrend {
    term: string;
    invoice: number;
    reciept: number;
};

export default function StudentKPI({student, term, mode}: KPIProps) {
    const token = localStorage.getItem("access");
    const [receipt_dates, setReceiptDate] = useState<[]>([]);
    const [receipt_values, setReceiptValues] = useState<[]>([]);
    const [status, setStatus] = useState<FeeStatus>();
    const [paymentProgress, setPaymentProgress] = useState(0);
    const [term_series, setTermSeries] = useState<TermTrend[]>([]);
 
    useEffect(() => {
        setPaymentProgress(0);
		const fetchRecieptSummary = async () => {
            try {
                const response = await axios.get("/api/fetch-reciept-summary/",
                    { 
                        headers: { Authorization: `Bearer ${token}` },
                        params: { student_regno: student, term_id: term } 
                    },
                );
                setReceiptDate(response.data.recieptDates);
                setReceiptValues(response.data.recieptValues);
                setStatus(response.data.status);
                setPaymentProgress(response.data.paymentProgress);
                setTermSeries(response.data.term_series)
            } catch (error) {
                console.error("Failed to fetch receipts:", error);
            }
        };

		fetchRecieptSummary();
    }, [student, term, mode]);

    return (
        <div className="space-y-6 p-6 rounded-xl shadow-md">
            {/* Progress Bar */}
            <div className="mb-4">
                <PaymentProgressBar paymentProgress={paymentProgress}/>
            </div>

            <LineShadedChart title="Transaction Trend" categories={receipt_dates} seriesData={receipt_values} />

            {/* Outstanding Balance Card */}
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <div>
                    <h4 className="text-lg font-medium text-gray-700 dark:text-white">Outstanding Balance</h4>
                    <p className={`text-2xl font-bold ${
                        status?.status === "Cleared"
                        ? "text-green-600"
                        : status?.status === "Overpaid"
                        ? "text-blue-600"
                        : "text-red-600"
                        } `}>KES {status?.arrears}</p>
                </div>
                <div>
                    <span
                        className={`px-4 py-1 rounded-full text-white font-semibold text-sm ${
                            status?.status === "Cleared"
                            ? "bg-green-600"
                            : status?.status === "Overpaid"
                            ? "bg-blue-600"
                            : "bg-red-600"
                        }`}
                    >
                        {status?.status}
                    </span>
                </div>
            </div>

            {/* Term-wise Bar Chart */}
            <MultiBarChart title="Term-Wise Comparison" categories={term_series.map(t => t.term)} DataA_Title="Receipt" DataB_Title="Invoice" DataA={term_series.map(t => t.reciept)} DataB={term_series.map(t => t.invoice)}/>
        </div>
    );
}
