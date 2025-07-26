import PageMeta from "../../components/common/PageMeta";
import CameraTable from "./CameraTable";
import CameraActions from "./CameraActions";

import { useState } from "react";

export default function CameraDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Camera Page"
                description="Camera Page for JiEdu Application showing Camera of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-9">
                    <CameraTable searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <CameraActions onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}