import PageMeta from "../../components/common/PageMeta";
import AttendancePreview from "./AttendancePreview";
import AttendanceTopActions from "./TopActions";
import AttendanceSummary from "./Statistics";

export default function AttendanceDashboard() {
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Attendance Page"
                description="Attendance Page for JiEdu Application showing registers records of the institution"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9 ">
                    <div className="mb-4">
                        <AttendanceTopActions />
                    </div>
                    <AttendancePreview />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <AttendanceSummary />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}