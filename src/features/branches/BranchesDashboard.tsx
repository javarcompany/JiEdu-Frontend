import PageMeta from "../../components/common/PageMeta";
import BranchesTable from "./BranchesTable";
import BranchesActions from "./BranchesActions";
import { useState } from "react";

export default function BranchDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [save, setSave] = useState<boolean>(true);
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Branch Page"
                description="Branch Page for JiEdu Application showing branches of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-9">
                    <BranchesTable saveValue = {save} searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <BranchesActions onSave={setSave} onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}