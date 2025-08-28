import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Calendar from "../../../pages/Calendar";
import UpcomingEvents from "../../events/CurrentEvents";
import { useUser } from "../../../context/AuthContext";

export default function StaffEventDashboard() {
    const {user} = useUser();
    const [reload, setReload] = useState(false);

    return (
        <>
            <PageMeta
                title="JiEdu Staff | Activity Page"
                description="Activities Page for JiEdu Application showing staff's event summary"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9">
                    <Calendar user_regno={user?.regno || ""} user_type="staff" setReload={setReload} />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <UpcomingEvents user_regno={user?.regno || ""} mode="large" reload={reload} />
                </div>

                <div className="col-span-12">
                    
                </div>
            </div>           

        </>
    );
}