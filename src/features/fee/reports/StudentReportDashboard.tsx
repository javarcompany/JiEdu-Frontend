import { useState } from "react";
import TopAction from "./Students/TopActions";
import BottomAction from "./Students/BottomActions";

export default function StudentReportDashboard() {
    const [filters, setFilters] = useState({
        mode: "statement",
        student: "",
        term: ""
    });

    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    {/* Top Actions */}
                    <TopAction 
                        filters={filters}
                        setFilters={setFilters}
                    />
                    
                    {/* Bottom Action - Left Graphical Representation  |  Right Textual representations */}
                    <BottomAction
                        filters = {filters}
                        setFilters = {setFilters}
                    />

                </div>
            </div> 
        </>
    );
}
