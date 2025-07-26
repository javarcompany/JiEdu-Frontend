import { useState } from "react";

type Receipt = {
    id: string;
    trans_id: string;
    created_at: string;
    amount: string;
    transactions: {
        account: string;
        amount: string;
        running_balance: string;
    }[];
};

type ReceiptsProps = {
    receipts: Receipt[];
};

export default function Receipts({ receipts }: ReceiptsProps) {
    const [selected, setSelected] = useState<number | null>(null);

    const selectedReceipt = selected !== null ? receipts[selected] : null;

    return (
        <div className="flex rounded shadow-md overflow-hidden">
            {/* Left Pane - List of receipts */}
            <div className="w-1/3 border-r overflow-y-auto">
                {receipts.map((r, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={`p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 ${
                            selected === idx ? "bg-blue-100 dark:bg-gray-800" : ""
                        }`}
                    >
                        <div className="font-medium text-sm text-gray-700 dark:text-white">
                            Receipt #{r.id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                            {r.created_at}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Pane - Receipt Details */}
            <div className="w-2/3 p-6 overflow-y-auto">
                {selectedReceipt ? (
                    <>
                        <div className="mb-4 text-end">
                            <h3 className="text-lg text-wrap font-bold dark:text-white">{selectedReceipt.trans_id}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Date: {selectedReceipt.created_at}
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                                Total Paid: KES {selectedReceipt.amount}
                            </p>
                        </div>

                        <table className="w-full text-center border-t border-gray-200 dark:border-gray-700">
                            <thead className="text-xs text-gray-600 dark:text-gray-300 uppercase">
                                <tr>
                                    <th className="py-2">Votehead</th>
                                    <th className="py-2 text-end">Amount (KES)</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 dark:text-white divide-y divide-gray-100 dark:divide-gray-800">
                                {selectedReceipt.transactions.map((txn, idx) => (
                                    <tr key={idx}>
                                        <td className="py-2">{txn.account}</td>
                                        <td className="py-2 text-end">KES {txn.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">Select a receipt to view details</p>
                )}
            </div>
        </div>
    );
}
