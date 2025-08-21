import { useEffect, useState } from "react";
import LineShadedChart from "../../../components/ui/reports/LineShadedCharts";
import axios from "axios";

export default function StudentTrend({student_regno}:{student_regno:string | undefined}) {
    const token = localStorage.getItem("access");
    const student_id = localStorage.getItem("student_id");
	const [lessons, setLessons] = useState<[]>([]);
    const [register_values, setRegValues] = useState<[]>([]);
    
    const [receipt_dates, setReceiptDate] = useState<[]>([]);
    const [receipt_values, setReceiptValues] = useState<[]>([]);

    useEffect( () => {
        const fetchAttendanceTrend = async () => {
            const resp_data = await axios.get(`/api/student-lesson-analysis/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { student_id: student_id },
            });
            setLessons(resp_data.data.lessons);
            setRegValues(resp_data.data.reg_values);
        }

        const fetchRecieptSummary = async () => {
            try {
                const response = await axios.get("/api/fetch-reciept-summary/",
                    { 
                        headers: { Authorization: `Bearer ${token}` },
                        params: { student_regno: student_regno } 
                    },
                );
                setReceiptDate(response.data.recieptDates);
                setReceiptValues(response.data.recieptValues);
            } catch (error) {
                console.error("Failed to fetch receipts:", error);
            }
        };

        fetchRecieptSummary();

        fetchAttendanceTrend();
    }, []);


    return (
        <>
            <div className="grid grid-cols-12 gap-2 md:col-span-12">
                <div className="col-span-12 lg:col-span-6">
                    <LineShadedChart title="Attendance Trend" categories={lessons} seriesData={register_values} />
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <LineShadedChart title="Transaction Trend" categories={receipt_dates} seriesData={receipt_values} />
                </div>
            </div>
        </>
    )
}