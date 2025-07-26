import PageMeta from "../../../components/common/PageMeta";
import RegistrationForm from "./StudentRegistrationForm";

export default function StudentRegistration() {
  return (
    <>
      <PageMeta
        title="New Student | JiEdu - System"
        description="This is New Student Registration form for JiEdu - System"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          New Student
        </h3>
        <div className="space-y-6">
          <RegistrationForm />
        </div>
      </div>
    </>
  );
}
