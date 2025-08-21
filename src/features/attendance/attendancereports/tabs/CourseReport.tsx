import { PrinterIcon } from "lucide-react";
import DictSearchableSelect from "../../../../components/form/DictSelect";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import Badge from "../../../../components/ui/badge/Badge";
import HorizontalBarChart from "../../../../components/ui/reports/HorizontalBarChart";
import ClassWeekdayAverageChart from "./CourseAttendanceReport";
import UnitAttendanceBreakdownChart from "./CourseUnitBreakDown";

type SelectOption = {
    value: string;
    label: string;
    course?: string;
    term?: string;
};

interface CourseSummary{
	No_of_Classes: string;
	No_of_Students: string;
	Total_Lessons: string;
	Avg_Present: string;
	Avg_Late: string;
	Avg_Absent: string;
}

interface UnitAttendance {
	id: number;
	abbr: string;
	uncode: string;
	present: string;
	present_pct: string;
	late_pct: string;
	absent_pct: string;
	late: string;
	absent: string;
};

interface ClassAttendance {
	id: number;
	name: string;
	present: string;
	term: string;
	late: string;
	absent: string;
	present_rate: string;
	late_rate: string;
	absent_rate: string;
};

interface WeekdayAttendance {
  [day: string]: {
    Present: number;
    Late: number;
    Absent: number;
  };
}

export default function CourseReportDashboard() {
	const token = localStorage.getItem("access");
	const [selectedCourse, setSelectedCourse] = useState("0");
	const [courseSummary, setCourseSummary] = useState<CourseSummary>({
		No_of_Classes: "", No_of_Students: "", Total_Lessons: "", Avg_Present: "", Avg_Late: "", Avg_Absent: ""
	})
	const [courses, setCourses] = useState<SelectOption[]>([]);
	const [terms, setTerms] = useState<SelectOption[]>([]);
	const [weekdayAttendance, setWeekdayData] = useState<WeekdayAttendance>({});
	const [unitAttendance, setUnitAttendance] = useState<UnitAttendance[]>([]);

	const [classAttendance, setClassAttendance] = useState<ClassAttendance[]>([]);

	const [filters, setFilters] = useState<SelectOption>({
		value:"", label: "", course:"", term: ""
	});
	
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/courses/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((course: any) => ({
                    value: course.id.toString(),
                    label: course.abbr.toString()
                }));
                setCourses(formatted);
            } catch (error) {
                console.error("Failed to load courses", error);
            }
        };

        const fetchTerms = async () => {
            try {
                const response = await axios.get("/api/terms/?range=1", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((term: any) => ({
                    value: term.id.toString(),
                    label: term.termyear
                }));
                setTerms(formatted);
            } catch (error) {
                console.error("Failed to load intakes", error);
            }
        };
		
        fetchCourses();
        fetchTerms();

		handleSelectCourse("0");
    }, []);

	const handleChangeTerm = async (selected_id: string) => {
		setFilters({ ...filters, term: selected_id })
    };

    const handleSelectCourse = async (selected_id: string) => {
		setSelectedCourse(selected_id);
		setClassAttendance([]);
		try {			
			const attendance_response = await axios.get(`/api/course-attendance-summary/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { course_id: selected_id },
			});
			setClassAttendance(attendance_response.data);

			const response_weekday = await axios.get("/api/course-weekday-attendance-report/", {
				headers: { Authorization: `Bearer ${token}` },
				params: { course_id: selected_id }
			});
			setWeekdayData(response_weekday.data);

			const resp = await axios.get(`/api/course-unit-attendance-report/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { course_id: selected_id },
			});
			setUnitAttendance(resp.data);

			const resp_summary = await axios.get(`/api/course-summary/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { course_id: selected_id },
			});
			setCourseSummary(resp_summary.data);

		} catch (error: any) {
			Swal.fire("Error", error.response.data.error, "error")
		}
    };

	const renderList = (title: string, data: string) => {

		return (
			<div className="p-4">
				<h4 className={`font-semibold mb-3`}>{title}</h4>
				<p>{data}</p>
			</div>
		);
    };

	const filteredClasses = classAttendance.filter((class_) => {
        const intakeMatch = !filters.term || class_.term?.toString() === filters.term;
        return intakeMatch;
    });

	const chartData = useMemo(() => {
		const categories = Object.keys(weekdayAttendance);
		const presentData = categories.map(day => weekdayAttendance[day].Present);
		const lateData = categories.map(day => weekdayAttendance[day].Late);
		const absentData = categories.map(day => weekdayAttendance[day].Absent);

		return {
			series: [
				{ name: "Present", data: presentData },
				{ name: "Late", data: lateData },
				{ name: "Absent", data: absentData },
			],
			categories
		};
	}, [weekdayAttendance]);
	

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			{/* Header Actions */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="col-span-4 flex gap-4">
					<DictSearchableSelect
						items={terms}
						placeholder="Select Term..."
						onSelect={(val) => handleChangeTerm(val)}
					/>
					<DictSearchableSelect
						items={courses}
						placeholder="Select Course.."
						onSelect={(val) => handleSelectCourse(val)}
					/>
				</div>

				<div className="">
					Attendance Report
				</div>

				<button
					className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-blue-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-gray-200"
				>
					<PrinterIcon size={18} /> Print Report
				</button>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 ">
				<div className="xl:col-span-12 space-y-6">
					<h3 className="mb-4 text-lg font-semibold py-2 text-gray-800 dark:text-white/90">Attendance Summary</h3>
					<div className="flex bg-brand-100  dark:bg-slate-800 rounded-lg max-w-full overflow-x-auto">
						{renderList("No. of Classes", courseSummary?.No_of_Classes)}
						{renderList("No. of Students", courseSummary?.No_of_Students)}
						{renderList("Total Lessons", courseSummary?.Total_Lessons)}
						{renderList("Avg. Present", courseSummary?.Avg_Present)}
						{renderList("Avg. Late", courseSummary?.Avg_Late)}
						{renderList("Avg. Absent", courseSummary?.Avg_Absent)}
					</div>
				</div>

				{/* Charts on the left */}
				<div className="xl:col-span-8 space-y-6">
					<h3 className="mb-4 text-lg font-semibold py-2 text-gray-800 dark:text-white/90">Class List Summary</h3>
					<div className="max-w-full overflow-x-auto">
						<Table>
							<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
								<TableRow>
									{["Class", "Present", "Late", "Absent"].map((heading) => (
										<TableCell key={heading} isHeader className="px-1 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">{heading}</TableCell>
									))}
								</TableRow>
							</TableHeader>

							
							<TableBody className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out">
								{filteredClasses.map((class_) => (
									<TableRow key={class_.id}>
										<TableCell className="px-1 py-4 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{class_.name}
													</span>
												</div>
											</div>
										</TableCell>
										{["present_rate", "late_rate", "absent_rate"].map((key, i) => (
											<TableCell key={i} className="px-1 py-3 text-start">
												<Badge
													size="sm"
													color={key.includes("present") ? "success" : key.includes("late") ? "warning" : "error"}
												>
													{class_[key as keyof ClassAttendance]}%
												</Badge>
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<ClassWeekdayAverageChart  courseId={selectedCourse}/>
					<UnitAttendanceBreakdownChart courseId={selectedCourse} />
				</div>

				{/* Summary on the right */}
				<div className="xl:col-span-4">
					<HorizontalBarChart data={chartData.series} categories={chartData.categories} title={"Weekday Summary"} />

					<h3 className="mb-4 text-lg font-semibold py-2 text-gray-800 dark:text-white/90">Unit Attendance</h3>
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
										{["present_pct", "late_pct", "absent_pct"].map((key, i) => (
											<TableCell key={i} className="px-1 py-3 text-start">
												<Badge
													size="sm"
													color={key === "present_pct" ? "success" : key === "late_pct" ? "warning" : "error"}
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
