import { Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setupInterceptors } from "./lib/axois";

// Authentication
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// TOOLS
import BackButton from "./components/ui/button/BackButton";
import PrivateRoute from "./components/PrivateComponent";
import useAutoLogout from "./hooks/useAutoLogOut";
import NotFound from "./pages/OtherPage/NotFound";
import PublicRoute from "./components/PublicRoute";
import useLogout from "./hooks/useLogOut";

// Layout
import AdminLayout from "./layout/AdminLayout";
import StudentLayout from "./layout/StudentLayout";
import StaffLayout from "./layout/StaffLayout";

// ================================ADMINISTRATOR ROUTES=================================//
// Dashboard
import Home from "./features/dashboard/Home";

// Student
import AnonymousRegistrationForm from "./features/students/applications/AnonymousRegistrationForm";
import StudentRegistration from "./features/students/applications/StudentRegistration";
import Student from "./features/students/dashboard/StudentsDashboard";
import StudentList from "./features/students/registeredstudents/StudentList";
import StudentEnrollments from "./features/students/applications/StudentEnrollments";
import ApproveDashboard from "./features/students/approves/ApproveDashboard";
import StudentAllocations from "./features/students/allocations/StudentAllocations";
import AllocateDashboard from "./features/students/allocations/Allocate";
import StudentApplication from "./features/students/applications/view/ViewApplication";
import StudentData from "./features/students/registeredstudents/view/ViewStudent";
import StudentReportDashboard from "./features/students/reports/StudentReportDashboard";

// Staff
import StaffDashboard from "./features/staff/dashboard/StaffDashboard";
import StaffList from "./features/staff/StaffList";
import StaffWorkload from "./features/staff/unitworkload/StaffWorkload";
import StaffRegistration from "./features/staff/registration/StaffRegistration";
import AssignWorkload from "./features/staff/unitworkload/AssignWorkload";
import ClassTutorDashboard from "./features/staff/classtutor/ClassTutorDashboard";
import StaffData from "./features/staff/registration/view/ViewStaff";

// Admin
import AdminDashboard from "./features/admin/AdminDashboard";
import ConfigDashboard from "./features/configs/ConfigDashboard"
import BranchDashboard from "./features/branches/BranchesDashboard";
import DepartmentDashboard from "./features/departments/DepartmentDashboard";
import CoursesDashboard from "./features/courses/CoursesDashboard";
import UnitsDashboard from "./features/units/UnitsDashboard";
import ClassesDashboard from "./features/classes/ClassesDashboard";
import ClassroomDashboard from "./features/classrooms/ClassroomDashboard";
import AssignRoles from "./features/admin/AssignRoles";
import AcYearTable from "./features/configs/academics/AcYearTable";
import IntakeTable from "./features/configs/academics/IntakeTable";
import IntakeSeriesTable from "./features/configs/academics/IntakeSeriesTable";
import ModuleTable from "./features/configs/academics/ModuleTable";
import UserList from "./features/users/UsersList";
import UserInfoDashboard from "./features/users/UserInfoDashboard";

// Timetable
import TimetableDashboard from "./features/timetable/dashboard/TimetableDashboard";
import SetupDashboard from "./features/timetable/setup/LessonSetup";
import Tables from "./features/timetable/tables/Tables";
import TimetableReportDashboard from "./features/timetable/report/TimetableReportDashboard";

// Attendance
import AttendanceDashboard from "./features/attendance/AttendanceDashboard";
import MarkAttendance from "./features/attendance/markattendance/MarkAttendance";
import AttendanceReportDashboard from "./features/attendance/attendancereports/AttendanceReportDashboard";
import CameraDashboard from "./features/camera/CameraDashboard";
import FaceEnroll from "./features/biometrics/FaceEnroll";

// Fee Management
import FeeDashboard from "./features/fee/FeeDashboard";
import FeeSetup from "./features/fee/FeeSetup";
import FeeReportDashboard from "./features/fee/reports/FeeReportDashboard";
import WalletViewer from "./features/fee/WalletViewer";

// AUXILLIARY
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";

// =======================STUDENT'S DASHBOARD ===================================#
import StudentHome from "./features/studentui/home/StudentDashboard";
import StudentCourseDashboard from "./features/studentui/course/CourseDashboard";
import StudentFeeDashboard from "./features/studentui/money/MoneyDashboard";
import StudentEventDashboard from "./features/studentui/events/StudentEventDashboard";
import StudentProfileDashboard from "./components/UserProfile/StudentProfileDashboard";

// =======================STAFF'S DASHBOARD ===================================#
import StaffHome from "./features/staffui/dashboard/StaffDashboard";
import StaffEventDashboard from "./features/staffui/events/StaffEventDashboard";
import StaffWorkloadDashboard from "./features/staffui/workload/WorkloadDashboard";
import StaffProfileDashboard from "./components/UserProfile/StaffProfileDashboard";

export default function App() {
	const navigate = useNavigate();

	useEffect(() => {
		setupInterceptors(navigate);
	}, [navigate]);

	const token = localStorage.getItem("access");

    useAutoLogout({ token, onLogout: useLogout });

	return (
		<>
			<ToastContainer position="top-right" autoClose={3000} />
			<ScrollToTop />
			<BackButton />
			<Routes>
				{/* Authentication */}
				<Route element={<PublicRoute />}>
					<Route path="/signin" element={<SignIn />} />
				</Route>
				<Route path="/signup" element={<SignUp />} />

				{/* Admin Routes */}
				<Route element={<PrivateRoute allowedRoles={['admin', "user"]}/>}>
					<Route element={<AdminLayout />}>

						<Route index path="/" element={<Home />} />
	
						{/* Student App */}
						<Route path="/student" element={<Student />}/>
						<Route path="/student-list" element={<StudentList />}/>
						<Route path="/enrollments" element={<StudentEnrollments />}/>
						<Route path="/allocations" element={<StudentAllocations />}/>
						<Route path="/new-student" element={<StudentRegistration />}/>
						<Route path="/approve" element={<ApproveDashboard />} />
						<Route path="/allocate" element={<AllocateDashboard />} />
						<Route path="/view-applicant/:id" element={<StudentApplication />}/>
						<Route path="/view-student/:id" element={<StudentData />}/>
						<Route path="/student-report" element={<StudentReportDashboard />} />

						{/* Staff App */}
						<Route path="/staff" element={<StaffDashboard />}/>
						<Route path="/unit-workload" element={<StaffWorkload />}/>
						<Route path="/staff-list" element={<StaffList />} />
						<Route path="/new-staff" element={<StaffRegistration />} />
						<Route path="/assign-workload" element={<AssignWorkload />} />
						<Route path="/class-tutors" element={<ClassTutorDashboard />} />
						<Route path="/view-staff/:id" element={<StaffData />}/>

						{/* Timetable App */}
						<Route path="/timetable" element={<TimetableDashboard />} />
						<Route path="/table-setup" element={<SetupDashboard />} />
						<Route path="/add-timetable" element={<Tables />} />
						<Route path="/timetable-report" element={<TimetableReportDashboard />} />

						{/* Attendance */}
						<Route path="/attendance" element={<AttendanceDashboard />}/>
						<Route path="/mark-attendance" element={<MarkAttendance />} />
						<Route path="/attendance-report" element={<AttendanceReportDashboard />} />

						{/* Fee Management */}
						<Route path="/fee" element={<FeeDashboard />} />
						<Route path="/fee-setup" element={<FeeSetup />}/>
						<Route path="/fee-report" element={<FeeReportDashboard />}/>
						<Route path="/view-wallets" element= {<WalletViewer />} />
						
						{/* Biometrics */}
						<Route path="/enroll-face/:regno/:type" element={<FaceEnroll />} />

						{/* Admin */}
						<Route path="/admin" element={<AdminDashboard />}/>
						<Route path="/manage-roles/:group/:id" element={<AssignRoles />} />
						<Route path="/branches" element={<BranchDashboard />} />
						<Route path="/departments" element={<DepartmentDashboard />} />
						<Route path="/courses" element={<CoursesDashboard />} />
						<Route path="/units" element={<UnitsDashboard />} />
						<Route path="/classes" element={<ClassesDashboard />} />
						<Route path="/classrooms" element={<ClassroomDashboard />} />
						<Route path="/configs" element={<ConfigDashboard />} />
						<Route path="/acyears" element={<AcYearTable />} />
						<Route path="/intakes" element={<IntakeTable />} />
						<Route path="/modules" element={<ModuleTable />} />
						<Route path="/intake-series" element={<IntakeSeriesTable />} />
						<Route path="/users" element={<UserList />} />
						<Route path="/user-profiles/:userid" element={<UserInfoDashboard />} />
						<Route path="/cameras" element={<CameraDashboard />} />

						<Route path="/profile" element={<UserProfiles />} />
						<Route path="/blank" element={<Blank />} />

						{/* Forms */}
						<Route path="/form-elements" element={<FormElements />} />

						{/* Tables */}
						<Route path="/basic-tables" element={<BasicTables />} />

						{/* Ui Elements */}
						<Route path="/alerts" element={<Alerts />} />
						<Route path="/avatars" element={<Avatars />} />
						<Route path="/badge" element={<Badges />} />
						<Route path="/buttons" element={<Buttons />} />
						<Route path="/images" element={<Images />} />
						<Route path="/videos" element={<Videos />} />
					</Route>
				</Route>

				{/* Student Routes */}
				<Route element={<PrivateRoute allowedRoles={['student']}/>}>
					<Route element={<StudentLayout />}>

						<Route index path="/home" element={<StudentHome />} />
						<Route path="/course" element={<StudentCourseDashboard />} />
						<Route path="/money" element={<StudentFeeDashboard />} />
						<Route path="/events" element={<StudentEventDashboard />} />
						<Route path="/student-profile" element={<StudentProfileDashboard />} />

					</Route>
				</Route>

				{/* Staff Routes */}
				<Route element={<PrivateRoute allowedRoles={['staff']}/>}>
					<Route element={<StaffLayout />}>

						<Route path="/dashboard" element={<StaffHome />} />
						<Route path="/workload" element={<StaffWorkloadDashboard />} />
						<Route path="/activities" element={<StaffEventDashboard />} />
						<Route path="/staff-profile" element={<StaffProfileDashboard />} />

					</Route>
				</Route>

				{/* Anonymous Registration Form */}
				<Route path="/register-student" element={<AnonymousRegistrationForm/>} />

				{/* Fallback Route */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}
