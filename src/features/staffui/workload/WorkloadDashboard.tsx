import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import TutorTimetable from "./TutorTimetable";
import TopAction from "./TopAction";
import { useUser } from "../../../context/AuthContext";

export default function StaffWorkloadDashboard() {
    const {user} = useUser();
    const [reload, setReload] = useState(false);

    return (
        <>
            <PageMeta
                title="JiEdu Staff | Workload Page"
                description="Workload Page for JiEdu Application showing staff's workload summary"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9">
                    <TopAction />
                    <TutorTimetable staff_regno={user?.regno || ""} />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    
                </div>

                <div className="col-span-12">
                    
                </div>
            </div>           

        </>
    );
}