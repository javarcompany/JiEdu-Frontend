import { useMemo, useState } from "react";

/** ---------- Date helpers (no external libs) ---------- */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const addDays = (d: Date, n: number) => {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
};

const startOfWeek = (d: Date, weekStartsOn: number = 1) => {
    // weekStartsOn: 0=Sun, 1=Mon
    const day = d.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    return startOfDay(addDays(d, -diff));
};

const endOfWeek = (d: Date, weekStartsOn: number = 1) => addDays(startOfWeek(d, weekStartsOn), 6);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

const addMonths = (d: Date, n: number) => {
    const c = new Date(d);
    c.setMonth(c.getMonth() + n);
    return c;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const isToday = (d: Date) => isSameDay(d, new Date());
const formatMonthYear = (d: Date) =>
    d.toLocaleDateString(undefined, { year: "numeric", month: "long" });

const formatWeekRange = (d: Date) => {
    const s = startOfWeek(d);
    const e = endOfWeek(d);
    const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    const startLabel = s.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const endLabel = sameMonth
        ? e.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
        : e.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${startLabel} – ${endLabel}`;
};

const weekdayLabels = (weekStartsOn: number = 1) => {
    const base = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return base.slice(weekStartsOn).concat(base.slice(0, weekStartsOn));
};

/** ---------- Component ---------- */
type ViewMode = "month" | "week";

export default function CalendarWithToggle() {
    const [view, setView] = useState<ViewMode>("month");
    const [cursorDate, setCursorDate] = useState<Date>(startOfDay(new Date()));
    const weekStartsOn = 1; // 1 = Monday, change to 0 if you want Sunday

    const headerTitle = useMemo(() => {
        return view === "month" ? formatMonthYear(cursorDate) : formatWeekRange(cursorDate);
    }, [view, cursorDate]);

    const onPrev = () => {
        setCursorDate((d) => (view === "month" ? addMonths(d, -1) : addDays(d, -7)));
    };
    const onNext = () => {
        setCursorDate((d) => (view === "month" ? addMonths(d, 1) : addDays(d, 7)));
    };
    const onToday = () => setCursorDate(startOfDay(new Date()));

    /** ----- Build Month Grid ----- */
    const monthCells = useMemo(() => {
        if (view !== "month") return [];
        const start = startOfMonth(cursorDate);
        const end = endOfMonth(cursorDate);
        const gridStart = startOfWeek(start, weekStartsOn);
        const gridEnd = endOfWeek(end, weekStartsOn);

        const days: Date[] = [];
        for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
        return days;
    }, [cursorDate, view]);

    /** ----- Build Week Row ----- */
    const weekDays = useMemo(() => {
        if (view !== "week") return [];
        const s = startOfWeek(cursorDate, weekStartsOn);
        return Array.from({ length: 7 }).map((_, i) => addDays(s, i));
    }, [cursorDate, view]);

    const wkLabels = weekdayLabels(weekStartsOn);

    return (
        <div className="w-full h-full flex flex-col rounded-2xl shadow p-3 sm:p-4 md:p-6">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4">
                {/* Nav Buttons */}
                <div className="flex gap-1 sm:gap-2 justify-start">
                    <button onClick={onPrev} className="rounded-md border p-2 xlg:p-1 hover:bg-gray-50 sm:text-base">‹</button>
                    <button onClick={onToday} className="rounded-md border p-2 xlg:p-1 hover:bg-gray-50 sm:text-sm">Today</button>
                    <button onClick={onNext} className="rounded-md border p-2 xlg:p-1 hover:bg-gray-50 sm:text-base">›</button>
                </div>

                {/* Title */}
                <h2 className="text-base sm:text-xlg md:text-md font-semibold text-center flex-1">
                    {headerTitle}
                </h2>

                {/* Toggle buttons */}
                <div className="flex gap-1 sm:gap-2 justify-end">
                    <button
                        onClick={() => setView("week")}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md border text-sm ${
                        view === "week" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"
                        }`}
                    >
                        Week
                    </button>

                    <button
                        onClick={() => setView("month")}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md border text-sm ${
                        view === "month" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"
                        }`}
                    >
                        Month
                    </button>
                </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 text-[10px] sm:text-xs font-medium text-gray-500 mb-2">
                {wkLabels.map((lbl) => (
                    <div key={lbl} className="px-1 sm:px-2 py-1 text-center">{lbl}</div>
                ))}
            </div>

            {/* Views */}
            {view === "month" ? (
                <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
                    {monthCells.map((day) => {
                        const inCurrentMonth = day.getMonth() === cursorDate.getMonth();
                        const today = isToday(day);
                        return (
                            <div
                                key={day.toISOString()}
                                className={`h-[60px] xs:h-[80px] sm:h-[100px] md:h-[120px] lg:h-[20px] rounded-md p-1 sm:p-2
                                    flex flex-col items-center justify-center
                                    ${today ? "bg-blue-800 text-white border border-blue-600 " : "border-white"}
                                `}
                            >
                                <div className="flex items-center flex-col">
                                    <span className={`text-[10px] sm:text-xs ${inCurrentMonth ? "dark:text-white" : "text-gray-400"}`}>
                                        {day.getDate()}
                                    </span>
                                    {today && (
                                        <>
                                            {/* Small devices: text + dot */}
                                            <span className="inline-flex items-center gap-1 sm:hidden text-[10px] px-2 py-[2px] rounded-full text-white">
                                                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                                Today
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
                    {weekDays.map((day) => {
                        const today = isToday(day);
                        return (
                            <div
                                key={day.toISOString()}
                                className={`h-[80px] sm:h-[150px] md:h-[60px] rounded-md p-1 sm:p-2 ${
                                today ? "border border-blue-600" : "border-gray-200"
                                }`}
                            >
                                <div className="flex items-center flex-col">
                                    <div className={`text-[10px] sm:text-sm font-medium ${today ? "dark:text-white text-blue-600" : "text-gray-800 "}`}>
                                        {day.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                    </div>
                                    {today && (
                                        <>
                                            <span className="flex items-center gap-1 text-[10px] px-2 py-[2px] rounded-full text-white">
                                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                                                Today
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
