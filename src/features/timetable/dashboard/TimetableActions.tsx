import { CogIcon } from "lucide-react";
import { ClickableStatCard } from "../../../components/dashboard/StartCard";

export default function TimetableActions() {
    return (
        <div className="grid grid-cols-12 gap-4 md:col-span-12">
            <div className="col-span-12">
                <ClickableStatCard
                    title="Setup"
                    value="Days"
                    percentageChange="&"
                    contextText="Time (Lessons)"
                    classvalue="bg-green-900 dark:text-white-900 text-white"
                    icon={<CogIcon className="w-5 h-5" />}
                    href="/table-setup"
                />
            </div>
            <div className="col-span-12">
                
            </div>
        </div>
    )
}