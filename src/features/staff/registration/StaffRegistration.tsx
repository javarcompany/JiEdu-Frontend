import PageMeta from "../../../components/common/PageMeta";
import RegistrationForm from "./StaffRegistrationForm";

export default function StaffRegistration() {
    return (
        <>
            <PageMeta
                title="New Staff | JiEdu - System"
                description="This is New Staff Registration form for JiEdu - System"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    New Staff
                </h3>
                <div className="space-y-6">
                    <RegistrationForm />
                </div>
            </div>
        </>
    );
}
