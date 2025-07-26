import { useRef } from "react";
import TimetableBanner from "../timetable/dashboard/TimetableBanner"
import Actions from "./Action"
export default function AttendanceTopActions() {
    const refDiv = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="grid grid-cols-12 gap-2 md:col-span-12">
                <div ref={refDiv} className="col-span-12 xl:col-span-3">
                    <Actions />
                </div>
                <div className="col-span-12 xl:col-span-9">
                    <TimetableBanner
                        targetRef={refDiv}
                        backgroundImageUrl="/images/banners/attendance-theme.jpg"
                        title="Attendance Overview"
                        subtitle="Stay on top of all your scheduled lessons."
                        // actionLabel="Edit Timetable"
                        // onActionClick={() => console.log("Redirect to edit page")}
                    />
                </div>
            </div>
        </>
    )
}