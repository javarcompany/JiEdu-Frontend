import { useRef } from "react";
import Actions from "./Actions";
import TimetableBanner from "./TimetableBanner";


export default function TimetableTopActions() {
    const refDiv = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="grid grid-cols-12 gap-1 md:col-span-12">
                <div ref={refDiv} className="col-span-12 xl:col-span-3">
                    <Actions/>
                </div>
                <div className="col-span-12 xl:col-span-9">
                    <TimetableBanner targetRef={refDiv} backgroundImageUrl="" />
                </div>
            </div>
        </>
    )
}