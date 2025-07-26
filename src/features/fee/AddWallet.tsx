import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DatePicker from "../../components/form/date-picker";
import axios from "axios";

interface FormDataState {
    name: string;
    payment_method: string;
    cardNumber: string;
    paybill: string;
    cardHolder: string;
    account_number: string;
    ccv: string;
    expiry: string;
    bgClass: string;
    logo: File | null;
}

interface AddWalletProps {
  onSubmit: (value: boolean) => void;
  walletToEdit?: any; // Ideally define the Wallet type
}

export default function AddWallet({ onSubmit, walletToEdit}: AddWalletProps) {
    const token = localStorage.getItem("access");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormDataState>({
        name: "", payment_method: "", cardNumber: "",
        paybill: "", cardHolder: "", account_number: "",
        ccv: "", expiry: "", bgClass: "", logo: null, // don't prefill logo (binary)
    });

    useEffect(() => {
        if (walletToEdit) {
            setFormData({
            name: walletToEdit.name || "",
            payment_method: walletToEdit.payment_method || "",
            cardNumber: walletToEdit.cardNumber || "",
            paybill: walletToEdit.paybill || "",
            cardHolder: walletToEdit.cardHolder || "",
            account_number: walletToEdit.account_number || "",
            ccv: walletToEdit.ccv || "",
            expiry: walletToEdit.expiry || "",
            bgClass: walletToEdit.bgClass || "",
            logo: null,
            });
        }
    }, [walletToEdit]);

    const [wallet_types, setWalletTypes] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    useEffect(() => {
        const fetchWalletTypes= async () => {
            axios.get('/api/paymentmethods/?all=true/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                const formatted = response.data.results.map((wallet: any) => ({
                    value: wallet.id.toString(),
                    label: wallet.name 
                }));
                setWalletTypes(formatted);
            })
            .catch(error => {
                console.error("Error fetching payment methods:", error);
            });
        };

        fetchWalletTypes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (option: any, field: string) => {
        if (!option) return; // handle deselection
        const value = typeof option === 'string' ? option : option?.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
      
    const handleDateChange = (date: string | null, name:string) => {
        const formattedDate = date;
        setFormData((prev) => ({ ...prev, [name]: formattedDate }));
    };  

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name:string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, [name]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        Swal.fire({ title: "Processing...", text: "Please wait...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        setSubmitting(true);

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) form.append(key, value, value.name);
            else if (value !== null) form.append(key, value);
        });

        try {
            const url = walletToEdit ? `/api/wallets/${walletToEdit.id}/` : "/api/wallets/";
            const method = walletToEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                body: form,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.close();

            if (res.ok) {
                Swal.fire("Success", walletToEdit ? "Wallet updated!" : "Wallet added!", "success");
                onSubmit(true);
            } else {
                const errorData = await res.json();
                Swal.fire("Error", errorData.detail || "Submission Failed!", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Network error", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
            <div className="max-w-full mx-auto space-y-4 p-4">
                <form className="flex flex-col" onSubmit={handleSubmit} >
                    <div className="px-2 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Name</Label>
                                <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Type</Label>
                                <Select
                                    options={wallet_types}
                                    placeholder = "Select Wallet Type"
                                    onChange={(type) => handleSelectChange(type, "payment_method")}
                                />
                            </div>

                            <div>
                                <Label>Logo</Label>
                                <FileInput onChange={(e) => handleFileChange(e, "logo")} />
                            </div>

                            <div>
                                <Label>Paybill</Label>
                                <Input type="number" name="paybill" onChange={handleChange} value={formData.paybill} />
                            </div>

                            <div>
                                <Label>Card Number</Label>
                                <Input type="number" name="cardNumber" onChange={handleChange} value={formData.cardNumber} />
                            </div>

                            <div>
                                <Label>Card Holder</Label>
                                <Input type="text" name="cardHolder" value={formData.cardHolder} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Account Number</Label>
                                <Input type="number" name="account_number" onChange={handleChange} value={formData.account_number} />
                            </div>

                            <div>
                                <Label>CCV</Label>
                                <Input type="number" name="ccv" onChange={handleChange} value={formData.ccv} />
                            </div>

                            <div>
                                <DatePicker
                                    id="id_expiry"
                                    label="Expiry Date"
                                    placeholder="Select Date of Expiry"
                                    onChange={(date, currentDateString) => {
                                        handleDateChange(currentDateString, "expiry")
                                        console.log({ date, currentDateString });
                                    }}
                                />
                            </div>

                            <div>
                                <Label>Card Color</Label>
                                <Input type="text" name="bgClass" value={formData.bgClass} onChange={handleChange} />
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <button
                            disabled={submitting}
                            type="submit"
                            className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            {submitting
                                ? "Submitting..."
                                : walletToEdit
                                ? "Update Wallet"
                                : "Save Wallet"
                            }
                        </button>
                    </div>
                </form>
            </div>
    );
}
