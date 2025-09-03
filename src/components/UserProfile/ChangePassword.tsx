import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Lock, Eye, EyeOff } from "lucide-react";
import Input from "../form/input/InputField";

export default function PasswordChange() {
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(false);
    const [strength, setStrength] = useState<{ label: string; score: number }>({
        label: "",
        score: 0,
    });
    const [confirmError, setConfirmError] = useState("");
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === "new_password") {
            checkPasswordStrength(value);
            if (form.confirm_password && value !== form.confirm_password) {
                setConfirmError("Passwords do not match");
            } else {
                setConfirmError("");
            }
        }

        if (name === "confirm_password") {
            if (value !== form.new_password) {
                setConfirmError("Passwords do not match");
            } else {
                setConfirmError("");
            }
        }
    };

    const checkPasswordStrength = (password: string) => {
        let score = 0;

        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let label = "Weak";
        if (score === 2) label = "Weak";
        else if (score === 4) label = "Medium";
        else if (score === 5) label = "Strong";
        else if (score >= 6) label = "Very Strong";

        setStrength({ label, score });
    };

    const showToast = (icon: "success" | "error" | "info" | "warning", title: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon,
            title,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.current_password === "") {
            showToast("error", "Current password is required");
            return;
        }

        if (form.new_password !== form.confirm_password) {
            setConfirmError("Passwords do not match");
            showToast("error", "Passwords do not match");
            return;
        }

        if (form.new_password.length < 6) {
            setStrength({ label: "Weak", score: 1 });
            showToast("info", "New Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/change-password/", {
                    current_password: form.current_password,
                    new_password: form.new_password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            Swal.fire("Success", "Password updated successfully", "success");
            setForm({ current_password: "", new_password: "", confirm_password: "" });
            setStrength({ label: "", score: 0 });
            setConfirmError("");
        } catch (error: any) {
            Swal.fire(
                "Error",
                error.response?.data?.detail || "Failed to update password",
                "error"
            );
            setForm({ current_password: "", new_password: "", confirm_password: "" });
            setStrength({ label: "", score: 0 });
            setConfirmError("");
        } finally {
            setLoading(false);
        }
    };

    // Eye toggle handlers
    const handleMouseDown = (field: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: true }));
    };
    const handleMouseUp = (field: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <div className="mx-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-gray-200">
                Change Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    {/* Current password */}
                    <div className="relative">
                        <Input
                            type={showPassword.current ? "text" : "password"}
                            name="current_password"
                            placeholder="Current Password"
                            value={form.current_password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-500"
                            onMouseDown={() => handleMouseDown("current")}
                            onMouseUp={() => handleMouseUp("current")}
                            onMouseLeave={() => handleMouseUp("current")}
                        >
                            {showPassword.current ? <Eye size={18} /> : <EyeOff size={18} className="text-red-500"/>}
                        </button>
                    </div>

                    {/* New password */}
                    <div className="flex flex-col space-y-1 relative">
                        <div className="relative">
                            <Input
                                type={showPassword.new ? "text" : "password"}
                                name="new_password"
                                placeholder="New Password"
                                value={form.new_password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-500"
                                onMouseDown={() => handleMouseDown("new")}
                                onMouseUp={() => handleMouseUp("new")}
                                onMouseLeave={() => handleMouseUp("new")}
                            >
                                {showPassword.new ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        {/* Strength bar below input */}
                        {form.new_password && (
                            <div>
                            <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                className={`h-2 rounded ${
                                    strength.score <= 3
                                    ? "bg-red-500 w-1/4"
                                    : strength.score === 4
                                    ? "bg-yellow-500 w-2/4"
                                    : strength.score === 5
                                    ? "bg-green-500 w-3/4"
                                    : "bg-blue-600 w-full"
                                }`}
                                />
                            </div>
                            <p
                                className={`text-xs mt-1 ${
                                strength.score <= 3
                                    ? "text-red-500"
                                    : strength.score === 4
                                    ? "text-yellow-500"
                                    : strength.score === 5
                                    ? "text-green-500"
                                    : "text-blue-600"
                                }`}
                            >
                                {strength.label} password
                            </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div className="flex flex-col space-y-1 relative">
                        <div className="relative">
                            <Input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirm_password"
                                placeholder="Confirm Password"
                                value={form.confirm_password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-500"
                                onMouseDown={() => handleMouseDown("confirm")}
                                onMouseUp={() => handleMouseUp("confirm")}
                                onMouseLeave={() => handleMouseUp("confirm")}
                            >
                                {showPassword.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        {/* Error message below input */}
                        {confirmError && (
                            <p className="text-xs text-red-500 mt-1">{confirmError}</p>
                        )}
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex gap-2 flex-row w-full md:w-full justify-center items-center h-12 bg-brand-500 hover:bg-red-500 text-white rounded-lg font-medium transition"
                        >
                            <Lock size={16} />
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
