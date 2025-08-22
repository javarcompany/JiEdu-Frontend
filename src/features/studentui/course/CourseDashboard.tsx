import CourseLeftComponents from "./LeftComponents";
import CourseRightComponents from "./RightComponents";
import PageMeta from "../../../components/common/PageMeta";
// import BottomComponents from "./BottomComponents";

export default function StudentCourseDashboard() {
    
    return (
        <>
            <PageMeta
                title="JiEdu Students | Course Page"
                description="Course Page for JiEdu Application showing student's course summary"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9">
                    <CourseLeftComponents />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <CourseRightComponents />
                </div>

                <div className="col-span-12">
                    {/* <BottomComponents /> */}
                </div>
            </div>           

        </>
    );
}