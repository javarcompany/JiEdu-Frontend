import TablesPreview from "./SetupPreview";
import DaysPreview from "./Days";
import PageMeta from "../../../components/common/PageMeta";

export default function SetupDashboard() {
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Timetable Page"
                description="Timetable Page for JiEdu Application showing summary report of the system"
            />

            <div className="grid grid-cols-12 gap-2">
                
                <div className="col-span-12 xl:col-span-4">
                    <DaysPreview />
                </div>

                <div className="col-span-12 xl:col-span-8">
                    <TablesPreview />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}