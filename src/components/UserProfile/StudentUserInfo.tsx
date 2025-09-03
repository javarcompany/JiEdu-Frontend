import { useUser } from "../../context/AuthContext";
import PreviousExamsCard from "../../features/students/applications/view/StudentPreviousExams";
import StudentCourseCard from "./StudentCourseCard";

export default function StudentUserInfo() {
    const { user } = useUser();

    return (
        <>
            <div className="grid grid-cols-12 gap-2 mb-4 mx-4 shadow-md dark:border dark:border-brand-700 rounded-2xl p-6">
                {/* Course Section */}
                <div className="col-span-12 md:col-span-7">
                    <StudentCourseCard />
                </div>

                {/* Previous Exams */}
                <div className="col-span-12 md:col-span-5">
                    <PreviousExamsCard student_regno={user?.regno || ""} />
                </div>

            </div>
        </>
    );
}
