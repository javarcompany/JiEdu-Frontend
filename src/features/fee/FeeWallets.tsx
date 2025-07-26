import BankCard from "../../components/BankCard";

export default function FeeWallet() {
    return (
        <div className="grid grid-cols-12 gap-4 md:col-span-12">
            <div className="col-span-12">
                <BankCard
                    cardBalance="Kshs. 300K"
                    cardNumber="5667......123"
                    expiry="12/27"
                    bankName="M-Pesa"
                    backgroundColor="bg-gradient-to-r from-green-900 to-lime-700"
                    logoUrl="/images/brand/mpesa.png" // Optional custom logo
                />
            </div>
            <div className="col-span-12">
                <BankCard
                    cardBalance="Kshs. 1.5M"
                    cardNumber="4567......678"
                    expiry="12/27"
                    bankName="Equity Bank"
                    backgroundColor="bg-gradient-to-r from-red-700 to-white-500"
                    logoUrl="/images/brand/equity-bank-logo.png" // Optional custom logo
                />
            </div>
        </div>
    )
}