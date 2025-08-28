import StudentKPI from "../../fee/reports/StudentFeeKPI";

type ActionsProps = {
    filters: { student:string, mode: string, term:string; };
};

export default function LeftComponents({ filters }: ActionsProps) {
    // This component is responsible for displaying the student's fee summary and KPI
    return (

        <StudentKPI student={filters.student} term={filters.term} mode={filters.mode} />

    );
}