import PageMeta from "../../../../components/common/PageMeta";
import StaffTopActions from "./TopActions";
import StaffRightActions from "./RightActions";
import StaffMainBody from "./MainBody";
import StaffTimetable from "../../../timetable/report/StaffTimetable";

export default function StaffData() {
    return (
        <>
            <PageMeta
                title="JiEdu Staffs | Staff Form Page"
                description="Staffs Page for JiEdu Application showing staff's data in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <StaffTopActions />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <StaffMainBody />
                    <StaffTimetable />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <StaffRightActions />
                </div>
            </div> 
        </>
    );
}