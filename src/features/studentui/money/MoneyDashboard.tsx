import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import LeftComponents from "./LeftComponents";
import TopComponents from "./TopActions";
import RightComponents from "./RightComponents";
import { useUser } from "../../../context/AuthContext";

export default function StudentFeeDashboard() {
    const { user } = useUser();

    const [filters, setFilters] = useState({
        mode: "statement",
        student: user?.regno || "",
        term: ""
    });

    const [payment, setPayment] = useState(false);

    return (
        <>
            <PageMeta
                title="JiEdu Students | Fee Page"
                description="Fee Page for JiEdu Application showing student's fee summary"
            />

            {/* Top - full width */}
            <div className="mb-4">
                <TopComponents payment={payment} />
            </div>

            {/* Main content with 2 columns */}
            <div className="grid grid-cols-12 gap-4">

                {/* Right Side */}
                <div className="lg:col-span-8 col-span-12">
                    <RightComponents filters={filters} setFilters={setFilters} payment={payment} setPayment={setPayment} />
                </div>
                
                {/* Left Side */}
                <div className="lg:col-span-4 col-span-12">
                    <LeftComponents filters={filters} />
                </div>
            </div>

        </>
    );
}