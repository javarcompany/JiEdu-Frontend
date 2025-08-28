import PageMeta from "../../../components/common/PageMeta";
import LeftComponents from "./LeftComponents";
import RightComponents from "./RightComponents";

export default function StaffHome() {
    
    return (
        <>
            <PageMeta
                title="JiEdu Staff | Dashboard Page"
                description="Dashboard Page for JiEdu Application showing staff's summary"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9">
                    <LeftComponents />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <RightComponents />
                </div>

                <div className="col-span-12">
                    
                </div>
            </div>           

        </>
    );
}