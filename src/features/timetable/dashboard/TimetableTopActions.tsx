// import { useRef } from "react";
// import Actions from "./Actions";
import ImageBannerBox from "../../../components/ui/Banner";
import { CalendarRangeIcon } from "lucide-react";
import { useNavigate } from "react-router";


export default function TimetableTopActions() {
    // const refDiv = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                {/* <div ref={refDiv} className="col-span-12 xl:col-span-3">
                    <Actions/>
                </div> */}
                <div className="col-span-12">
                    <ImageBannerBox
                        height={150}
                        title="Timetable Dashboard"
                        subtitle="Welcome to the 2025 Timetable Management Portal"
                        backgroundImageUrl="/images/banners/timetable-theme.jpg"
                        action2Label="Timetable Reports"
                        startIcon2={<CalendarRangeIcon />}
                        onAction2Click={() => navigate("/timetable-report/")}
                    />
                </div>
            </div>
        </>
    )
}