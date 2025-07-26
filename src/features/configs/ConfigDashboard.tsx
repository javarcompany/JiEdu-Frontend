import PageMeta from "../../components/common/PageMeta";
import TopActions from "./TopActions";

import LeftActions from "./LeftActions";
import InstitutionCard from "./InstitutionCard";
import { useState } from "react";

export default function ConfigDashboard() {
    
    const [count, setCount] = useState<number>(1);

    const fetchInstitution = async () => {
        setCount(count+1);
    };
    
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Config Page"
                description="Config Page for JiEdu Application showing institution's information"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <TopActions onPromoteSuccess={fetchInstitution} />
                </div>
                
                <div className="col-span-12 xl:col-span-9">
                    <InstitutionCard data={count} />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <LeftActions />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">
                        
                    </div>
                </div>
            </div>           

        </>
    );
}