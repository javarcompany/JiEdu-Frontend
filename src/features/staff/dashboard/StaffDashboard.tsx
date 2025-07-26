import StaffActions from "./StaffActions";
import StaffDepartment from "./StaffDepartment";
import StaffPreview from "./StaffPreview";
import PageMeta from "../../../components/common/PageMeta";
import ImageBannerBox from "../../../components/ui/Banner";

export default function Staff() {
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Staff Page"
                description="Staff Page for JiEdu Application showing summary report of the system"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-3">
                    <StaffActions />
                    <StaffDepartment />
                </div>

                <div className="col-span-12 xl:col-span-9">
                    <ImageBannerBox
                        height={150}
                        title="Staff Dashboard"
                        subtitle="Welcome to the 2025 Academic Portal"
                        actionLabel="Register Staff"
                    />
                    <StaffPreview />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">
                        
                    </div>
                </div>
            </div>           

        </>
    );
}