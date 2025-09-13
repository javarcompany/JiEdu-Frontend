import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import { TimeTable } from "../dashboard/TablesPreview";
import { Day } from "../setup/Days";
import { Lesson } from "../setup/SetupPreview";
import { Class } from "../../classes/ClassesTable";

import DictSearchableSelect from "../../../components/form/DictSelect";
import { PrinterIcon } from "lucide-react";

type SelectOption = {
	value: string;
	label: string;
	class_?: string;
	term?: string;
};

export default function DepartmentTimetable({branch}: {branch: string}) {
	const token = localStorage.getItem("access");
	const [lessons, setLessons] = useState<Lesson[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);
	const [days, setDays] = useState<Day[]>([]);
	const [timetables, setTables] = useState<TimeTable[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState("");
	const [terms, setTerms] = useState<SelectOption[]>([]);
	const [departments, setDepartments] = useState<SelectOption[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState("0");
	const [selectedTerm, setSelectedTerm] = useState("0");

	useEffect(() => {
		const fetchTimetables = async () => {
			try {
				const response = await axios.get(`/api/timetable/department/`, {
					headers: {
					Authorization: `Bearer ${token}`,
					},
					params: { department_id: selectedDepartment, branch_id: branch, term_id: selectedTerm },
				});
				setDays(response.data.days);
				setTables(response.data.timetable);
				setLessons(response.data.lessons);
				setClasses(response.data.classes);
			} catch (error) {
				console.error("Failed to fetch Timetable", error);
				setError("Failed to fetch timetable");
			} finally {
				setLoading(false);
			}
		};

		const fetchDepartments = async () => {
			try {
				const response = await axios.get("/api/departments/?all=true", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const formatted = response.data.results.map((cls: any) => ({
					value: cls.id.toString(),
					label: cls.name.toString(),
				}));
				setDepartments(formatted);
			} catch (error) {
				console.error("Failed to load departments", error);
			}
		};

		const fetchTerms = async () => {
			try {
				const response = await axios.get("/api/terms/?range=1", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const formatted = response.data.results.map((term: any) => ({
					value: term.id.toString(),
					label: term.termyear,
				}));
				setTerms(formatted);
			} catch (error) {
				console.error("Failed to load intakes", error);
			}
		};

		fetchDepartments();
		fetchTerms();
		fetchTimetables();
	}, [selectedDepartment, selectedTerm, branch]);

	const handleChangeTerm = async (selected_id: string) => {
		setSelectedTerm(selected_id);
	};

	const handleSelectDepartment = async (selected_id: string) => {
		setSelectedDepartment(selected_id);
	};

	const getEntry = (day: string, lesson: string, classID: number) => {
		return timetables.find(
			(e) =>
			e.day_name === day &&
			e.lesson_name === lesson &&
			e.Class === classID
		);
	};

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading timetable...</div>;
	}

	if (error) {
		return <div className="p-4 text-sm text-red-500">Error Loading timetable...{error}</div>;
	}

	return (
		<>
			{/* Header Actions */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="col-span-4 flex gap-4">
					<DictSearchableSelect
					items={terms}
					placeholder="Select Term..."
					onSelect={(val) => handleChangeTerm(val)}
					/>
					<DictSearchableSelect
					items={departments}
					placeholder="Select Department.."
					onSelect={(val) => handleSelectDepartment(val)}
					/>
				</div>

				<div className="">Timetable Report</div>

				<button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-blue-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-gray-200">
					<PrinterIcon size={18} /> Print Timetable
				</button>
			</div>

			<div className="overflow-auto border rounded-xl bg-white dark:bg-gray-800">
				<Table>
					<TableHeader className="bg-blue-800 text-white">
						<TableRow>
							<TableCell isHeader className="w-[120px] px-4 py-2">Day</TableCell>
							<TableCell isHeader className="w-[120px] px-4 py-2">Class</TableCell>
							{lessons.map((lesson) => (
								<TableCell key={lesson.id} isHeader className="px-4 py-2 text-center text-sm">
									{lesson.name}<br />
									<span className="text-xs">{lesson.start} - {lesson.end}</span>
								</TableCell>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{days.map((day) => (
							classes.map((cls, classIndex) => (
								<TableRow key={`${day.id}-${cls.id}`} className="border border-gray-500">
									{/* Only show Day cell once with rowSpan */}
									{classIndex === 0 && (
										<TableCell
											rowSpan={classes.length}
											className="bg-gray-100 dark:bg-transparent dark:text-white text-center text-sm font-semibold text-gray-700 px-4 py-2 align-middle"
										>
											{day.name}
										</TableCell>
									)}

									{/* Class Name */}
									<TableCell className="flex flex-col text-center font-medium text-sm text-gray-800 dark:text-gray-400 px-4 py-2">
										<span>{cls.name}</span>
										{ branch === "" && (
											<span className="bg-blue-800 text-white rounded-lg p-1">{cls.branch_name}</span>
										)}
									</TableCell>

									{/* Lesson cells */}
									{lessons.map((lesson) => {
										const entry = getEntry(day.name, lesson.name, cls.id);
										return (
											<TableCell className="px-4 py-2 text-xs text-center" key={lesson.id}>
												{entry ? (
													<>
													<div className="font-medium text-gray-800 dark:text-gray-300">{entry.unit_name}</div>
													<div className="text-gray-500">
														{entry.lecturer_fname} {entry.lecturer_mname}
													</div>
													<div className="text-gray-400">{entry.classroom_name}</div>
													</>
												) : (
													<span className="text-gray-300">—</span>
												)}
											</TableCell>
										);
									})}
								</TableRow>
							))
						))}
					</TableBody>

				</Table>
			</div>
		</>
	);
}
