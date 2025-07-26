import React from "react";

interface BankCardProps {
	cardBalance: string;
	cardNumber: string;
	expiry: string;
	bankName?: string;
	backgroundColor?: string;
	logoUrl?: string;
}

const BankCard: React.FC<BankCardProps> = ({
	cardBalance,
	cardNumber,
	expiry,
	bankName = "Equity Bank",
	backgroundColor = "bg-gradient-to-r from-purple-600 to-indigo-700",
	logoUrl = "/images/visa-logo.png", // Optional: Replace with your local logo
}) => {
	
	const isValidTailwindGradient = (cls: string) =>
		cls.includes("bg-gradient-to") && cls.includes("from-") && cls.includes("to-");

	const appliedBgClass = isValidTailwindGradient(backgroundColor)
		? backgroundColor
		: "bg-gradient-to-r from-purple-600 to-indigo-700";

	return (
		<div
			className={`w-full max-w-full aspect-[16/9] text-white bg-blue-800 rounded-xl p-3 relative overflow-hidden shadow-lg ${appliedBgClass}`}
		>
			<div className="absolute top-3 right-3">
				<img src={logoUrl} alt="Card Logo" className="w-12 h-auto" />
			</div>

			<div className="text-md font-semibold mb-4">{bankName}</div>

			<div className="text-xl tracking-widest font-mono mb-4">
				{cardBalance}
			</div>

			<div className="flex justify-between items-center text-sm">
				<div>
					<div className="text-xs uppercase text-gray-200">Card Number</div>
					<div className="">{cardNumber.replace(/(.{4})/g, "$1 ")}</div>
				</div>
				<div>
					<div className="text-xs uppercase text-gray-200">Expires</div>
					<div className="">{expiry}</div>
				</div>
			</div>

		</div>
	);
};

export default BankCard;
