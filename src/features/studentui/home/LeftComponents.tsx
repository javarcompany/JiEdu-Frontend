import ImageBannerBox from "../../../components/ui/Banner";
import { CalendarRangeIcon, HandCoinsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Student } from "../../students/registeredstudents/StudentTable";
import axios from "axios";
import StudentTrend from "./StudentTrend";
import CourseTrack from "./CourseTrack";

export default function LeftComponents() {
	const navigate = useNavigate();
    
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
                    <ImageBannerBox
                        height={200}
                        title={`Welcome ${student?.fname} ${student?.mname[0]}. ${student?.sname}`}
                        subtitle="Your all in one college management information system"
                        
                        action1Label="Pay Fee"
                        startIcon1={<HandCoinsIcon />}
                        onAction1Click={() => navigate("/pay-fee/")}

                        action2Label="Timetable"
                        startIcon2={<CalendarRangeIcon />}
                        onAction2Click={() => navigate("/course")}
                    />
                </div>
                <div className="col-span-12">
                    <StudentTrend student_regno={student?.regno} />
                </div>
                <div className="col-span-12 p-2 rounded-lg">
                    <CourseTrack student_regno={student?.regno} />
                </div>
            </div>
        </>
    )
}