import { ClickableCard } from "../../components/dashboard/ClickButton";
import { Calendar1Icon, StepBackIcon, CalendarDaysIcon, CalendarCheck2Icon } from "lucide-react";

export default function LeftActions() {

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-4">
            <div className="col-span-12 xl:col-span-12 py-0">
                <ClickableCard
                    title="Academic Years"
                    contextText=""
                    icon={<Calendar1Icon className="w-5 h-5" />}
                    href="/acyears"
                />
            </div>

            <div className="col-span-12 xl:col-span-12 py-0">
                <ClickableCard
                    title="Modules"
                    contextText = ""
                    icon = {<StepBackIcon className="w-8 h-8" />}
                    href = "/modules"
                />
            </div>
            
            <div className="col-span-12 xl:col-span-12 py-0">
                <ClickableCard
                    title="Intakes"
                    contextText = ""
                    icon = {<CalendarDaysIcon className="w-8 h-8" />}
                    href = "/intakes"
                />
            </div>

            <div className="col-span-12 xl:col-span-12 py-0">
                <ClickableCard
                    title="Intake Series"
                    contextText = ""
                    icon = {<CalendarCheck2Icon className="w-8 h-8" />}
                    href = "/intake-series"
                />
            </div>
        </div>
    );
}