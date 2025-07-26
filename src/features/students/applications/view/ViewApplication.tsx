import PageMeta from "../../../../components/common/PageMeta";
import StudentTopActions from "./TopActions";
import StudentRightActions from "./RightActions";
import StudentMainBody from "./MainBody";

export default function StudentApplication() {
    return (
        <>
            <PageMeta
                title="JiEdu Students | Student Application Form Page"
                description="Students Page for JiEdu Application showing students' application in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <StudentTopActions />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <StudentMainBody />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <StudentRightActions />
                </div>
            </div> 
        </>
    );
}