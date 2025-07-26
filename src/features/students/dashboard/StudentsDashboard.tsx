import StudentChart from "./StudentChart";
import StudentActions from "./StudentActions";
import StudentDepartment from "./StudentDepartment";
import StudentPreview from "./StudentPreview";
import PageMeta from "../../../components/common/PageMeta";

export default function Student() {
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Student Page"
                description="Student Page for JiEdu Application showing summary report of the system"
            />
            
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-9">
                    <StudentActions />
                    <StudentPreview />
                </div>
                
                <div className="col-span-12 xl:col-span-3">
                    <StudentDepartment />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">
                        <StudentChart />
                    </div>
                </div>
            </div>           

        </>
    );
}