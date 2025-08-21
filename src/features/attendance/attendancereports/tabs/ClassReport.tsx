import { useState, useEffect, useMemo } from "react";
import { PrinterIcon } from "lucide-react";
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

interface StudentAttendance {
	id: number;
	passport: string;
	name: string;
	regno: string;
	present: string;
	late: string;
	absent: string;
	present_rate: string;
	late_rate: string;
	absent_rate: string;
};

type SelectOption = {
    value: string;
    label: string;
    class_?: string;
    term?: string;
};

interface TopStudent {
    name: string;
    present: number;
    late: number;
    absent: number;
}

interface WeekdayAttendance {
  [day: string]: {
    Present: number;
    Late: number;
    Absent: number;
  };
}

export default function ClassReportDashboard() {
	const token = localStorage.getItem("access");
	const [filters, setFilters] = useState<SelectOption>({
		value:"", label: "", class_:"", term: ""
	});
	const [classes, setClasses] = useState<SelectOption[]>([]);
	const [terms, setTerms] = useState<SelectOption[]>([]);
    const [resetKey, setResetKey] = useState(0);

	const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);

	const [weekdayAttendance, setWeekdayData] = useState<WeekdayAttendance>({});
	const [unitAttendance, setUnitAttendance] = useState<UnitAttendance[]>([]);
	
	const [topPresent, setTopPresent] = useState<TopStudent[]>([]);
    const [topLate, setTopLate] = useState<TopStudent[]>([]);
    const [topAbsent, setTopAbsent] = useState<TopStudent[]>([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("/api/classes/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((cls: any) => ({
                    value: cls.id.toString(),
                    label: cls.name.toString(),
                    term: cls.intake.toString()
                }));
                setClasses(formatted);
            } catch (error) {
                console.error("Failed to load classes", error);
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

		handleSelectClass("0");

        fetchClasses();
        fetchTerms();
    }, []);

	const handleChangeTerm = async (selected_id: string) => {
        setResetKey(prev => prev + 1);
        setFilters({ ...filters, term: selected_id, class_: "" });
    };

	const filteredClasses = classes.filter((cls) => {
        const intakeMatch = !filters.term || cls.term?.toString() === filters.term;
        return intakeMatch;
    });

    const handleSelectClass = async (selected_id: string) => {
		setStudentAttendance([]);
		try {
			const response = await axios.get(`/api/class-attendance-summary/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { class_id: selected_id },
			});
			setStudentAttendance(response.data);

			const response_tops = await axios.get("/api/top-attendance-report/", {
				headers: { Authorization: `Bearer ${token}` },
				params: { class_id: selected_id },
			});
			setTopPresent(response_tops.data.top_present);
			setTopLate(response_tops.data.top_late);
			setTopAbsent(response_tops.data.top_absent);

			const response_weekday = await axios.get("/api/class-weekday-attendance-report/", {
				headers: { Authorization: `Bearer ${token}` },
				params: { class_id: selected_id }
			});
			setWeekdayData(response_weekday.data);

			const resp = await axios.get(`/api/class-unit-attendance-report/`, {
				headers: { Authorization: `Bearer ${token}` },
				params: { class_id: selected_id },
			});
			setUnitAttendance(resp.data);

		} catch (error: any) {
			Swal.fire("Error", error.response.data.error, "error")
		}
    };

	const colorMap = {
		Present: "text-green-600",
		Late: "text-yellow-600",
		Absent: "text-red-600"
	};

	const renderList = (title: string, data: TopStudent[]) => {
		const key = title.toLowerCase() as keyof TopStudent;

		return (
			<div className="p-4">
				<h4 className={`font-semibold ${colorMap[title as keyof typeof colorMap]} mb-3`}>{title}</h4>
				<ul className="space-y-2">
					{data.map((student, i) => (
						<li key={i} className="flex justify-between text-sm text-gray-700 dark:text-white/80">
							<span>{student.name}</span>
							<span className="font-bold px-3">{student[key]}</span>
						</li>
					))}
				</ul>
			</div>
		);
    };

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
						items={filteredClasses}
                    	resetTrigger={resetKey}
						placeholder="Select Class.."
						onSelect={(val) => handleSelectClass(val)}
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
					<h3 className="mb-4 text-lg font-semibold py-2 text-gray-800 dark:text-white/90">Top Attendance Summary</h3>
					<div className="flex bg-brand-100  dark:bg-slate-800 rounded-lg max-w-full overflow-x-auto">
						{renderList("Present", topPresent)}
						{renderList("Late", topLate)}
						{renderList("Absent", topAbsent)}
					</div>
				</div>

				{/* Charts on the left */}
				<div className="xl:col-span-8 space-y-6">
					<h3 className="mb-4 text-lg font-semibold py-2 text-gray-800 dark:text-white/90">Student List Summary</h3>
					<div className="max-w-full overflow-x-auto">
						<Table>
							<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
								<TableRow>
									{["Student", "Present", "Late", "Absent"].map((heading) => (
										<TableCell key={heading} isHeader className="px-1 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">{heading}</TableCell>
									))}
								</TableRow>
							</TableHeader>

							
							<TableBody className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out">
								{studentAttendance.map((student) => (
									<TableRow key={student.id}>
										<TableCell className="px-1 py-4 text-start">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<img
														width={40}
														height={40}
														src={student.passport  || "/default-avatar.png"}
														alt={student.regno}
													/>
												</div>
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{student.name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{student.regno}
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
													{student[key as keyof StudentAttendance]}%
												</Badge>
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
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
