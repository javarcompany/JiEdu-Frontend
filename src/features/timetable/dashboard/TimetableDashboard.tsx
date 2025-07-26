import TimetableActions from "./TimetableActions";
import TimetableDepartment from "./TimetableReport";
import TimetablePreview from "./TablesPreview";
import PageMeta from "../../../components/common/PageMeta";
import TimetableTopActions from "./TimetableTopActions";

export default function Timetable() {
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Timetable Page"
                description="Timetable Page for JiEdu Application showing summary report of the system"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-12">
                    <TimetableTopActions />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <TimetableActions />
                    <TimetableDepartment />
                </div>

                <div className="col-span-12 xl:col-span-9">
                    <TimetablePreview />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}