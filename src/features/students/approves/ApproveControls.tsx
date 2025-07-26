import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { FileCheckIcon, FileXIcon } from "lucide-react";
import { SearchButton } from "../../../components/dashboard/SearchButton";
import Swal from "sweetalert2";
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function ApproveActions({ onSearch, selectedIds, setSelectedIds, }: { onSearch: (value: string) => void; selectedIds: string[]; setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>; }) {
    const navigate = useNavigate();

    const handleBatchApprove = async () => {
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

            const token = localStorage.getItem("access");
            
            for (const id of selectedIds) {
                try {
                    const res = await axios.post(
                        `/api/approve-application/${id}/`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log(res.data);
                } catch (err) {
                    console.error(`Error approving ID ${id}:`, err);
                }
            }

            Swal.close();
            Swal.fire("Success", "Selected applications have been approved.", "success");

            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate("/")
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "Approval failed. Please try again.", "error");
            console.error(error);
        }
    };

    const handleBatchDecline = async () => {
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

            const token = localStorage.getItem("access");
            
            for (const id of selectedIds) {
                try {
                    const res = await axios.post(
                        `/api/decline-application/${id}/`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log(res.data);
                } catch (err) {
                    console.error(`Error declining ID ${id}:`, err);
                }
            }

            Swal.close();
            Swal.fire("Success", "Selected applications have been declined.", "success");

            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate("/")
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