import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Table, TableBody, TableCell, TableRow } from "../../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

// Random images (unit passport placeholders)
const UNIT_IMAGES = [
  "https://source.unsplash.com/80x80/?book",
  "https://source.unsplash.com/80x80/?education",
  "https://source.unsplash.com/80x80/?classroom",
  "https://source.unsplash.com/80x80/?study",
  "https://source.unsplash.com/80x80/?university",
];

type Units = {
    id: string;
    name: string;
    uncode: string;
    lessons: number;
    trainer: string;
};

type LessonCount = {
	completed: number | null,
	total: number,
	pending: number
}

export const SCROLL_INTERVAL = 3000;
const ROW_HEIGHT = 75; // px per row height
export const VISIBLE_ROWS = 3;

export default function CourseTrack({ student_regno }: { student_regno: string | undefined }) {
    const token = localStorage.getItem("access");
    const navigate = useNavigate();
    const [lesson_count, setLessonCount] = useState<LessonCount>();

    const [units, setUnits] = useState<Units[]>([]);
	const [offset, setOffset] = useState(0);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get(`/api/search-student-units/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { student_regno: student_regno }
                    }
                );
                setUnits(response.data.units || []);
            } catch (error) {
                console.error("Failed to fetch Units", error);
            }
        };

        const fetchStudent_Lesson = async () => {
            try {
                const response = await axios.get(`/api/search-student-lesson-counts/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { student_regno: student_regno }
                    }
                );
                setLessonCount(response.data.counts || []);
            } catch (error) {
                console.error("Failed to fetch Student Lesson Count", error);
            }
        };

        fetchUnits();
        fetchStudent_Lesson();
    }, [student_regno, token]);
    
	const series = [lesson_count?.completed ?? 0];

    useEffect(() => {
        if (units.length <= VISIBLE_ROWS) return; // no need to scroll

        const interval = setInterval(() => {
            setOffset((prevOffset) => {
                const maxOffset = units.length - VISIBLE_ROWS;

                if (maxOffset <= 0) return 0; // no scroll needed

                if (prevOffset >= maxOffset) {
                    return 0; // restart scrolling
                }
                return prevOffset + 1;
            });
        }, SCROLL_INTERVAL);
            
        return () => clearInterval(interval);
    }, [units.length]);

    const options: ApexOptions = {
        colors: ["#465FFF", "FF0000"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            height: 250,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -180,
                endAngle: 180,
                hollow: {
                    size: "60%",
                },
                track: {
                    background: "#E4E7EC",
                    strokeWidth: "100%",
                    margin: 3, // margin is in pixels
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "160%",
                        fontWeight: "600",
                        offsetY: 0,
                        color: "#1D2939",
                        formatter: function (val) {
                            return val + "%";
                        },
                    },
                },
            },
        },
        fill: {
            type: "gradient",
            colors: ["#465FFF", "#FF0066"],
        },
        stroke: {
            lineCap: "round",
        },
        labels: ["Progress"],
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 shadow rounded-2xl p-4">
            {/* Left: Donut Chart */}
            <div className="flex flex-col items-start justify-center border-r md:col-span-3">
                <h2 className="text-lg font-semibold mb-4">Course Track</h2>
                <Chart
                    options={options}
                    series={series}
                    type="radialBar"
                    height={250}
                />
            </div>

            {/* Right: My Units */}
            <div className="md:col-span-3 ml-4 mt-4">
                <div className="flex gap-2 mb-4 flex-row justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            My Units
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate("/my-units")} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <svg
                                className="stroke-current fill-white dark:fill-gray-800"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2.29004 5.90393H17.7067"
                                    stroke=""
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M17.7075 14.0961H2.29085"
                                    stroke=""
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                                    fill=""
                                    stroke=""
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                                    fill=""
                                    stroke=""
                                    strokeWidth="1.5"
                                />
                            </svg>
                            View All
                        </button>
                    </div>
                </div>
                <div className="max-w-full max-h-[220px] overflow-x-auto relative overflow-hidden">
                    {/* h-[calc(4*48px)] */}
                    <Table>  
                        {/* Table Body */}
                        <TableBody 
                            className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
                            style={{ transform: `translateY(-${offset * ROW_HEIGHT}px)` }}
                        >
                            {units.length === 0 ? (
                                <TableRow>
                                    <TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
                                        <div className="p-4 text-sm text-gray-500">No Units found.....</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                units.map((unit, idx) => (
                                    <TableRow key={unit.id} className="">
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                                    <img
                                                        src={UNIT_IMAGES[idx % UNIT_IMAGES.length]}
                                                        className="h-[50px] w-[50px] object-cover"
                                                        alt={unit.name[0]}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {unit.name} - {unit.uncode}
                                                    </p>
                                                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {unit.lessons} Lesson(s) - {unit.trainer}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
