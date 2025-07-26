import BankCard from "../components/BankCard";

const Wallet = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <BankCard
            cardBalance="Jane Mwende"
            cardNumber="4567123412345678"
            expiry="12/27"
            bankName="M-Pesa Virtual"
            backgroundColor="bg-gradient-to-r from-green-500 to-lime-600"
            logoUrl="/images/mpesa-logo.png" // Optional custom logo
        />
    </div>
  );
};

export default Wallet;
