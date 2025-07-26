import { useEffect, useState } from "react";
import axios from "../../lib/axois"; // Axios instance with interceptors
import clsx from "clsx";
import { formatDateTime } from "../../utils/format";
import { Wallet } from "./WalletCarousel";
import { Reciepts } from "./Transactions";
import PageMeta from "../../components/common/PageMeta";
import { useSearchParams } from "react-router-dom";

export default function WalletViewer() {
    const token = localStorage.getItem("access");
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
	const [transactions, setTransactions] = useState<Reciepts[]>([]);
	const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const initialWalletId = searchParams.get("wallet");

    useEffect(() => {
        if (wallets.length > 0) {
            if (initialWalletId) {
                const walletIdNum = parseInt(initialWalletId);
                if (wallets.some(w => w.id === walletIdNum)) {
                    setSelectedWalletId(walletIdNum);
                } else {
                    setSelectedWalletId(wallets[0].id); // fallback
                }
            } else {
                setSelectedWalletId(wallets[0].id);
            }
        }
    }, [wallets, initialWalletId]);

	// Fetch wallets on mount
	useEffect(() => {
		const fetchWallets = async () => {
			try {
				const response = await axios.get("/api/wallets/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
				setWallets(response.data.results);
				if (response.data.length > 0) {
					setSelectedWalletId(response.data[0].id); // auto-select first wallet
				}
			} catch (err) {
				console.error("Failed to fetch wallets", err);
			}
		};

		fetchWallets();
	}, []);

	// Fetch transactions when selectedWalletId changes
	useEffect(() => {
		const fetchTransactions = async () => {
			if (!selectedWalletId) return;
			setLoading(true);
			try {
				const response = await axios.get(`/api/fetch-reciepts/`,
                    {
                        headers: { Authorization: `Bearer ${token}`, },
                        params: {wallet_id: selectedWalletId},
                    }
                );
                console.log(response)
				setTransactions(response.data);
			} catch (err) {
				console.error("Failed to fetch transactions", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [selectedWalletId]);

    const totalBalance = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

	return (
        <>
            <PageMeta
                title="JiEdu Fee Dashboard | Wallet Statements"
                description="Fee Page for JiEdu Application showing summary report of the system"
            />

            <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* Wallet List (Left) */}
                <div className="md:w-1/4 w-full space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Wallets</h3>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        {wallets.map((wallet) => (
                            <button
                                key={wallet.id}
                                className={clsx(
                                    "w-full text-left px-4 py-3 hover:bg-blue-100 dark:hover:bg-gray-700",
                                    wallet.id === selectedWalletId && "bg-blue-800 font-semibold text-white"
                                )}
                                onClick={() => setSelectedWalletId(wallet.id)}
                            >
                                <div className="">{wallet.name}</div>
                                <div className="text-sm">
                                    {wallet.cardNumber}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Wallet Statement (Right) */}
                <div className="md:w-3/4 w-full space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {wallets.find((w) => w.id === selectedWalletId)?.name || "Wallet"} Statement
                    </h3>

                    <div className="text-md text-gray-700 text-end uppercase dark:text-gray-300">
                        Current Balance:{" "}
                        <span className="font-bold text-green-600 dark:text-green-400">
                            Ksh. {totalBalance.toLocaleString()}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-blue-800 text-white uppercase tracking-wide text-xs">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Payer</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Paid In</th>
                                    <th className="px-4 py-2">Paid Out</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 dark:text-gray-300">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center">
                                            No transactions found.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="border-t border-gray-100 dark:border-gray-800">
                                            <td className="px-4 py-4">{formatDateTime(tx.dop)}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Profile Picture */}
                                                    <img
                                                        src={tx.passport || "/images/default-avatar.png"} // fallback if null
                                                        alt={`${tx.fname} ${tx.sname}`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />

                                                    {/* Name & RegNo */}
                                                    <div>
                                                        <div className="font-medium">{tx.fname} {tx.sname}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{tx.regno}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 uppercase break-all max-w-xs">{tx.trans_id}</td>
                                            <td className="px-4 py-4">Ksh. {tx.amount}</td>
                                            <td className="px-4 py-4">-</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
	);
}
