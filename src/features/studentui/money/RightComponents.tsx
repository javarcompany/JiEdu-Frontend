import { useEffect, useState } from "react";
import TransactionLogs from "../../fee/reports/Logs";
import Receipts from "../../fee/reports/Reciepts";
import FeeStatement from "../../fee/reports/Statement";
import FeeStructure from "../../fee/reports/Structure";
import axios from "axios";
import { HandCoinsIcon } from "lucide-react";
import DictSearchableSelect from "../../../components/form/DictSelect";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import PayFee from "./PayFee";
import { useModal } from "../../../hooks/useModal";

type ActionsProps = {
    filters: { mode: string; student: string; term: string };
    setFilters: React.Dispatch<React.SetStateAction<{ mode: string; student: string; term: string }>>;
};

interface SelectionOption{
    value: string;
    label: string;
    image: string;
}

export default function RightComponents({ filters, setFilters, payment, setPayment }: ActionsProps & { payment: boolean, setPayment: React.Dispatch<React.SetStateAction<boolean>> }) {
    const token = localStorage.getItem("access");
    const [statement, setStatement] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [structure, setStructure] = useState([]);

    const { isOpen, openModal, closeModal } = useModal();
    
    const [terms, setTerms] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [modes] = useState<SelectionOption[]>([
        { label: "Fee Statement", value: "statement", image: ""},
        { label: "Fee Structure", value: "structure", image: "" },
        { label: "Transaction Log", value: "log", image: "" },
        { label: "Reciepts", value: "reciept", image: "" },
    ]);

    useEffect(() => {
        const fetchStatements = async () => {
            try {
                const res = await axios.get(`/api/statement/`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { student_regno: filters.student, term_id: filters.term },
                });
                setStatement(res.data.statement);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchLogs = async () => {
            try {
                const res = await axios.get(`/api/logs/`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { student_regno: filters.student, term_id: filters.term },
                });
                setTransactions(res.data.logs);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchReceipts = async () => {
            try {
                const res = await axios.get("/api/student-receipts/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { student_regno: filters.student, term_id: filters.term },
                });
                setReceipts(res.data.receipts);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchStructure = async () => {
            try {
                const res = await axios.get("/api/fee-structure/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { student_regno: filters.student, term_id: filters.term },
                });
                setStructure(res.data.structure);
            } catch (error) {
                console.error("Failed to fetch fee structure", error);
            }
        };

        fetchStatements();
        fetchLogs();
        fetchReceipts();
        fetchStructure();
    }, [filters, payment]);
    
    useEffect(() => {

        const fetchTerms = async () => {
			try {
				const response = await axios.get("/api/terms/?range=1", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const formatted = response.data.results.map((term: any) => ({
					value: term.id.toString(),
					label: term.termyear,
				}));
				setTerms(formatted);
			} catch (error) {
				console.error("Failed to load intakes", error);
			}
		};

		fetchTerms();

    }, []);

    const handleSelectMode = async (selected_id: string) => {
        const selectedOption = modes.find((m) => m.value === selected_id);
        setFilters({ ...filters, mode:selectedOption?.value || "" });
    };

    const onSubmit = () => {
        setPayment(!payment);
		closeModal();
	}
    
    return(
        <>
            {/* Top Actions */}
            <div className="mb-4 flex flex-row col-span-12 space-x-4 justify-start">
                {/* Term Select */}
                <div className="w-48">
                    <DictSearchableSelect
                        items={terms}
                        placeholder="Select Term..."
                        onSelect={(val) => {
                            setFilters({ ...filters, term: val });
                        }}
                    />
                </div>

                {/* Report Type Select */}
                <div className="w-48">
                    <Select
                        options={modes}
                        defaultValue="statement"
                        placeholder="Select Report Type.."
                        onChange={(val) => handleSelectMode(val)}
                        className="h-10 w-full"
                    />
                </div>

                {/* Pay Fee Button */}
                <button
                    onClick={openModal}
                    className="h-10 px-2 flex items-center gap-2 bg-red-600 text-white text-xs md:text-lg rounded-lg hover:bg-blue-700 transition"
                >
                    <HandCoinsIcon className="w-7 h-7" />
                    Pay Fee
                </button>
            </div>

            {filters.mode === "statement" && <FeeStatement statement={statement} />}
            {filters.mode === "structure" && <FeeStructure structure={structure} />}
            {filters.mode === "reciept" && <Receipts receipts={receipts} />}
            {filters.mode === "log" && <TransactionLogs transactions={transactions} />}
        
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Pay Fee
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    <PayFee onSubmit={onSubmit} />
                    
                </div>
            </Modal>

        </>
    );
}