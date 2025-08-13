import PageMeta from "../../components/common/PageMeta";
import ClassesTable from "./ClassesTable";
import ClassesActions from "./ClassesActions";

import { useState } from "react";

export default function ClassesDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [save, setSave] = useState<boolean>(true);
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Classes Page"
                description="Classes Page for JiEdu Application showing classes of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-9">
                    <ClassesTable saveValue = {save}  searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <ClassesActions  onSave={setSave} onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}