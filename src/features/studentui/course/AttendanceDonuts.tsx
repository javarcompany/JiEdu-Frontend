import { useEffect, useState } from "react";
import RadialAttendanceChart from "../../../components/ui/reports/AttendanceDonutChart";
import axios from "axios";

interface CurrentData{
	student: string;
	from: string;
	to: string;
	expected_days: string;
	marked_days: string;
	present: string;
	late: string;
	absent: string;
	unmarked: string;
	present_percentage: number;
	absent_percentage: number;
	late_percentage: number;
	unmarked_percentage: number;
};

export default function AttendanceDonut({student_regno}: {student_regno: string | undefined}) {
    const token = localStorage.getItem("access");
    const [currentAttendanceData, setCurrentAttendanceData] = useState<CurrentData>({
        student: "", from: "", to: "", expected_days: "", marked_days: "",
        unmarked: "", present: "", late: "", absent: "", unmarked_percentage: 0,
        present_percentage: 0, absent_percentage: 0, late_percentage: 0,
    });

    useEffect(() => {
        // Fetch attendance data for the student
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(`/api/student-analysis/`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { student_regno: student_regno },
                });
                setCurrentAttendanceData(response.data);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
	    };

	    fetchAttendanceData();
    }, [student_regno]);

    return (
        <div className="flex flex-wrap gap-4 md:flex-nowrap md:gap-6 xl:gap-4">
            <div className="flex-1 min-w-[150px]">
                <RadialAttendanceChart
                    value={currentAttendanceData?.present_percentage}
                    label="Present"
                    color="#22c55e"
                    bgColor="bg-green-50 dark:bg-green-500/15"
                    textColor="text-green-600 dark:text-green-500"
                />
            </div>
            <div className="flex-1 min-w-[150px]">
                <RadialAttendanceChart
                    value={currentAttendanceData?.late_percentage}
                    label="Late"
                    color="#eab308"
                    bgColor="bg-yellow-50 dark:bg-yellow-500/15"
                    textColor="text-yellow-600 dark:text-yellow-500"
                />
            </div>
            <div className="flex-1 min-w-[150px]">
                <RadialAttendanceChart
                    value={currentAttendanceData?.absent_percentage}
                    label="Absent"
                    color="#ef4444"
                    bgColor="bg-red-50 dark:bg-red-500/15"
                    textColor="text-red-600 dark:text-red-500"
                />
            </div>
        </div>
    );
}