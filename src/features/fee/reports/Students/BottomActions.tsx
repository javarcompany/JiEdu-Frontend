import { useEffect, useState } from "react";
import FeeStatement from "../Statement";
import TransactionLogs from "../Logs";
import Receipts from "../Reciepts";
import FeeStructure from "../Structure";
import StudentKPI from "../StudentFeeKPI";
import axios from "axios";

type ActionsProps = {
    filters: { mode: string; student: string; term: string };
    setFilters: React.Dispatch<React.SetStateAction<{ mode: string; student: string; term: string }>>;
};

export default function BottomAction({ filters }: ActionsProps) {
    const token = localStorage.getItem("access");
    const [statement, setStatement] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [structure, setStructure] = useState([]);

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
    }, [filters]);

    return (
        <>
            {(filters.mode === "statement" || filters.mode === "structure") && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Pane - Smaller */}
                    <div className="md:col-span-4">
                        <StudentKPI student={filters.student} term={filters.term} mode={filters.mode} />
                    </div>

                    {/* Right Pane - Larger */}
                    <div className="md:col-span-8">
                        {filters.mode === "statement" && (
                            <FeeStatement statement={statement} />
                        )}
                        {filters.mode === "structure" && (
                            <FeeStructure structure={structure} />
                        )}
                    </div>
                </div>
            )}

            {filters.mode === "reciept" && <Receipts receipts={receipts} />}
            {filters.mode === "log" && <TransactionLogs transactions={transactions} />}
        </>
    );
}
