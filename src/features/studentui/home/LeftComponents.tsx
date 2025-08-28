import ImageBannerBox from "../../../components/ui/Banner";
import { CalendarRangeIcon, HandCoinsIcon } from "lucide-react";
import { useNavigate } from "react-router";
import StudentTrend from "./StudentTrend";
import CourseTrack from "./CourseTrack";
import { Modal } from "../../../components/ui/modal";
import PayFee from "../money/PayFee";
import { useModal } from "../../../hooks/useModal";
import { useUser } from "../../../context/AuthContext";

export default function LeftComponents() {
	const navigate = useNavigate();
    const {user} = useUser();
    
    const { isOpen, openModal, closeModal } = useModal();

    const onSubmit = () => {
		closeModal();
	}

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <ImageBannerBox
                        height={200}
                        title={`Welcome ${user?.first_name} ${user?.last_name}`}
                        subtitle="Your all in one college management information system"
                        
                        action1Label="Pay Fee"
                        startIcon1={<HandCoinsIcon />}
                        onAction1Click={openModal}

                        action2Label="Timetable"
                        startIcon2={<CalendarRangeIcon />}
                        onAction2Click={() => navigate("/course")}
                    />
                </div>
                <div className="col-span-12">
                    <StudentTrend />
                </div>
                <div className="col-span-12 p-2 rounded-lg">
                    <CourseTrack />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Pay Fee
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Exapnd the functionality and services offered in the institution
                        </p>
                    </div>

                    <PayFee onSubmit={onSubmit} />
                    
                </div>
            </Modal>
        </>
    )
}