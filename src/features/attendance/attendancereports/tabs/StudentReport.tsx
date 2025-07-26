import { useState, useEffect, useMemo } from "react";
import { PrinterIcon } from "lucide-react";
import RadialAttendanceChart from "../../../../components/ui/reports/AttendanceDonutChart";
import LineShadedChart from "../../../../components/ui/reports/LineShadedCharts";
import MultiLineShadedChart from "../../../../components/ui/reports/MultilineShadedCharts";
import AttendanceBarChart from "../../../../components/ui/reports/CompoundBarChart";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import Badge from "../../../../components/ui/badge/Badge";
import DictSearchableSelect from "../../../../components/form/DictSelect";
import axios from "axios";
import Swal from "sweetalert2";
import HorizontalBarChart from "../../../../components/ui/reports/HorizontalBarChart";

interface UnitAttendance {
	id: number;
	abbr: string;
	uncode: string;
	present: string;
	late: string;
	absent: string;
};

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

type SelectOption = {
    value: string;
    label: string;
};

interface WeeklyTrend {
    weeks: string[]; 
    present: number[];
    late: number[]; 
    absent: number[];
};

interface ModuleTrendData {
    module: string;
    present: number;
    late: number;
    absent: number;
};

interface WeekdayAttendance {
  [day: string]: {
    present: number;
    late: number;
    absent: number;
    unmarked: number;
  };
}

export default function StudentReportDashboard() {
    const token = localStorage.getItem("access");
	const [students, setStudents] = useState<SelectOption[]>([]);
	
	const [currentAttendanceData, setCurrentAttendanceData] = useState<CurrentData>({
		student: "", from: "", to: "", expected_days: "", marked_days: "",
		unmarked: "", present: "", late: "", absent: "", unmarked_percentage: 0,
		present_percentage: 0, absent_percentage: 0, late_percentage: 0,
	});

	const [unitAttendance, setUnitAttendance] = useState<UnitAttendance[]>([]);

	const [lessons, setLessons] = useState<[]>([]);
	const [register_values, setRegValues] = useState<[]>([]);

	const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrend>({
		weeks: [],
		present: [],
		late: [],
		absent: [],
	});

	const [weekdayAttendance, setWeekdayData] = useState<WeekdayAttendance>({});

	const [moduleTrendData, setModuleTrendData] = useState<ModuleTrendData[]>([]);
	
	const chartData = useMemo(() => {
		const categories = Object.keys(weekdayAttendance);
		const presentData = categories.map(day => weekdayAttendance[day].present);
		const lateData = categories.map(day => weekdayAttendance[day].late);
		const absentData = categories.map(day => weekdayAttendance[day].absent);
		const unmarkedData = categories.map(day => weekdayAttendance[day].unmarked);

		return {
			series: [
				{ name: "Present", data: presentData },
				{ name: "Late", data: lateData },
				{ name: "Absent", data: absentData },
				{ name: "Unmarked", data: unmarkedData },
			],
			categories
		};
	}, [weekdayAttendance]);

    useEffect(() => {
		const fetchStudents = async () => {
            try {
                const response = await axios.get("/api/students/?all=true",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
				const formatted = response.data.results.map((student: any) => ({
                    value: student.id.toString(),
                    label: student.fname +" " + student.mname + " " + student.sname + "-" + student.regno
                }));
                setStudents(formatted);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            }
        };

		fetchStudents();
    }, []);

    const handleChangeStudent = async (selected_id: string) => {
		setUnitAttendance([]);
		setLessons([]);
		setRegValues([]);
		setWeeklyTrend({
			weeks: [], present: [], absent: [], late: []
		});
		setModuleTrendData([]);
		
		try {
			const response = await axios.get(`/api/student-analysis/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { student_id: selected_id },
			});
			setCurrentAttendanceData(response.data);

			const response_weekday = await axios.get("/api/student-daily-attendance-summary/", {
				headers: { Authorization: `Bearer ${token}` },
				params: { student_id: selected_id }
			});
			setWeekdayData(response_weekday.data);

			const resp = await axios.get(`/api/student-unit-attendance/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { student_id: selected_id },
			});
			setUnitAttendance(resp.data);

			const resp_data = await axios.get(`/api/student-lesson-analysis/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { student_id: selected_id },
			});
			setLessons(resp_data.data.lessons);
			setRegValues(resp_data.data.reg_values);

			const resp_trend = await axios.get(`/api/student-weekly-attendance/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { student_id: selected_id },
			});

			setWeeklyTrend(resp_trend.data);

			const response_module = await axios.get("/api/student-module-attendance-summary/", {
				headers: { Authorization: `Bearer ${token}` },
				params: { student_id: selected_id }
			});
			setModuleTrendData(response_module.data);

		} catch (error: any) {
			Swal.fire("Error", error.response.data.error, "error")
		}
	};

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			{/* Header Actions */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="col-span-12">
					<DictSearchableSelect
						items={students}
						placeholder="Select Student.."
						onSelect={(val) => handleChangeStudent(val)}
					/>
				</div>
				<div className="">
					{currentAttendanceData.student} Attendance Report
				</div>
				<button
					className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-blue-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-gray-200"
				>
					<PrinterIcon size={18} />
					Print Report
				</button>
			</div>

			<div  className="grid grid-cols-1 xl:grid-cols-12 gap-6 ">
				{/* Charts on the left */}
				<div className="xl:col-span-8 space-y-6">
					{/* Attendance Donut Charts */}
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
						<div className="flex-1 min-w-[150px]">
							<RadialAttendanceChart
								value={currentAttendanceData.unmarked_percentage}
								label="Unmarked"
								color="#555555"
								bgColor="bg-gray-50 dark:bg-gray-500/15"
								textColor="text-white-600 dark:text-white-500"
							/>
						</div>
					</div>


					{/* Trend Charts */}
					<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
						<LineShadedChart title="Attendance Trend" categories={lessons} seriesData={register_values} />
						<MultiLineShadedChart title="Weekly Comparison" categories={weeklyTrend.weeks} presentData={weeklyTrend.present} lateData={weeklyTrend.late} absentData={weeklyTrend.absent} />
					</div>

					{/* Bar Charts */}
					<AttendanceBarChart title="Attendance by Module" categories={moduleTrendData.map(m => m.module)} presentData={moduleTrendData.map(m => m.present)} lateData={moduleTrendData.map(m => m.late)} absentData={moduleTrendData.map(m => m.absent)} />
				</div>

				{/* Summary on the right */}
				<div className="xl:col-span-4">
					<HorizontalBarChart data={chartData.series} categories={chartData.categories} title={""} />

					<h3 className="mb-4 text-lg font-semibold py-2 text-gray-800 dark:text-white/90">Current Module Summary</h3>
					<div className="max-w-full overflow-x-auto">
						<Table>
							<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
								<TableRow>
									{["Unit", "Present", "Late", "Absent"].map((heading) => (
										<TableCell key={heading} isHeader className="px-1 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">{heading}</TableCell>
									))}
								</TableRow>
							</TableHeader>
							
							<TableBody className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out">
								{unitAttendance.map((unit) => (
									<TableRow key={unit.id}>
										<TableCell className="px-1 py-4 text-start">
											<div className="flex items-start gap-3">
												<div>
													<span className="block font-medium text-theme-sm text-gray-800 dark:text-white/90">{unit.abbr}</span>
													<span className="block text-theme-xs text-gray-500 dark:text-gray-400">{unit.uncode}</span>
												</div>
											</div>
										</TableCell>
										{["present", "late", "absent"].map((key, i) => (
											<TableCell key={i} className="px-1 py-3 text-start">
												<Badge
													size="sm"
													color={key === "present" ? "success" : key === "late" ? "warning" : "error"}
												>
													{unit[key as keyof UnitAttendance]}
												</Badge>
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>

		</div>
	);
}
