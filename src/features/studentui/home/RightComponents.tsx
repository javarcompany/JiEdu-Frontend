import CalendarWithToggle from "../../../components/ui/Calendar";
import { useUser } from "../../../context/AuthContext";
import UpcomingEvents from "../../events/CurrentEvents";

export default function RightComponents() {
    const {user} = useUser();
    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <CalendarWithToggle />
                </div>

                <div className="col-span-12">
                    <UpcomingEvents user_regno={user?.regno || ""} mode="small" reload={true} />
                </div>
            </div>
        </>
    );
}