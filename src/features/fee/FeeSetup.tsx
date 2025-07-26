import PageMeta from "../../components/common/PageMeta";
import PriorityLevels from "./PriorityLevels";
import PaymentMethods from "./PaymentMethods";
import PaymentAccounts from "./PaymentAccounts";
import FeeParticulars from "./FeeParticulars";

export default function FeeSetup(){
    
    return (
        <>
            <PageMeta
                title="JiEdu Fee Dashboard | Fee Setup Page"
                description="Fee Setup Page for JiEdu Application showing summary report of the system"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-4">
                    <PriorityLevels />
                    <PaymentMethods />
                    <PaymentAccounts />
                </div>
                
                <div className="col-span-12 xl:col-span-8 space-y-3">
                    <FeeParticulars />
                </div>

            </div>

        </>
    );
}