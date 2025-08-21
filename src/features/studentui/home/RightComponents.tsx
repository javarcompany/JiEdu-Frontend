import { useEffect, useState } from "react";
import CalendarWithToggle from "../../../components/ui/Calendar";
import UpcomingEvents from "./CurrentEvents";
import axios from "axios";
import { Student } from "../../students/registeredstudents/StudentTable";

export default function RightComponents() {
    const token = localStorage.getItem("access");
    const student_id = localStorage.getItem("student_id");
    const [student, setStudent] = useState<Student>();

    useEffect(() => {
		const fetchStudent = async () => {
            try {
                const response = await axios.get(`/api/students/${student_id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setStudent(response.data);

            } catch (error) {
                console.error("Failed to fetch student:", error);
            }
        };

		fetchStudent();
    }, [student_id]);
    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <CalendarWithToggle />
                </div>

                <div className="col-span-12">
                    <UpcomingEvents student_regno={student?.regno} />
                </div>
            </div>
        </>
    );
}