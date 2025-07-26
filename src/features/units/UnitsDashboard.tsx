import PageMeta from "../../components/common/PageMeta";
import UnitsTable from "./UnitsTable";
import UnitsActions from "./UnitsActions";

import { useState } from "react";

export default function UnitsDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [save, setSave] = useState<boolean>(true);
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Units Page"
                description="Units Page for JiEdu Application showing units of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-3">
                    <UnitsActions onSave={setSave} onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-9">
                    <UnitsTable saveValue = {save} searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}