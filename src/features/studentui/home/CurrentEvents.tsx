import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "../../../components/ui/table";
import { useNavigate } from "react-router";

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
    name: string;
    date: string;
    location: string;
};

export const SCROLL_INTERVAL = 3000;
const ROW_HEIGHT = 75; // px per row height
export const VISIBLE_ROWS = 3;

export default function UpcomingEvents({ student_regno }: { student_regno: string | undefined }) {
    const token = localStorage.getItem("access");
    const [events, setEvents] = useState<Events[]>([]);
    const navigate = useNavigate();
    
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

                    <div className="flex flex-row items-end">
                        <button onClick={() => navigate("/events")} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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

                <div className="max-w-full max-h-[220px] overflow-hidden">
                    {/* h-[calc(4*48px)] */}
                    <Table>  
                        {/* Table Body */}
                        <TableBody 
                            className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
                            style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}px`, overflowY: "auto" }}
                        >
                            {events.length === 0 ? (
                                <TableRow>
                                    <TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
                                        <div className="p-4 text-sm text-gray-500">No Events found.....</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event, idx) => (
                                    <TableRow key={event.id} className="">
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                                    <img
                                                        src={EVENT_IMAGES[idx % EVENT_IMAGES.length]}
                                                        className="h-[50px] w-[50px] object-cover"
                                                        alt={event.name[0]}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {event.name}
                                                    </p>
                                                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {event.date} - {event.location}
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
