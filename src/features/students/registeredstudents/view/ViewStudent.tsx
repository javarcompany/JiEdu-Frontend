import PageMeta from "../../../../components/common/PageMeta";
import StudentTopActions from "./TopActions";
import StudentRightActions from "./RightActions";
import StudentMainBody from "./MainBody";
import ClassTimetable from "../../../timetable/report/ClassTimetable";
import { useParams } from "react-router";

export default function StudentData() {
    const { id } = useParams<{ id: string }>();
    return (
        <>
            <PageMeta
                title="JiEdu Students | Student Form Page"
                description="Students Page for JiEdu Application showing student's data in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <StudentTopActions />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <StudentMainBody />
                    <ClassTimetable student_regno={id}/>
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <StudentRightActions />
                </div>
            </div> 
        </>
    );
}