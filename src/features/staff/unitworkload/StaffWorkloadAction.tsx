import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import StaffWorkloadCount from "./StaffWorkloadCount";
import { BoxIcon } from "../../../icons";
import { SearchButton } from "../../../components/dashboard/SearchButton";
import { useEffect, useState } from "react";
import axios from "axios";

function formatCount(count: number) {
	if (count >= 10000) {
		return `${Math.round(count / 1000)}K`;
	}
	return count.toLocaleString();
}

export default function StaffWorkloadAction({ onSearch }: { onSearch: (value: string) => void }) {
    const [unit_count, setUnitCount] = useState(0);

    const token = localStorage.getItem("access");
    useEffect(() => {
		const fetchUnitCount = async () => {
			try {
				const response = await axios.get("/api/unit_count/",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setUnitCount(response.data.count);
			} catch (error) {
				console.error("Failed to fetch student count:", error);
			}
		};

		fetchUnitCount();
	}, []);

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12">
                <SearchButton onSearch={onSearch}/>
            </div>
            
            <div className="col-span-12">
                <ClickableStatCard
                    title="Assign Workload"
                    value={formatCount(unit_count)}
                    percentageChange="Units"
                    contextText="registered"
                    classvalue="bg-green-900 dark:text-white-900 text-white"
                    icon={<BoxIcon className="w-5 h-5" />}
                    href="/assign-workload"
                />
            </div>

            <div className="col-span-12">
                <StaffWorkloadCount />
            </div>

        </div>
    )
}