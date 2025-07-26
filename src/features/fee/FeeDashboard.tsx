import { GaugeCircleIcon } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import ImageBannerBox from "../../components/ui/Banner";
import Transactions from "./Transactions";
import KPI from "./KPI";
import WalletCarousel from "./WalletCarousel";
import FeeReport from "./ReportAction";
import { useNavigate } from "react-router";

export default function FeeDashboard() {
    const navigate = useNavigate();
    
    return (
        <>
            <PageMeta
                title="JiEdu Fee Dashboard | Fee Management Page"
                description="Fee Page for JiEdu Application showing summary report of the system"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-3">
                    <WalletCarousel />
                </div>
                
                <div className="col-span-12 xl:col-span-9 space-y-4">
                    
                    <ImageBannerBox
                        height={150}
                        title="Fee Dashboard"
                        subtitle="Welcome to the 2025 Fee Management Portal"
                        actionLabel="Setup"
                        startIcon={<GaugeCircleIcon />}
                        onActionClick={() => navigate("/fee-setup/")}
                    />
                    
                    <div className="grid grid-cols-12 gap-4">
                        
                        <div className="col-span-12 xl:col-span-9">
                            <Transactions />
                        </div>
                        
                        <div className="col-span-12 xl:col-span-3">
                            <FeeReport />
                            <KPI />                
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
