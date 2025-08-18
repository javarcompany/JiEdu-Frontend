import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { FileCheckIcon, FileXIcon } from "lucide-react";
import { SearchButton } from "../../../components/dashboard/SearchButton";
import Swal from "sweetalert2";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ApproveActions({ onSearch, selectedIds, setSelectedIds, }: { onSearch: (value: string) => void; selectedIds: number[]; setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>; }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("access");

    const handleBatchApprove = async () => {
        if (!token) {
            Swal.fire("Error", "Authentication token is missing. Please log in again.", "error");
            return;
        }

        if (selectedIds.length === 0) {
            Swal.fire("No selection", "Please select applications to approve.", "info");
            return;
        }

        try {
            Swal.fire({
                title: "Approving Applications...",
                text: "Please wait while Approving the applications...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await axios.post(
				`/api/application/approve-batch-applications/`,
				{ application_ids: selectedIds },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

            const responseData = res.data;
            responseData.forEach((msg: any, index: number) => {
                setTimeout(() => {
                    if (msg.message) {
                        toast.success(msg.message, { autoClose: 2000 });
                    } else if (msg.error) {
                        toast.error(msg.error, { autoClose: 2000 });
                    }
                }, index * 2100); // stagger each toast by 2.1 seconds
            });

            Swal.close();

            // Swal.fire("Success", "Selected applications have been approved.", "success");

            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate(-1)
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "Approval failed. Please try again.", "error");
            console.error(error);
        }
    };

    const handleBatchDecline = async () => {
        if (!token) {
            Swal.fire("Error", "Authentication token is missing. Please log in again.", "error");
            return;
        }

        if (selectedIds.length === 0) {
            Swal.fire("No selection", "Please select applications to decline.", "info");
            return;
        }

        try {
            Swal.fire({
                title: "Declining Applications...",
                text: "Please wait while Declining the applications...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await axios.post(
				`/api/application/decline-batch-applications/`,
				{ application_ids: selectedIds },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

            const responseData = res.data;
            responseData.forEach((msg: any, index: number) => {
                setTimeout(() => {
                    if (msg.message) {
                        toast.success(msg.message, { autoClose: 2000 });
                    } else if (msg.error) {
                        toast.error(msg.error, { autoClose: 2000 });
                    }
                }, index * 2100); // stagger each toast by 2.1 seconds
            });

            Swal.close();
            // Swal.fire("Success", "Selected applications have been declined.", "success");

            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate(-1)
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "Declining failed. Please try again.", "error");
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 md:col-span-12">
            <div className="col-span-12">
                <SearchButton onSearch={onSearch} />
            </div>

            <div className="col-span-12">
                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-col gap-4 md:gap-6">
                    <div className="w-full">
                        <ClickableStatCard
                            title="Approve"
                            value=""
                            percentageChange="Approve"
                            contextText="selected application(s)"
                            classvalue="bg-green-800 dark:text-white-900 text-white"
                            icon={<FileCheckIcon className="w-5 h-5" />}
                            href=""
                            onClick={handleBatchApprove}
                        />
                    </div>

                    <div className="w-full">
                        <ClickableStatCard
                            title="Decline"
                            value=""
                            percentageChange="Decline"
                            contextText="selected application(s)"
                            classvalue="bg-red-900 dark:text-white-900 text-white"
                            icon={<FileXIcon className="w-5 h-5" />}
                            href=""
                            onClick={handleBatchDecline}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}