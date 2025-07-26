import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import PageMeta from "../../../components/common/PageMeta";

import { BookmarkX, HomeIcon, Users2Icon } from "lucide-react";
import StudentReportDashboard from "./StudentReportDashboard";
import CoursesFeeDashboard from "./Course/CourseFeeDashboard";
import InstitutionFeeDashboard from "./Institution/InstitutionFeeDashboard";

export default function FeeReportDashboard() {
    return (
        <>
            <PageMeta
                title="JiEdu Fee | Fee Report Page"
                description="Fee Page for JiEdu Application used to generate reports"
            />

            <div className="p-1">
                <Tabs defaultValue="students" className="w-full space-y-2">
                    <TabsList className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 w-full bg-white dark:bg-gray-900 rounded-lg p-2">
                        <TabsTrigger
                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            value="students"
                        >
                            <Users2Icon className="w-4 h-4" />
                            Students
                        </TabsTrigger>
                        <TabsTrigger
                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            value="courses"
                        >
                            <BookmarkX className="w-4 h-4" />
                            Courses
                        </TabsTrigger>
                        <TabsTrigger
                            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            value="institution"
                        >
                            <HomeIcon className="w-4 h-4" />
                            Institution
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="students">
                        <StudentReportDashboard />
                    </TabsContent>

                    <TabsContent value="courses">
                        <CoursesFeeDashboard />
                    </TabsContent>

                    <TabsContent value="institution">
                        <InstitutionFeeDashboard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
