import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ClassTimetable from "../../timetable/report/ClassTimetable";
import UnitCard from "./Unitcard";
import AttendanceDonut from "./AttendanceDonuts";
import { useUser } from "../../../context/AuthContext";

type Units = {
    id: string;
    name: string;
    uncode: string;
    lessons: number;
    trainer: string;
    progress: number;
};

// Random images (unit passport placeholders)
const UNIT_IMAGES = [
  "https://picsum.photos/seed/book/300/200",
  "https://picsum.photos/seed/education/300/200",
  "https://picsum.photos/seed/classroom/300/200",
  "https://picsum.photos/seed/study/300/200",
  "https://picsum.photos/seed/university/300/200",
  "https://picsum.photos/seed/learning/300/200",
];

export const SCROLL_INTERVAL = 3000;
const COL_WIDTH = 320;
export const VISIBLE_COLS = 3;

export default function CourseLeftComponents() {
    const token = localStorage.getItem("access");
    const { user } = useUser();
    const [units, setUnits] = useState<Units[]>([]);
    const [offset, setOffset] = useState(0);
    
    // Animated progress (0 -> 100 -> 0 loop)
    const [unitProgress, setUnitProgress] = useState<Record<string, number>>({});
    const [progressDirection, setProgressDirection] = useState<Record<string, number>>({}); 
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
		const fetchStudent = async () => {
            try {
                const unit_response = await axios.get(`/api/search-student-units/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { student_regno: user?.regno }
                    }
                );
                setUnits(unit_response.data.units || []);
                const initProgress: Record<string, number> = {};
                unit_response.data.units.forEach((u: Units) => {
                    initProgress[u.id] = 0;
                });
                setUnitProgress(initProgress);
            } catch (error) {
                console.error("Failed to fetch student:", error);
            }
        };

		fetchStudent();
    }, [user?.regno]);

    // Auto-slide 3 units at a time
    useEffect(() => {
        if (units.length === 0) return;

        const startAutoScroll = () => {
            stopAutoScroll(); // clear any existing
            scrollIntervalRef.current = setInterval(() => {
                setOffset((prevOffset) => {
                    const maxOffset = units.length - VISIBLE_COLS;
                    if (maxOffset <= 0) return 0;
                    if (prevOffset >= maxOffset) return 0;
                    return prevOffset + 1;
                });
            }, SCROLL_INTERVAL);
        };

        const stopAutoScroll = () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                scrollIntervalRef.current = null;
            }
        };

        startAutoScroll();

        return () => stopAutoScroll();
    }, [units.length]);

    useEffect(() => {
        if (units.length === 0) return;

        const interval = setInterval(() => {
            setUnitProgress((prevProgress) => {
            const updated: Record<string, number> = {};
            const newDirections: Record<string, number> = {};

            units.forEach((u) => {
                const target = u.progress || 0;
                const current = prevProgress[u.id] ?? 0;
                const dir = progressDirection[u.id] ?? 1;

                // update progress
                let next = current + dir;

                // bounce logic
                if (next >= target) {
                next = target - 1; // step back immediately
                newDirections[u.id] = -1;
                } else if (next <= 0) {
                next = 1; // step forward immediately
                newDirections[u.id] = 1;
                } else {
                newDirections[u.id] = dir;
                }

                updated[u.id] = next;
            });

            // update directions in one go
            setProgressDirection((prev) => ({ ...prev, ...newDirections }));

            return updated;
            });
        }, 50);

        return () => clearInterval(interval);
        }, [units]);

    const handlePause = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    const handleResume = () => {
        if (!scrollIntervalRef.current && units.length > 0) {
            scrollIntervalRef.current = setInterval(() => {
                setOffset((prevOffset) => {
                    const maxOffset = units.length - VISIBLE_COLS;
                    if (maxOffset <= 0) return 0;
                    if (prevOffset >= maxOffset) return 0;
                    return prevOffset + 1;
                });
            }, SCROLL_INTERVAL);
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div
                    className="overflow-hidden col-span-12 py-2"
                    onMouseDown={handlePause}
                    onMouseUp={handleResume}
                    onTouchStart={handlePause}
                    onTouchEnd={handleResume}
                >
                    <div 
                        className="flex space-x-6 transition-transform duration-1000 ease-in-out"
                        style={{ transform: `translateX(-${offset * COL_WIDTH}px)` }}
                    >
                        {units.map((unit, index) => (
                            <div key={unit.id} className="flex-shrink-0 w-[300px]">
                                <UnitCard
                                    id = {unit.id}
                                    image={UNIT_IMAGES[index % UNIT_IMAGES.length]}
                                    title={unit.name + " - " + unit.uncode}
                                    details={{
                                        trainer: unit.trainer,
                                        lessons: unit.lessons,
                                    }}
                                    progress={unitProgress[unit.id] || 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12">
                    <ClassTimetable student_regno={user?.regno || ""} />
                </div>
                <div className="col-span-12">
                    <AttendanceDonut student_regno={user?.regno || ""} />
                </div>
            </div>
        </>
    )
}