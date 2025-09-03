import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import DictSearchableSelect_Avatar from "../../components/form/DictAvatarSelect";
import Swal from "sweetalert2";

interface SelectionOption{
    value: string;
    label: string;
    image: string;
}

export default function FeePayment({ onSubmit }: { onSubmit: (value: boolean) => void }) {
    const token = localStorage.getItem("access");
    const [wallets, setWallets] = useState<SelectionOption[]>([]);

	const [students, setStudents] = useState<SelectionOption[]>([]);
    const [arrears, setArrears] = useState<number | null>(null);
    const [feeStatus, setFeeStatus] = useState<string | null>(null);

    const [selectedWallet, setSelectedWallet] = useState<SelectionOption>();
    const [selectedStudent, setSelectedStudent] = useState<SelectionOption>();
    const [amount, setAmount] = useState("");
    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`/api/students/?all=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const formatted = response.data.results.map((student: any) => ({
                    value: student.id.toString(),
                    label: student.fname + " " + student.mname[0] + "." + " " + student.sname + "-" + student.regno,
                    image: student.passport,
                }));
                setStudents(formatted);
                console.log(formatted);
            } catch (error) {
                console.error("Failed to load students", error);
            }
        };

        fetchStudents();

        const fetchWallets = async () => {
            try {
                const response = await axios.get(`/api/wallets/?all=active`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const formatted = response.data.results.map((wallet: any) => ({
                    value: wallet.id.toString(),
                    label: wallet.name +" "+ wallet.wallet_type + " •••••••••••" + wallet.account_number.slice(-4),
                    image: wallet.logo,
                }));
                setWallets(formatted);
            } catch (error) {
                console.error("Failed to load wallets", error);
            }
        };

        fetchWallets();
    }, []);

    const showToast = (icon: "success" | "error" | "info", message: string) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon,
            title: message,
        });
    };

    const pollUntilResolved = async (checkoutRequestID: string, retries = 10, interval = 5000) => {
        let attempts = 0;
        let polling = true;

        while (polling && attempts < retries) {
            try {
                const statusResponse = await axios.get(
                    "/api/payments/stk-status/",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { checkout_request_id: checkoutRequestID }
                    }
                );

                const statusResult = statusResponse.data;

                if (statusResult.status === "SUCCESS") {
                    showToast(
                        "success",
                        `KES ${statusResult.amount} received from ${statusResult.payer} (Txn: ${statusResult.transaction_id})`
                    );
                    onSubmit(true);
                    return;
                }

                if (statusResult.status === "FAILED") {
                    showToast("error",`Payment Failed: ${statusResult.message}`);
                    return;
                }

                attempts++;
                await new Promise((res) => setTimeout(res, interval));
            } catch (err) {
                showToast("error", "Failed to verify payment status.");
                return;
            }
        }
        showToast("info", " ⏳ Transaction still pending...");
    };

    const handleSubmit = async () => {
        if (!selectedWallet || !selectedStudent || !amount) {
            Swal.fire("Incomplete", "Please complete all fields.", "warning");
            return;
        }

        Swal.fire({
            title: "Processing Payment",
            text: `Initiating payment of KES ${amount}...`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const stkResponse = await axios.post(
                "/api/payments/mpesa-stk/",
                {
                    amount,
                    wallet_id: selectedWallet.value,
                    student_id: selectedStudent.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = stkResponse.data;

            if (!result.success) {
                Swal.fire("STK Push Failed", result.message || "Unknown error", "error");
                return;
            }

            // STK Push accepted, now wait a short delay before querying status
            const checkoutRequestID = result.checkout_id;
            
            // Show intermediate confirmation alert
            Swal.fire({
                icon: "info",
                title: "Awaiting M-Pesa Confirmation",
                text: "Please check your phone and enter your M-Pesa PIN.",
                confirmButtonText: "OK",
            }).then(() => {
                //Optional: Close modal here
                onSubmit(true);
                pollUntilResolved(checkoutRequestID);
            });

        } catch (error: any) {
            const errMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
            Swal.fire("STK Push Failed", errMessage, "error");
        }
    };

    return (
            <div className="max-w-full mx-auto space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DictSearchableSelect_Avatar 
                        items={wallets}
                        placeholder="Select Wallet.."
                        onSelect={(value) => {
                            const wallet = wallets.find((s) => s.value === value);
                            setSelectedWallet(wallet);
                        }}
                    />

                    <DictSearchableSelect_Avatar 
                        items={students}
                        placeholder="Select Student.."
                        onSelect={async (value) => {
                            const student = students.find((s) => s.value === value);
                            setSelectedStudent(student);

                            if (student) {
                                try {
                                    const response = await axios.get(`/api/feestatus/?student_id=${student.value}`, {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });

                                    if (response.data.results?.length > 0) {
                                        const latest = response.data.results[0];
                                        setArrears(Math.abs(latest.arrears)); // Remove sign
                                        setFeeStatus(latest.status);          // e.g., "Cleared", "Not-Cleared"
                                    } else {
                                        setArrears(null);
                                        setFeeStatus(null);
                                    }
                                } catch (error) {
                                    console.error("Failed to fetch fee status:", error);
                                    setArrears(null);
                                    setFeeStatus(null);
                                }
                            }
                        }}
                    />
                </div>

                <NumericFormat
                    className="
                        w-full rounded-lg border appearance-none px-4 py-2.5 text-md 
                       shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  
                       dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/50 z-999
                       hover:border-brand-300 hover:shadow-xl dark:hover:border-brand-500
                       bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 
                       focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  
                       dark:focus:border-brand-800
                    "
                    placeholder="Enter Amount"
                    value={amount}
                    thousandSeparator="," 
                    allowNegative={false}
                    prefix={amount ? "KES " : ""}
                    suffix={
                        feeStatus === "Not-Cleared" && arrears !== null
                            ? ` /${Number(arrears).toLocaleString()}`
                            : ""
                    }
                    onValueChange={(values) => setAmount(values.value)}
                />

                <Button className="w-full" onClick={handleSubmit}>
                    Send
                </Button>

            </div>
    );
}
