import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import StudentPreview from "../../features/students/dashboard/StudentPreview";
import StaffPreview from "../../features/staff/dashboard/StaffPreview";

export default function Home() {
  return (
    <>
		<PageMeta
			title="JiEdu Dashboard | Home Page"
			description="Home Page for JiEdu Application showing summary report of the system"
		/>

		<div className="grid grid-cols-12 gap-4 md:gap-6">
			<div className="col-span-12 space-y-6 xl:col-span-8">
				<EcommerceMetrics />

				<StudentPreview />

				<StaffPreview />
			</div>

			<div className="col-span-12 xl:col-span-4 space-y-4">
				<MonthlyTarget />

				<DemographicCard />
			</div>
		</div>
    </>
  );
}