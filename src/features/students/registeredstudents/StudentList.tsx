import axios from "axios";
import PageMeta from "../../../components/common/PageMeta";
import StudentListActions from "./StudentListActions";
import StudentTable from "./StudentTable";
import { useEffect, useState } from "react";

export default function StudentList() {
	const token = localStorage.getItem("access");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    
    const [promotionMode, setPromotionMode] = useState(false);

    const [reloadFlag, setReloadFlag] = useState(0);

    useEffect(() => {
        const fetchPromotionMode = async () => {
            try {
                const res = await axios.get("/api/promote/institution-promotion-status/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPromotionMode(res.data.promotion_mode);
            } catch (err) {
                console.error("Failed to fetch promotion mode", err);
            }
        };

        fetchPromotionMode();
    }, [token, reloadFlag]);
    
    return (
        <>
            <PageMeta
                title="JiEdu Students | Student List Page"
                description="Students Page for JiEdu Application showing list of students in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <StudentListActions
                            setReloadFlag={setReloadFlag}
                            onSearch={setSearchTerm} 
                            selectedStudentIds={selectedStudentIds} 
                            setSelectedStudentIds={setSelectedStudentIds} 
                            promotionMode={promotionMode} 
                    />

                    <StudentTable
                            reloadFlag={reloadFlag}
                            searchTerm={searchTerm}
                            selectedStudentIds={selectedStudentIds}
                            setSelectedStudentIds={setSelectedStudentIds}
                            promotionMode={promotionMode}
                    />
                </div>
            </div> 
        </>
    );
}