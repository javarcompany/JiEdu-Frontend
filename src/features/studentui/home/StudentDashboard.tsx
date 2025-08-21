import LeftComponents from "./LeftComponents";
import RightComponents from "./RightComponents";
import PageMeta from "../../../components/common/PageMeta";
import { useEffect } from "react";
import axios from "axios";
// import BottomComponents from "./BottomComponents";

export default function StudentHome() {
    const token = localStorage.getItem("access");

    useEffect(() => {
		const fetchStudent = async () => {
            try {
                const response = await axios.get("/api/search-student-primary/",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

			    localStorage.setItem("student_id", response.data.student_id);
			    localStorage.setItem("user_id", response.data.user_id);

            } catch (error) {
                console.error("Failed to fetch student:", error);
            }
        };

		fetchStudent();
    }, []);

    return (
        <>
            <PageMeta
                title="JiEdu Students | Home Page"
                description="Home Page for JiEdu Application showing student's summary"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9">
                    <LeftComponents />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <RightComponents />
                </div>

                <div className="col-span-12">
                    {/* <BottomComponents /> */}
                </div>
            </div>           

        </>
    );
}