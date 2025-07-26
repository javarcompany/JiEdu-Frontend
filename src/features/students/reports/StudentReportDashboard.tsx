import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import StudentGenderTrendChart from "./StudentTrend";
import StudentEnrollmentTrendChart from "./StudentEnrollmentTrend";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import SearchableSelect from "../../../components/form/DictSelect";
import Input from "../../../components/form/input/InputField";
import StudentStatusTrendChart from "./StudentStatusTrend";

interface GenderSummaryProp {
    id: number;
    name: string;
    abbr: string;
    male: string;
    female: string;
    total: string;
    courses: [{
        id: number;
        name: string;
        abbr: string;
        male: number;
        female: number;
        total: number;
    }]
}

interface AgeSummaryProp {
    id: number;
    name: string;
    abbr: string;
    less18: string;
    btn18_24: string;
    great24: string;
    total: string;
    courses: [{
        id: number;
        name: string;
        abbr: string;
        less18: number;
        btn18_24: string;
        great24: number;
        total: number;
    }]
}

interface ExamsSummaryProp {
    id: number;
    name: string;
    abbr: string;
    diploma: string;
    certificate: string;
    kcse: string;
    kcpe: string;
    total: string;
    courses: [{
        id: number;
        name: string;
        abbr: string;
        diploma: number;
        certificate: string;
        kcse: number;
        kcpe: string;
        total: number;
    }]
}

type StudentAgeDetail = {
  regno: string;
  profile_picture?: string;
  student_name: string;
  age: string;
  status: string;
};

type StudentGenderDetail = {
  regno: string;
  profile_picture?: string;
  student_name: string;
  gender: string;
  status: string;
};

type StudentExamsDetail = {
  regno: string;
  profile_picture?: string;
  student_name: string;
  exams: string;
  grade: string;
  status: string;
};

export default function StudentReportDashboard() {
    const token = localStorage.getItem("access");
    const { isOpen, openModal, closeModal } = useModal();
    const [summary, setSummary] = useState({
        totalActive: 0,
        totalRegistered: 0,
        prevTotalRegistered: 0,

        male: 0,
        female: 0,
        prevMale: 0,
        prevFemale: 0,

        applied: 0,
        joined: 0,
        prevJoined: 0
    });
    const [byGender, setByGender] = useState<GenderSummaryProp[]>([]);
    const [byAge, setByAge] = useState<AgeSummaryProp[]>([]);
    const [byExams, setByExams] = useState<ExamsSummaryProp[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);

    const [modeFilter, setModeFilter] = useState("Gender");
    const [timeFilter, setTimeFilter] = useState("Annual");

    const [students, setStudents] = useState<StudentGenderDetail[]>([]);
    const [studentsAge, setStudentsAge] = useState<StudentAgeDetail[]>([]);
    const [studentsExams, setStudentsExams] = useState<StudentExamsDetail[]>([]);

    const [terms, setTerms] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [durationFilter, setDurationFilter] = useState({
        start: "",
        end: ""
    });

    const [selectedCourseGender, setSelectedCourseGender] = useState("");
    const [selectedCourseAge, setSelectedCourseAge] = useState("");
    const [selectedCourseExams, setSelectedCourseExams] = useState("");

    const [studentFilter, setStudentFilter] = useState<"All" | "Cleared" | "Owing" | "Overpaid">("All");
    const [searchQuery, setSearchQuery] = useState("");

    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                const res = await axios.get("/api/institution-enrollment-summary/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { summary } = res.data;
                setSummary(summary);
            } catch (err) {
                console.error("Error fetching institution data:", err);
            }
        };

        const fetchGenderSummary = async () => {
            try {
                let url = "/api/department-gender-summary/";
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {filter_mode: timeFilter, start: durationFilter.start, end: durationFilter.end},
                });
                setByGender(res.data);
            } catch (err) {
                console.error("Failed to fetch gender summary", err);
            }
        };

        const fetchAgeSummary = async () => {
            try {
                let url = "/api/department-age-summary/";
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {filter_mode: timeFilter, start: durationFilter.start, end: durationFilter.end},
                });
                setByAge(res.data);
            } catch (err) {
                console.error("Failed to fetch age summary", err);
            }
        };

        const fetchExamsSummary = async () => {
            try {
                let url = "/api/department-exams-summary/";
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {filter_mode: timeFilter, start: durationFilter.start, end: durationFilter.end},
                });
                setByExams(res.data);
            } catch (err) {
                console.error("Failed to fetch exams summary", err);
            }
        };

        fetchSummaryData();
        fetchGenderSummary();
        fetchAgeSummary();
        fetchExamsSummary();
    }, [timeFilter, durationFilter]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
            setExpanded(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getComparison = (current: number, previous: number) => {
        if (previous === 0 && current === 0) return { type: "same", text: "Same as previous" };
        if (previous === 0) return { type: "up", percent: 100 };
        const change = ((current - previous) / previous) * 100;
        if (change > 0) return { type: "up", percent: Math.round(change) };
        if (change < 0) return { type: "down", percent: Math.abs(Math.round(change)) };
        return { type: "same", text: "Same as previous" };
    };

    const handleModeClick = (mode: string) => {
        setModeFilter(mode);
    };

    const handleApplyTime = () => {
		closeModal();
    };

    const handleTimeClick = async (filter: string) => {
        setTimeFilter(filter);
        // Based on time filter load the terms or years
        try {
            if (filter === "Termly") {
                const response = await axios.get("/api/terms/?all=true", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const formatted = response.data.results.map((term: any) => ({
                    value: term.id.toString(),
                    label: term.termyear,
                }));
                setTerms(formatted);
            } else if (filter === "Annual") {
                const response = await axios.get("/api/academic-year/?all=true", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const formatted = response.data.results.map((year: any) => ({
                    value: year.id.toString(),
                    label: year.name,
                }));
                setTerms(formatted); // You'll need to add setYears if not already present
            }
        } catch (error) {
            console.error(`Failed to load ${filter === "Termly" ? "Terms" : "Years"}`, error);
        } finally{
           openModal();
        }
    };

    const handleClose = () => {
		closeModal();
	};

    const handleStartSelect = (selected: string) => {
        setDurationFilter((prev) => ({
          ...prev, start: selected,
        }));
    };

    const handleEndSelect = (selected: string) => {
        setDurationFilter((prev) => ({
          ...prev, end: selected,
        }));
    };

    const handleCourseClick = async (course_abbr: string, course: number) => {
        setSelectedCourseGender(course_abbr);
        try {
            const res = await axios.get("/api/course-gender-breakdown/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { course_id: course, filter_mode: timeFilter, start: durationFilter.start, end: durationFilter.end },
            });
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        }
    };

    const handleCourseAgeClick = async (course_abbr: string, course: number) => {
        setSelectedCourseAge(course_abbr);
        try {
            const res = await axios.get("/api/course-age-breakdown/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { course_id: course, filter_mode: timeFilter, start: durationFilter.start, end: durationFilter.end },
            });
            setStudentsAge(res.data);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        }
    };

    const handleCourseExamsClick = async (course_abbr: string, course: number) => {
        setSelectedCourseExams(course_abbr);
        try {
            const res = await axios.get("/api/course-exams-breakdown/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { course_id: course, filter_mode: timeFilter, start: durationFilter.start, end: durationFilter.end },
            });
            setStudentsExams(res.data);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        }
    };

    const filteredStudents = () => {
        return students.filter((s) => {
            const matchesStatus =
            studentFilter === "All" || s.status === studentFilter;
            const matchesQuery =
            s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.regno.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.gender.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            s.status.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesQuery;
        });
    };

    const filteredStudentsAge = () => {
        return studentsAge.filter((s) => {
            const matchesStatus =
            studentFilter === "All" || s.status === studentFilter;
            const matchesQuery =
            s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.regno.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.age.toString().includes(searchQuery) ||
            s.status.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesQuery;
        });
    };

    const filteredStudentsExams = () => {
        return studentsExams.filter((s) => {
            const matchesStatus =
            studentFilter === "All" || s.status === studentFilter;
            const matchesQuery =
            s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.regno.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.exams.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.status.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesQuery;
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Students Report</h2>
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 mb-1">Total Students</p>
                        <div className="flex items-center justify-between text-xl text-blue-600 mb-1">
                            <p className="text-xl font-bold text-blue-600">
                                {summary.totalActive} | {summary.totalRegistered}
                            </p>
                            {(() => {
                                const comparison = getComparison(summary.totalRegistered, summary.prevTotalRegistered);
                                if (comparison.type === "up") {
                                return (
                                    <span className="text-green-600 text-sm flex items-center">
                                    ▲ {comparison.percent}% ↑ Compared to last year
                                    </span>
                                );
                                } else if (comparison.type === "down") {
                                return (
                                    <span className="text-red-600 text-sm flex items-center">
                                    ▼ {comparison.percent}% ↓ Compared to last year
                                    </span>
                                );
                                } else {
                                return <span className="text-blue-600 text-sm">~ same as last year</span>;
                                }
                            })()}
                        </div>
                    </CardContent>
                </Card>

                {/* Gender Comparison */}
                <Card>
                    <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">Male/Female Comparison (This Year)</p>
                    <div className="flex items-center justify-between text-xl text-green-600 mb-1">
                        <p className="text-xl font-bold text-green-600">
                            {summary.male} | {summary.female}
                        </p>
                        {(() => {
                            const currentTotal = summary.male + summary.female;
                            const prevTotal = summary.prevMale + summary.prevFemale;
                            const comparison = getComparison(currentTotal, prevTotal);
                            if (comparison.type === "up") {
                            return (
                                <span className="text-green-600 text-sm flex items-center">
                                ▲ {comparison.percent}% ↑ Compared to last year
                                </span>
                            );
                            } else if (comparison.type === "down") {
                            return (
                                <span className="text-red-600 text-sm flex items-center">
                                ▼ {comparison.percent}% ↓ Compared to last year
                                </span>
                            );
                            } else {
                            return <span className="text-blue-600 text-sm">~ same as last year</span>;
                            }
                        })()}
                    </div>
                    </CardContent>
                </Card>

                {/* Application Comparison */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500 mb-1">Joined/Applicants Comparison (This Year)</p>
                        <div className="flex items-center justify-between text-xl text-purple-600 mb-1">
                            <p className="text-xl font-bold text-red-600">
                                {summary.applied} | {summary.joined}
                            </p>
                            {(() => {
                                const comparison = getComparison(summary.joined, summary.prevJoined);
                                if (comparison.type === "up") {
                                return (
                                    <span className="text-green-600 text-sm flex items-center">
                                    ▲ {comparison.percent}% ↑ Compared to last year
                                    </span>
                                );
                                } else if (comparison.type === "down") {
                                return (
                                    <span className="text-red-600 text-sm flex items-center">
                                    ▼ {comparison.percent}% ↓ Compared to last year
                                    </span>
                                );
                                } else {
                                return <span className="text-blue-600 text-sm">~ same as last year</span>;
                                }
                            })()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <Tabs defaultValue="trends">
                <TabsList className="mb-4 flex flex-wrap justify-between lg:justify-start gap-2 text-sm md:text-base w-full">
                    <TabsTrigger value="trends" className="flex-1 lg:flex-none">Trends</TabsTrigger>
                    <TabsTrigger value="by-department" className="flex-1 lg:flex-none">Department Breakdown</TabsTrigger>
                </TabsList>

                <TabsContent value="trends">
                    <div className="flex grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                        <StudentEnrollmentTrendChart />
                        <StudentGenderTrendChart />
                    </div>
                    <div className="flex  grid grid-cols-1 gap-4 bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                        <StudentStatusTrendChart />
                    </div>
                </TabsContent>

                <TabsContent value="by-department">
                    <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow">
                        <div className="flex justify-between">
                            <div className="flex gap-2 mb-3">
                                {['Gender', 'Age', "Previous Exams"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => handleModeClick(f)}
                                        className={`px-3 py-1 rounded text-sm font-medium border ${
                                            modeFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2 mb-3 ml-2">
                                {['Annual', 'Termly'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => handleTimeClick(f)}
                                        className={`px-3 py-1 rounded text-sm font-medium border ${
                                            timeFilter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        { modeFilter === "Gender" &&(
                            <div className="overflow-x-auto rounded-md border border-blue-200 bg-blue-50 dark:bg-transparent dark:border-gray-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Department</th>
                                            <th className="px-4 py-2 text-center">Male</th>
                                            <th className="px-4 py-2 text-center">Female</th>
                                            <th className="px-4 py-2 text-center">Total</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {byGender.length > 0 ? (
                                            byGender.map((dep) => (
                                                <React.Fragment key={dep.id}>
                                                    {/* Department Row */}
                                                    <tr
                                                        className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                        onClick={(e) => {
                                                            const isExpanding = expanded !== dep.id;
                                                            setExpanded(isExpanding ? dep.id : null);

                                                            // Scroll into view after setting expanded
                                                            if (isExpanding) {
                                                            setTimeout(() => {
                                                                const rowElement = e.currentTarget;
                                                                rowElement?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                            }, 100);
                                                            }
                                                        }}
                                                    >
                                                        <td className="px-4 py-2 flex items-center gap-2 font-medium">
                                                            {expanded === dep.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            <span className="block md:hidden">{dep.abbr}</span>
                                                            <span className="hidden md:block">{dep.name}</span>
                                                        </td>
                                                        <td className="px-4 py-2 text-center">{dep.male.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.female.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.total.toLocaleString()}</td>
                                                    </tr>

                                                    {/* Course Rows (Expanded) */}
                                                    {expanded === dep.id &&
                                                        dep.courses.map((c) => (
                                                            <tr
                                                                key={c.id}
                                                                onClick={() => handleCourseClick(c.abbr, c.id)}
                                                                className="cursor-pointer border-t dark:border-gray-700 bg-gray-100/60 dark:bg-gray-800 text-sm hover:bg-white dark:hover:bg-gray-900"
                                                            >
                                                                <td className="pl-10 py-2 text-blue-600">
                                                                    <span className="block md:hidden">{c.abbr}</span>
                                                                    <span className="hidden md:block">{c.name}</span>
                                                                </td>
                                                                <td className="py-2 text-center">{c.male.toLocaleString()}</td>
                                                                <td className="py-2 text-center">{c.female.toLocaleString()}</td>
                                                                <td className="py-2 text-center">{c.total.toLocaleString()}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                                                    No record found...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        )}

                        { modeFilter === "Age" &&(
                            <div className="overflow-x-auto rounded-md border border-blue-200 bg-blue-50 dark:bg-transparent dark:border-gray-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Department</th>
                                            <th className="px-4 py-2 text-center">&lt; 18 Yrs</th>
                                            <th className="px-4 py-2 text-center">18 - 24 Yrs</th>
                                            <th className="px-4 py-2 text-center">&gt; 24 Yrs</th>
                                            <th className="px-4 py-2 text-center">Total</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {byAge.length > 0 ? (
                                            byAge.map((dep) => (
                                                <React.Fragment key={dep.id}>
                                                    {/* Department Row */}
                                                    <tr
                                                        className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                        onClick={(e) => {
                                                            const isExpanding = expanded !== dep.id;
                                                            setExpanded(isExpanding ? dep.id : null);

                                                            // Scroll into view after setting expanded
                                                            if (isExpanding) {
                                                            setTimeout(() => {
                                                                const rowElement = e.currentTarget;
                                                                rowElement?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                            }, 100);
                                                            }
                                                        }}
                                                    >
                                                        <td className="px-4 py-2 flex items-center gap-2 font-medium">
                                                            {expanded === dep.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            <span className="block md:hidden">{dep.abbr}</span>
                                                            <span className="hidden md:block">{dep.name}</span>
                                                        </td>
                                                        <td className="px-4 py-2 text-center">{dep.less18.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.btn18_24.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.great24.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.total.toLocaleString()}</td>
                                                    </tr>

                                                    {/* Course Rows (Expanded) */}
                                                    {expanded === dep.id &&
                                                        dep.courses.map((c) => (
                                                            <tr
                                                                key={c.id}
                                                                onClick={() => handleCourseAgeClick(c.abbr, c.id)}
                                                                className="cursor-pointer border-t dark:border-gray-700 bg-gray-100/60 dark:bg-gray-800 text-sm hover:bg-white dark:hover:bg-gray-900"
                                                            >
                                                            <td className="pl-10 py-2 text-blue-600">
                                                                <span className="block md:hidden">{c.abbr}</span>
                                                                <span className="hidden md:block">{c.name}</span>
                                                            </td>
                                                            <td className="py-2 text-center">{c.less18.toLocaleString()}</td>
                                                            <td className="py-2 text-center">{c.btn18_24.toLocaleString()}</td>
                                                            <td className="px-4 py-2 text-center">{c.great24.toLocaleString()}</td>
                                                            <td className="py-2 text-center">{c.total.toLocaleString()}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                                                    No record found...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        )}

                        { modeFilter === "Previous Exams" &&(
                            <div className="overflow-x-auto rounded-md border border-blue-200 bg-blue-50 dark:bg-transparent dark:border-gray-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Department</th>
                                            <th className="px-4 py-2 text-center">Diploma</th>
                                            <th className="px-4 py-2 text-center">Certificate</th>
                                            <th className="px-4 py-2 text-center">KCSE</th>
                                            <th className="px-4 py-2 text-center">KCPE</th>
                                            <th className="px-4 py-2 text-center">Total</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {byExams.length > 0 ? (
                                            byExams.map((dep) => (
                                                <React.Fragment key={dep.id}>
                                                    {/* Department Row */}
                                                    <tr
                                                        className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                        onClick={(e) => {
                                                            const isExpanding = expanded !== dep.id;
                                                            setExpanded(isExpanding ? dep.id : null);

                                                            // Scroll into view after setting expanded
                                                            if (isExpanding) {
                                                            setTimeout(() => {
                                                                const rowElement = e.currentTarget;
                                                                rowElement?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                            }, 100);
                                                            }
                                                        }}
                                                    >
                                                        <td className="px-4 py-2 flex items-center gap-2 font-medium">
                                                            {expanded === dep.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            <span className="block md:hidden">{dep.abbr}</span>
                                                            <span className="hidden md:block">{dep.name}</span>
                                                        </td>
                                                        <td className="px-4 py-2 text-center">{dep.diploma.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.certificate.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.kcse.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.kcpe.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-center">{dep.total.toLocaleString()}</td>
                                                    </tr>

                                                    {/* Course Rows (Expanded) */}
                                                    {expanded === dep.id &&
                                                        dep.courses.map((c) => (
                                                            <tr
                                                                key={c.id}
                                                                onClick={() => handleCourseExamsClick(c.abbr, c.id)}
                                                                className="cursor-pointer border-t dark:border-gray-700 bg-gray-100/60 dark:bg-gray-800 text-sm hover:bg-white dark:hover:bg-gray-900"
                                                            >
                                                            <td className="pl-10 py-2 text-blue-600">
                                                                <span className="block md:hidden">{c.abbr}</span>
                                                                <span className="hidden md:block">{c.name}</span>
                                                            </td>
                                                            <td className="py-2 text-center">{c.diploma.toLocaleString()}</td>
                                                            <td className="py-2 text-center">{c.certificate.toLocaleString()}</td>
                                                            <td className="px-4 py-2 text-center">{c.kcse.toLocaleString()}</td>
                                                            <td className="px-4 py-2 text-center">{c.kcpe.toLocaleString()}</td>
                                                            <td className="py-2 text-center">{c.total.toLocaleString()}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
                                                    No record found...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Modal for duration selection */}
            <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Select {timeFilter} Range
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>
                    
                    <div className="px-2 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                
                            <div>
                                <Label>Start</Label>
                                <SearchableSelect items={terms} onSelect={handleStartSelect} />
                            </div>

                            <div>
                                <Label>End</Label>
                                <SearchableSelect items={terms} onSelect={handleEndSelect} />
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={handleClose}>
                            Close
                        </Button>
                        <button
                            onClick={handleApplyTime}
                            className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            Apply Range
                        </button>
                    </div>
                        
                </div>
            </Modal>

            {/* Gender Modal */}
            <Modal isOpen={!!selectedCourseGender} onClose={() => setSelectedCourseGender("")} className="max-w-[900px] m-4">
                <div className="relative w-full p-4 bg-white dark:bg-gray-900 rounded-3xl lg:p-11">

                    <div className="px-2 pb-8">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedCourseGender} - Student Breakdown
                        </h4>

                        <div className="flex flex-col gap-2 md:flex-row md:justify-between mb-4 pt-2">
                            <div className="flex gap-2">
                                {["All", "Pending", "Approved", "Declined", "Joined"].map((f) => (
                                    <button
                                    key={f}
                                    onClick={() => setStudentFilter(f as typeof studentFilter)}
                                    className={`px-3 py-1 rounded text-sm font-medium border ${
                                        studentFilter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <Input
                                type="text"
                                placeholder="Search by name or regno"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-3 py-1 text-sm rounded border dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left">Student</th>
                                    <th className="px-4 py-2 text-right">Gender</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                { filteredStudents().length > 0 ? (
                                    filteredStudents().map((s, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-t dark:border-gray-700 text-gray-700 dark:text-white"
                                        >
                                            {/* Student cell with image, name, regno */}
                                            <td className="px-4 py-3 flex items-center gap-3">
                                                <img
                                                src={s.profile_picture || "/default-profile.png"}
                                                alt={s.student_name}
                                                className="w-10 h-10 rounded-full object-cover border"
                                                />
                                                <div className="flex flex-col text-sm leading-tight">
                                                <span className="font-medium">{s.student_name}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{s.regno}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-right text-sm">{s.gender}</td>

                                            <td
                                                className={`px-4 py-3 text-sm font-medium ${
                                                s.status === "Approved"
                                                    ? "text-green-600"
                                                    : s.status === "Joined"
                                                    ? "text-blue-600"
                                                    : s.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                                }`}
                                            >
                                                {s.status}
                                            </td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4 text-sm text-gray-500">
                                            No record found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-6">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-700 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z"
                                />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-white font-medium">Print</span>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Age Modal */}
            <Modal isOpen={!!selectedCourseAge} onClose={() => setSelectedCourseAge("")} className="max-w-[900px] m-4">
                <div className="relative w-full p-4 bg-white dark:bg-gray-900 rounded-3xl lg:p-11">

                    <div className="px-2 pb-8">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedCourseAge} - Student Breakdown
                        </h4>

                        <div className="flex flex-col gap-2 md:flex-row md:justify-between mb-4 pt-2">
                            <div className="flex gap-2">
                                {["All", "Pending", "Approved", "Declined", "Joined"].map((f) => (
                                    <button
                                    key={f}
                                    onClick={() => setStudentFilter(f as typeof studentFilter)}
                                    className={`px-3 py-1 rounded text-sm font-medium border ${
                                        studentFilter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <Input
                                type="text"
                                placeholder="Search by name or regno"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-3 py-1 text-sm rounded border dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left">Student</th>
                                    <th className="px-4 py-2 text-right">Age</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                { filteredStudentsAge().length > 0 ? (
                                    filteredStudentsAge().map((s, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-t dark:border-gray-700 text-gray-700 dark:text-white"
                                        >
                                            {/* Student cell with image, name, regno */}
                                            <td className="px-4 py-3 flex items-center gap-3">
                                                <img
                                                    src={s.profile_picture || "/default-profile.png"}
                                                    alt={s.student_name}
                                                    className="w-10 h-10 rounded-full object-cover border"
                                                />
                                                <div className="flex flex-col text-sm leading-tight">
                                                    <span className="font-medium">{s.student_name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.regno}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-right text-sm">{s.age}</td>

                                            <td
                                                className={`px-4 py-3 text-sm font-medium ${
                                                s.status === "Approved"
                                                    ? "text-green-600"
                                                    : s.status === "Joined"
                                                    ? "text-blue-600"
                                                    : s.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                                }`}
                                            >
                                                {s.status}
                                            </td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4 text-sm text-gray-500">
                                            No record found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-6">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-700 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z"
                                />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-white font-medium">Print</span>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Exams Modal */}
            <Modal isOpen={!!selectedCourseExams} onClose={() => setSelectedCourseExams("")} className="max-w-[900px] m-4">
                <div className="relative w-full p-4 bg-white dark:bg-gray-900 rounded-3xl lg:p-11">

                    <div className="px-2 pb-8">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedCourseExams} - Student Breakdown
                        </h4>

                        <div className="flex flex-col gap-2 md:flex-row md:justify-between mb-4 pt-2">
                            <div className="flex gap-2">
                                {["All", "Pending", "Approved", "Declined", "Joined"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setStudentFilter(f as typeof studentFilter)}
                                        className={`px-3 py-1 rounded text-sm font-medium border ${
                                            studentFilter === f
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <Input
                                type="text"
                                placeholder="Search by name or regno"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-3 py-1 text-sm rounded border dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left">Student</th>
                                    <th className="px-4 py-2 text-right">Previous Exams</th>
                                    <th className="px-4 py-2 text-right">Previous Grade</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                { filteredStudentsExams().length > 0 ? (
                                    filteredStudentsExams().map((s, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-t dark:border-gray-700 text-gray-700 dark:text-white"
                                        >
                                            {/* Student cell with image, name, regno */}
                                            <td className="px-4 py-3 flex items-center gap-3">
                                                <img
                                                    src={s.profile_picture || "/default-profile.png"}
                                                    alt={s.student_name}
                                                    className="w-10 h-10 rounded-full object-cover border"
                                                />
                                                <div className="flex flex-col text-sm leading-tight">
                                                    <span className="font-medium">{s.student_name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.regno}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-right text-sm">{s.exams}</td>
                                            <td className="px-4 py-3 text-right text-sm">{s.grade}</td>

                                            <td
                                                className={`px-4 py-3 text-sm font-medium ${
                                                s.status === "Approved"
                                                    ? "text-green-600"
                                                    : s.status === "Joined"
                                                    ? "text-blue-600"
                                                    : s.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                                }`}
                                            >
                                                {s.status}
                                            </td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                                            No record found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-6">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-700 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z"
                                />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-white font-medium">Print</span>
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
