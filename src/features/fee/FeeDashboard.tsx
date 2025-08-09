import { FileUpIcon, GaugeCircleIcon } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import ImageBannerBox from "../../components/ui/Banner";
import Transactions from "./Transactions";
import KPI from "./KPI";
import WalletCarousel from "./WalletCarousel";
import FeeReport from "./ReportAction";
import { useNavigate } from "react-router";
import { useState } from "react";
import { CreateInvoiceModal } from "./CreateInvoiceModal";

export default function FeeDashboard() {
    const navigate = useNavigate();
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
    
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
                        action1Label="Setup"
                        startIcon1={<GaugeCircleIcon />}
                        onAction1Click={() => navigate("/fee-setup/")}

                        action2Label="Add Invoice"
                        startIcon2={<FileUpIcon />}
                        onAction2Click={() => setOpenInvoiceModal(true)}
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

            <CreateInvoiceModal
                open={openInvoiceModal}
                onClose={() => setOpenInvoiceModal(false)}
            />
        </>
    );
}
