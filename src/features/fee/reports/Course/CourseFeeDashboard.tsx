import { useState } from "react";
import TopAction from "./TopActions";
import BottomAction from "./BottomActions";

export default function CourseFeeDashboard() {
    const [filters, setFilters] = useState({
        course_abbr: "",
        course: "",
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
