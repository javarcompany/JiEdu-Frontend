import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "../../components/ui/table";
import { useNavigate } from "react-router";
import axios from "axios";

import { formatDateTime } from "../../utils/format";
import { useUser } from "../../context/AuthContext";

// Random images (unit passport placeholders)
const EVENT_IMAGES = [
  "https://source.unsplash.com/80x80/?book",
  "https://source.unsplash.com/80x80/?education",
  "https://source.unsplash.com/80x80/?classroom",
  "https://source.unsplash.com/80x80/?study",
  "https://source.unsplash.com/80x80/?university",
];

type Events = {
    id: string;
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    event_type: string;
    location: string;
};

export const SCROLL_INTERVAL = 5000;
const LG_ROW_HEIGHT = 140; // px per row height
let VISIBLE_ROWS = 2;

export default function UpcomingEvents({ user_regno, mode, reload }: { user_regno: string | undefined, mode: string, reload: boolean }) {
    const token = localStorage.getItem("access");
    const [events, setEvents] = useState<Events[]>([]);
	const [offset, setOffset] = useState(0);
    const navigate = useNavigate();
    const {user} = useUser();

    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const response = await axios.get(`api/get-user-upcoming-events/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            user_regno: user_regno,
                            limit_lessons: mode === "small" ? 5 : "all"
                        }
                    }
                );
                setEvents(response.data || []);
            }catch (error){
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [user_regno, reload]);

    useEffect(() => {
        if (mode === "large"){
            VISIBLE_ROWS = 5;
        }
        
        if (events.length <= VISIBLE_ROWS) return; // no need to scroll

        const interval = setInterval(() => {
            setOffset((prevOffset) => {
                const maxOffset = events.length - VISIBLE_ROWS;

                if (maxOffset <= 0) return 0; // no scroll needed

                if (prevOffset >= maxOffset) {
                    return 0; // restart scrolling
                }
                return prevOffset + 1;
            });
        }, SCROLL_INTERVAL);
            
        return () => clearInterval(interval);
    }, [events.length]);

    const handleClick = () => {
        if (!user) return; // safeguard
        if (user.user_type === "staff") {
            navigate("/activities");
        } else {
            navigate("/events");
        }
    };

    return (
        <div className="gap-6 shadow-md bg-blue-800 dark:bg-gray-800 rounded-2xl p-4">
            {/* Right: My Events */}
            <div className="ml-4 mt-4">
                <div className="flex gap-2 mb-4 flex-row justify-between">
                    <div className="items-start" >
                        <h3 className="text-md lg:text-lg font-semibold text-white">
                            Current/ Upcoming Events
                        </h3>
                    </div>
                    {mode === "small" && (
                        <div className="flex flex-row items-end">
                            <button onClick={handleClick} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
                    )}
                </div>

                <div className={`max-w-full ${mode === "large" ? "" : "max-h-[280px]"} relative overflow-hidden`}>
                    {/* h-[calc(4*48px)] */}
                    <Table>  
                        {/* Table Body */}
                        <TableBody 
                            className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
                            style={{ transform: `translateY(-${offset * LG_ROW_HEIGHT}px)` }}
                        >
                            {events.length === 0 ? (
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="p-4 text-sm text-white">No Events found.....</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event, idx) => (
                                    <TableRow key={idx} className="">
                                        <TableCell className="py-4">
                                            <div className="flex items-start gap-4">
                                                {/* Event Image */}
                                                <div className="h-14 w-14 overflow-hidden rounded-xl shadow-md">
                                                <img
                                                    src={EVENT_IMAGES[idx % EVENT_IMAGES.length]}
                                                    className="h-14 w-14 object-cover"
                                                    alt={event.title[0]}
                                                />
                                                </div>

                                                {/* Event Info */}
                                                <div className="flex flex-col space-y-1">
                                                {/* Title */}
                                                <p className="font-semibold text-white dark:text-gray-900 text-lg dark:text-white">
                                                    {event.title}
                                                </p>

                                                {/* Description */}
                                                <p className="text-gray-300 text-sm dark:text-gray-400 line-clamp-1">
                                                    {event.description}
                                                </p>

                                                {/* Time Range */}
                                                <p className="text-gray-200 text-xs dark:text-gray-400">
                                                    {formatDateTime(event.start_datetime)} → {formatDateTime(event.end_datetime)}
                                                </p>

                                                {/* Event Type & Location */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                    {event.event_type}
                                                    </span>
                                                    <span className="text-xs text-yellow-500 dark:text-gray-400">
                                                    📍 {event.location}
                                                    </span>
                                                </div>
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
