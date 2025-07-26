import { useEffect, useRef, useState } from "react";
import BankCard from "../../components/BankCard";
import { Eye, EyeOff, Plus, Unlock } from "lucide-react";
import { CreditCard, FileText, Ban } from "lucide-react";
import axios from "axios";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import AddWallet from "./AddWallet";
import { formatCurrencyShort } from "../../utils/format";
import { useNavigate } from "react-router";
	
export interface Wallet{
	id: number,
    name: string,
    balance: string,
    cardHolder: string,
    cardNumber: string,
	account_number: string,
    expiry: string,
    wallet_type: string,
    logo: string,
    bgClass: string,
    blocked: boolean,
	latest_transaction: {
		amount: string;
		sender: string;
		date: string;
	} | null;
	total_transactions: string,
}	
	 
export default function WalletCarousel() {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentWallet = wallets[currentIndex];
	const [isPaused, setIsPaused] = useState(false);
	const [showSensitive, setShowSensitive] = useState(true);
    const token = localStorage.getItem("access");
	const [reload, setReload] = useState(false);

	const { isOpen, openModal, closeModal } = useModal();

	const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null);

	const navigate = useNavigate();
  
    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await axios.get(`/api/wallets/?all=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setWallets(response.data.results);
            } catch (error) {
                console.error("Failed to load wallets", error);
            }
        };

        fetchWallets();
    }, [reload]);

	const scrollToIndex = (index: number) => {
		const container = scrollRef.current;
		if (container) {
			const width = container.offsetWidth;
			container.scrollTo({
				left: index * width,
				behavior: "smooth",
			});
		}
	};

	const goNext = () => {
		const next = (currentIndex + 1) % wallets.length;
		setCurrentIndex(next);
		scrollToIndex(next);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (!isPaused) {
				goNext();
			}
		}, 8000);
		return () => clearInterval(interval);
	}, [currentIndex, isPaused]);

	const maskCardNumber = (cardNumber: string) =>
		showSensitive ? cardNumber : "•••• •••• •••• •" + cardNumber.slice(-4);

	const maskBalance = (balance: string) =>
		showSensitive ? balance : "   •••••";

	const onSubmit = () => {
		setReload(true);
		closeModal();
		setReload(false);
	}

	const handleClose = () => {
		setWalletToEdit(null);
		closeModal();
	};

	return (
		<>
			<div className="relative w-full group">
				{/* Top-right buttons */}
				<div className="flex justify-between items-center mb-2 px-2 py-4">
					<button
						onClick={openModal}
						className="text-sm text-blue-600 flex items-center gap-2 px-3 py-2 rounded-md bg-blue-800 hover:bg-gray-600 dark:bg-blue-700 dark:hover:bg-gray-600 text-sm text-white transition"
					>
						<Plus size={16} /> Add Card
					</button>

					<button
						onClick={() => setShowSensitive(!showSensitive)}
						className="text-gray-500 hover:text-black dark:hover:text-white transition"
					>
						{showSensitive ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>

				{/* Scrollable Area */}
				<div
					ref={scrollRef}
					className="w-full overflow-hidden scroll-smooth snap-x snap-mandatory flex transition-transform duration-500 ease-in-out"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					{wallets.map((wallet) => (
						<div key={wallet?.id} className="snap-center w-full flex-shrink-0">
							<div className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg w-full">
								<BankCard
									cardBalance={wallet.cardHolder}
									cardNumber={maskCardNumber(wallet.cardNumber)}
									expiry={wallet.expiry}
									bankName={wallet.name + " "+ wallet.wallet_type}
									backgroundColor = {wallet.bgClass}
									logoUrl={wallet.logo}
								/>

								<div className="mt-4 p-4 border-t pt-3 text-sm text-gray-600 dark:text-white space-y-1">
									<div>
										<span className="font-medium">Wallet:</span> {wallet.name + " "+ wallet.wallet_type}
									</div>
									<div>
										<span className="font-medium">Balance:</span>{" "}
										<span className="text-green-600 font-semibold">
											KES {maskBalance(formatCurrencyShort(wallet.balance))}
										</span>
									</div>
									<div>
										<span className="font-medium">Last Txn:</span>{" "}
										{wallet.latest_transaction
											? `KES ${formatCurrencyShort(wallet.latest_transaction.amount)} from ${wallet.latest_transaction.sender} on ${wallet.latest_transaction.date}`
											: "No Transactions"
										}
									</div>
									<div>
										<span className="font-medium">Total Txns:</span>{" "}
										{wallet.total_transactions}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Dot Indicators */}
				<div className="flex justify-center mt-3 space-x-1">
					{wallets.map((_, index) => (
						<button
							key={index}
							onClick={() => {
								setCurrentIndex(index);
								scrollToIndex(index);
							}}
							className={`transition-all rounded-full ${
								currentIndex === index
								? "bg-blue-600 w-8 h-1"
								: "bg-gray-400 w-2 h-1"
							}`}
						></button>
					))}
				</div>

				{/* Action Buttons */}
				{ wallets.length !== 0 ? (
					<div className="flex justify-around mt-6 px-4 pt-4">
						<button
							onClick={() => {
								setWalletToEdit(currentWallet);
								openModal();
							}}
							className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-600 transition"
						>
							<CreditCard size={24} />
							<span className="text-xs mt-1">Card Details</span>
						</button>

						<button
							onClick={() => {
								navigate(`/view-wallets?wallet=${currentWallet.id}`);
							}}
							className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-600 transition"
						>
							<FileText size={24} />
							<span className="text-xs mt-1">Statement</span>
						</button>

						<button
							onClick={async () => {
								const wallet = wallets[currentIndex];
								const newBlockedStatus = !wallet.blocked;

								// Optimistically update UI
								const updated = wallets.map((w, i) =>
								i === currentIndex ? { ...w, blocked: newBlockedStatus } : w
								);
								setWallets(updated);

								try {
								await axios.patch(
									`/api/wallets/${wallet.id}/`,
									{ blocked: newBlockedStatus },
									{
									headers: {
										Authorization: `Bearer ${token}`,
									},
									}
								);
								} catch (error) {
								// Revert UI on failure
								console.error("Failed to update block status:", error);
								const reverted = wallets.map((w, i) =>
									i === currentIndex ? { ...w, blocked: wallet.blocked } : w
								);
								setWallets(reverted);
								alert("Failed to update wallet block status. Please try again.");
								}
							}}
							className={`flex flex-col items-center transition ${
								currentWallet?.blocked
								? "text-yellow-600 hover:text-yellow-800"
								: "text-red-600 hover:text-red-800"
							}`}
							>
							{currentWallet?.blocked ? <Unlock size={24} /> : <Ban size={24} />}
							<span className="text-xs mt-1">
								{currentWallet?.blocked ? "Unblock Card" : "Block Card"}
							</span>
						</button>
					</div>
				): (
					<div className="flex"></div>
				)}

				{/* View All Cards Button */}
				<div className="mt-6 px-4">
					<button
						onClick={() => navigate("/view-wallets")}
						className="w-full h-10 flex items-center justify-center gap-2 py-2 rounded-md bg-blue-800 hover:bg-gray-600 dark:bg-blue-700 dark:hover:bg-gray-600 text-sm text-white transition"
					>
						<CreditCard size={18} />
						View All Cards
					</button>
				</div>

			</div>

			<Modal isOpen={isOpen} onClose={handleClose} className="m-4 sm:mt-10 max-w-[700px] max-h-screen mt-30 overflow-y-auto">
				<div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{walletToEdit ? "Edit Wallet" : "Add Wallet"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							{walletToEdit
								? "Modify the wallet details and save your changes"
								: "Expand the functionality and services offered in the institution"}
						</p>
					</div>

					<AddWallet onSubmit={onSubmit} walletToEdit={walletToEdit} />
				</div>
			</Modal>

		</>
	);
}
