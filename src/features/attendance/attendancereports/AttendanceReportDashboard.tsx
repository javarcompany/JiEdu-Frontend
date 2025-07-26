import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import PageMeta from "../../../components/common/PageMeta";
import StudentReportDashboard from "./tabs/StudentReport";
import ClassReportDashboard from "./tabs/ClassReport";
import CourseReportDashboard from "./tabs/CourseReport";
import { BarChart2Icon, TableConfigIcon, Users2Icon } from "lucide-react";

export default function AttendanceReportDashboard() {
    return (
        <>
            <PageMeta
                title="JiEdu Attendance | Attendance Report Page"
                description="Attendance Page for JiEdu Application used to generate reports"
            />

            <div className="p-2">
                <h2 className="text-xl font-semibold mb-4">Attendance Reports</h2>

                <Tabs defaultValue="students" className="w-full ">
                    <TabsList className="mb-4 flex items-center bg-gray-100 dark:bg-gray-900">
                        <TabsTrigger className="px-3 py-2 font-medium rounded-md text-theme-sm text-gray-600 hover:text-gray-900   dark:hover:text-white" value="students"><Users2Icon className="w-4 h-4" />Students</TabsTrigger>
                        <TabsTrigger className="px-3 py-2 font-medium rounded-md text-theme-sm text-gray-600 hover:text-gray-900   dark:hover:text-white" value="classes"><BarChart2Icon className="w-4 h-4" />Classes</TabsTrigger>
                        <TabsTrigger className="px-3 py-2 font-medium rounded-md text-theme-sm text-gray-600 hover:text-gray-900   dark:hover:text-white" value="course"><TableConfigIcon className="w-4 h-4" />Course</TabsTrigger>
                    </TabsList>

                    <TabsContent value="students">
                        <StudentReportDashboard />
                    </TabsContent>

                    <TabsContent value="classes">
                        <ClassReportDashboard />
                    </TabsContent>

                    <TabsContent value="course">
                        <CourseReportDashboard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
 