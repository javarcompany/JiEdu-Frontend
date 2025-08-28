import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { CheckCircle2Icon, XCircleIcon, AlertTriangleIcon } from "lucide-react";

const getStateStyle = (state: string) => {
    switch (state) {
        case "Present":
            return { color: "text-green-600", Icon: CheckCircle2Icon };
        case "Late":
            return { color: "text-yellow-500", Icon: AlertTriangleIcon };
        case "Absent":
            return { color: "text-red-600", Icon: XCircleIcon };
        default:
            return { color: "text-gray-400", Icon: null };
    }
};

export interface StudentAttendance{
    id: number;
    fname: string;
    mname: string;
    sname: string;
    regno: string;
    passport: string;
    Class: string;
    class_name: string;
    state: string;
}

type AllocateActionsProps = {
    filters: { term: string; class_: string; mode: string; who: string; };
    status: { [key: string]: string };
    setStatus: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};

export default function MarkattendanceFR({ filters, setStatus }: AllocateActionsProps) {
    
    const { class_ } = filters;

    const token = localStorage.getItem("access");

    const [students, setStudents] = useState<StudentAttendance[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const fetchStudents = debounce(async (class_ = "all") => {
        try {
            const response = await axios.get(`/api/search-attendance/?class_id=${class_}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.error){
                Swal.fire("Error", response.data.error, "error")
            }

            const studentsWithState = (response.data as StudentAttendance[]).map((student) => ({
                ...student,
                state: student.state || "",
            }));

            // Pre-fill status
            const prefillStatus: { [key: string]: string } = {};
            
            studentsWithState.forEach((stud) => {
                if (stud.state) prefillStatus[stud.regno] = stud.state;
            });

            setStudents(studentsWithState);
            setStatus(prefillStatus);
            
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch Students", error);
            setLoading(false);
        }
    }, 100);

    useEffect(() => {
        if (!token) {return;}
                
        fetchStudents(class_);
    },[token, class_]);
    
    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading students...</div>;
    }

    if (students.length === 0) {
        return (
            <div className="p-4 text-sm text-gray-500">No students found for this class.</div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Class Layout - {students.length} Student(s)
                </h3>
            </div>

            {/* Teacher's Board */}
            <div className="mb-6 h-10 w-full rounded-md bg-blue-800 text-center text-sm font-semibold text-white leading-10">
                TEACHER'S BOARD
            </div>

            {/* Student Grid */}
            <div className={`grid gap-4 ${filters.who === "staff" ? "grid-cols-3 max-h-[350px] overflow-y-auto no-scrollbar" : "grid-cols-2 sm:grid-cols-4 md:grid-cols-6"}`}>
                {students.map((student) => {
                    const { color, Icon } = getStateStyle(student.state || "");
                    return (
                        <div
                            key={student.id}
                            className="group relative flex flex-col items-center justify-center rounded-xl border p-3 shadow-sm bg-white hover:shadow-md transition"
                        >
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Reg No: {student.regno} | Class: {student.class_name}
                            </div>

                            {/* Avatar */}
                            <img
                                src={student.passport || "/default-avatar.png"}
                                alt={student.regno}
                                className="mb-2 h-16 w-16 object-cover border rounded-full"
                            />

                            {/* Name */}
                            <div className="text-sm font-medium text-gray-700 text-center">
                                {student.fname} {student.sname}
                            </div>

                            {/* State */}
                            <div className={`text-xs mt-1 flex items-center gap-1 ${color}`}>
                                {Icon && <Icon className="w-4 h-4" />}
                                {student.state || "Unmarked"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
