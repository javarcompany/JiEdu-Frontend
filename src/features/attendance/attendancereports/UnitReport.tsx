import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useUser } from "../../../context/AuthContext";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import debounce from "lodash.debounce";

interface Student {
  id: number;
  fname: string;
  mname: string;
  sname: string;
  regno: string;
  passport: string | null;
  state: string;
}

const attendanceColors: { [key: string]: string } = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Late: "bg-yellow-100 text-yellow-800",
};

// Helper function to format current date for datetime-local
function getCurrentDateTimeLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000); // adjust to local timezone
  return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

export default function UnitRegister() {
    const { user } = useUser();
    const token = localStorage.getItem("access");
    const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [date, setDate] = useState<string>(getCurrentDateTimeLocal());
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const res = await axios.get("/api/lecturer-classes/", {
					headers: { Authorization: `Bearer ${token}` },
					params: { staff_regno: user?.regno },
				});
				setClasses(res.data); // expect [{id, name}, ...]
			} catch (err) {
				console.error("Failed to fetch classes", err);
			}
		};
		if (user?.user_type === "staff") {
			fetchClasses();
		}
	}, [user?.user_type, token]);

    const fetchAttendance = debounce(async (class_ = selectedClass, selectedDate = date) => {
		try {
            setLoading(true);
            const res = await axios.get(
                `/api/search-unit-attendance/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params : { selectedClass: class_, date: selectedDate, regno: user?.regno}
                },
                
            );
            setStudents(res.data);
        } catch (error: any) {
            console.error("Error fetching register:", error);
            Swal.fire("Error", error?.response?.data?.error, "error");
        } finally {
            setLoading(false);
        }
	}, 100);

    const handleSearch = async () => {
        if (!selectedClass) {
            Swal.fire("Error", "Please select class", "error");
            return;
        }

        fetchAttendance(selectedClass, date)
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Unit Register
            </h2>

            {/* Filters */}
            <div className="flex flex-row xl:flex-col gap-4 mb-6">
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800"
                >
                    <option value="">---Select Class---</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name}
                        </option>
                    ))}
                </select>

                <input
                    id="date"
                    type="datetime-local"
                    name="end_datetime"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />

                <button
                    onClick={handleSearch}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* Results */}
            <div className="sticky overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				
				<div className={`max-w-full overflow-x-auto max-h-[400px] overflow-y-auto no-scrollbar pb-6`}>
					<Table>
						{/* Table Header */}
						<TableHeader className="border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 border-y sticky top-0 z-10">
							<TableRow>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Student
								</TableCell>

								<TableCell
									isHeader
									className="py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
								>
									Status
								</TableCell>

							</TableRow>
						</TableHeader>

						<TableBody className="divide-y divide-gray-100 sticky dark:divide-gray-800 justify-between">
							{ loading ? (
                                <TableRow>
									<TableCell colSpan={2}>
                                        <div className="p-4 text-sm text-gray-500">Loading register...</div>
                                    </TableCell>
                                </TableRow>
                            ) :  students.length === 0 ? (
								<TableRow>
									<TableCell colSpan={2}>
										<div className="p-4 text-sm text-gray-500">No student found!...</div>
									</TableCell>
								</TableRow>
							) : (
								students.map((student) => (
									<TableRow key={student.id} className="justify-between">
										
										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<img
														width={40}
														height={40}
														src={
															student.passport?.trim()
															? student.passport.startsWith("http")
																? student.passport
																: `${student.passport}`
															: "/default-avatar.png"
														}
														alt={student.regno}
													/>
												</div>
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{student.fname} {student.mname} {student.sname}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{student.regno}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
											<span
                                                className={`px-2 py-1 text-xs rounded ${attendanceColors[student.state] || "bg-gray-100 text-gray-600"}`}
                                            >
                                                {student.state || "Not Marked"}
                                            </span>
										</TableCell>

									</TableRow>
								))
							)}
						</TableBody>
						
					</Table>
				</div>
			</div>
        </div>
    );
}
