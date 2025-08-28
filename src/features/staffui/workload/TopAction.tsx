import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import MarkRegister from "../dashboard/AttendanceModal";

export default function AdminButtons() {
    const [isVisible, setIsVisible] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
         
    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setIsVisible(true), 100);

        return () => clearTimeout(timer);

    }, []);

    const onSubmit = () => {
		closeModal();
	}
    
    return (
        <>
            <div className={`grid item-end grid-cols-4 gap-3 mb-4  transition-all duration-300 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
                <button
                    onClick={openModal}
                    className={`bg-purple-500 hover:bg-purple-900 flex flex-row items-center justify-center p-6 rounded-2xl shadow-md text-white font-semibold hover:scale-110 transition-all duration-200`}
                >
                    <FileText className="" />
                    <span className="text-md">Mark Attendance</span>
                </button>
            </div>

            <Modal isOpen={isOpen} onClose={onSubmit} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Mark Attendance
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    <MarkRegister onSubmit={onSubmit} />
                    
                </div>
            </Modal>
        </>
    );
}
