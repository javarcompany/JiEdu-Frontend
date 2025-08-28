import { useState, useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg, DateInput } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";

import axios from "axios";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";

const colorMap: Record<string, string> = {
	danger: "bg-red-500 text-white",
	success: "bg-green-500 text-white",
	primary: "bg-blue-500 text-white",
	warning: "bg-yellow-500 text-black",
};

// Utility function to format for datetime-local
const formatDateTimeLocal = (dateInput: DateInput): string => {
	if (!dateInput) return "";

	// Normalize DateInput into a Date
	const date = typeof dateInput === "string" || typeof dateInput === "number"
	? new Date(dateInput)
	: dateInput instanceof Date
	? dateInput
	: null;

	if (!date) return "";

	const pad = (n: number) => n.toString().padStart(2, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

interface CalendarEvent extends EventInput {
  id?: string;
  extendedProps: {
    calendar: string;
    description?: string;
    location?: string;
    isHoliday?: boolean;
  };
}

interface CalendarProps {
  user_regno: string;
  user_type: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const Calendar: React.FC<CalendarProps> = ({ user_regno, user_type, setReload }) => {

	const token = localStorage.getItem("access");
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

	const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_datetime: "",
        end_datetime: "",
        is_all_day: false,
        location: "",
		level: "primary"
    });

	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const calendarRef = useRef<FullCalendar>(null);
	const { isOpen, openModal, closeModal } = useModal();

	const [added, setAdded] = useState<boolean>(true);

	const calendarsEvents = {
		Danger: "danger",
		Success: "success",
		Primary: "primary",
		Warning: "warning",
	};

	const fetchEvents = useCallback(
		debounce(async () => {
			try {
				const userEvents = await axios.get(`/api/get-user-events/`, {
						headers: { Authorization: `Bearer ${token}` },
						params: { user_regno, user_type },
					});
				const mappedUserEvents = userEvents.data.map((ev: any) => ({
					id: ev.id.toString() || crypto.randomUUID(),
					title: ev.title,
					start: ev.start_datetime,
					end: ev.end_datetime,
					allDay: ev.is_all_day ?? false,
					extendedProps: {
						calendar: ev.level || "Primary",
						description: ev.description,
						location: ev.location,
						isHoliday: false,
					},
				}));

				setEvents([...mappedUserEvents]);
			} catch (error) {
				console.error("Failed to fetch Events", error);
			} 
		}, 300),
		[user_regno, user_type, token]
	);

	useEffect(() => {
		fetchEvents();
		return () => fetchEvents.cancel();
	}, [added, fetchEvents]);

	// ---------------- EVENT CLICK ----------------
	const handleEventClick = (clickInfo: EventClickArg) => {
		const event = clickInfo.event as unknown as CalendarEvent;
		setSelectedEvent(event);

		// Only set form data for editable (non-holiday) events
		if (!event.extendedProps?.isHoliday) {
			setFormData({
				title: event.title || "",
				description: event.extendedProps?.description || "",
				start_datetime: event.start ? formatDateTimeLocal(event.start) : "",
				end_datetime: event.end ? formatDateTimeLocal(event.end) : "",
				is_all_day: event.allDay || false,
				location: event.extendedProps?.location || "",
				level: event.extendedProps?.calendar || "Primary",
			});
		}
		openModal();
	};

	const handleDateSelect = (selectInfo: DateSelectArg) => { 
		resetModalFields(); 
		setFormData({
			title: "",
			description: "",
			start_datetime: selectInfo.startStr,
			end_datetime: selectInfo.endStr || selectInfo.startStr,
			is_all_day: false,
			location: "",
			level: "primary"
		});
		openModal();
	};

	const handleAddOrUpdateEvent = () => {
		if (!selectedEvent) {
			// Add
			if (user_type === "staff"){
				axios.post(`/api/events/`, 
					{
						...formData,
						staff_regno: user_regno
					}, 
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				).then(() => {
					Swal.fire("Event Added", "The event has been added successfully!", "success");
					setAdded(!added);
					closeModal();
				});
			}else{
				axios.post(`/api/events/`, 
					{
						...formData,
						student_regno: user_regno
					}, 
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				).then(() => {
					Swal.fire("Event Added", "The event has been added successfully!", "success");
					setAdded(!added);
					closeModal();
				});
			}
		} else if (!selectedEvent.extendedProps.isHoliday) {
			// Update only if not holiday
			axios.put(`/api/events/${selectedEvent.id}/`, formData, {
				headers: { Authorization: `Bearer ${token}` },
				})
				.then(() => {
					Swal.fire("Event Updated", "The event has been updated successfully!", "success");
					setAdded(!added);
					closeModal();
			});
		}
		setReload(prev => !prev); // Trigger reload in parent component
	};

	const resetModalFields = () => {
		setFormData({
			title : "", description:"",
			start_datetime : "", end_datetime : "",
			is_all_day : false, location : "", level : "Primary"
		})
		setSelectedEvent(null);
	};

	// ---------------- HANDLE FORM CHANGE ----------------
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, type, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleCloseModal = () => {
		closeModal();
		resetModalFields();
	};

	return (
		<>
			<PageMeta
				title="Calendar Dashboard | JiEdu - Events/ Event Planning"
				description="This is Calendar Dashboard page for JiEdu - systems"
			/>

			<div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="custom-calendar">
					<FullCalendar
						ref={calendarRef}

						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

						initialView="dayGridMonth"
						
						headerToolbar={{
							left: "prev,next addEventButton",
							center: "title",
							right: "dayGridMonth,timeGridWeek,timeGridDay",
						}}

						events={events}

						selectable={true}

						select={handleDateSelect}
						
						eventClick={handleEventClick}

						eventContent={renderEventContent}

						customButtons={{
							addEventButton: {
								text: "Add Event +",
								click: openModal,
							},
						}}
					/>
				</div>

				<Modal
					isOpen={isOpen}
					onClose={handleCloseModal}
					className="max-w-[700px] p-6 lg:p-10"
				>
					<div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
						<div>
							<h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
								{selectedEvent ? "Edit Event" : "Add Event"}
							</h5>

							<p className="text-sm text-gray-500 dark:text-gray-400">
								Plan your next big moment: schedule or edit an event to stay on
								track
							</p>
						</div>

						<div className="mt-8">
							<div>
								<div>
									<Label>Title</Label>
									<Input
										id="event-title"
										type="text"
										name="title"
										value={formData.title}
										onChange={handleChange}
										className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									/>
								</div>
							</div>

							<div className="mt-6">
								<Label>Event Color</Label>
								<div className="flex flex-wrap items-center gap-4 sm:gap-5">
									{Object.entries(calendarsEvents).map(([key, value]) => {
										const colorClasses = colorMap[value]; // already full tailwind class
										return (
											<div key={value} className="n-chk">
												<div className="form-check form-check-inline">
													<label
														className="flex items-center text-sm text-gray-700 dark:text-gray-400 cursor-pointer"
														htmlFor={`modal${value}`}
													>
													<input
														className="sr-only"
														type="radio"
														name="level"
														value={value}
														id={`modal${value}`}
														checked={formData.level === value}
														onChange={handleChange}
													/>
													<span
														className={`flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full dark:border-gray-700 
														${formData.level === value ? colorClasses : ""}`}
													>
														<span
															className={`h-2 w-2 rounded-full bg-white ${
																formData.level === value ? "block" : "hidden"
															}`}
														/>
													</span>
													{key}
													</label>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							<div className="mt-6">
								<div>
									<Label>Description</Label>
									<Input
										id="event-description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									/>
								</div>
							</div>

							<div className="mt-6">
								<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
									Start Date
								</label>

								<div className="relative">
									<input
										id="event-start-date"
										type="datetime-local"
										name="start_datetime"
										value={formData.start_datetime ? formatDateTimeLocal(formData.start_datetime) : ""}
										onChange={handleChange}
										className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									/>
								</div>
							</div>

							<div className="mt-6">
								<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
									End Date
								</label>
								<div className="relative">
									<input
										id="event-end-date"
										type="datetime-local"
										name="end_datetime"
										value={formData.end_datetime ? formatDateTimeLocal(formData.end_datetime) : ""}
										onChange={handleChange}
										className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									/>
								</div>
							</div>

							<div className="mt-6">
								<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
									Venue
								</label>
								<div className="relative">
									<input
										id="event-location"
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
							{selectedEvent && (
								<button
									onClick={() => {
									axios.delete(`/api/events/${selectedEvent.id}/`, {
										headers: { Authorization: `Bearer ${token}` }
									}).then(() => {
										Swal.fire({ title: "Event Deleted", text: "The event has been removed.", icon: "success" });
										setAdded(!added);
										closeModal();
									});
									}}
									type="button"
									className="flex w-full justify-center rounded-lg border border-red-300 bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 sm:w-auto"
								>
									Delete
								</button>
							)}

							<button
								onClick={handleCloseModal}
								type="button"
								className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
								>
								Close
							</button>

							<button
								onClick={handleAddOrUpdateEvent}
								type="button"
								className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
							>
								{selectedEvent ? "Update Changes" : "Add Event"}
							</button>
						</div>
					</div>
				</Modal>
			</div>
		</>
	);
};

const renderEventContent = (eventInfo: any) => {
	const level = eventInfo.event.extendedProps.calendar?.toLowerCase() || "primary";
	const colorClass = colorMap[level] || "bg-gray-500 text-white";
	return (
		<div className={`flex fc-event-main ${colorClass} p-1 rounded-sm`}>
			<div className="fc-daygrid-event-dot"></div>
			<div className="fc-event-time">{eventInfo.timeText}</div>
			<div className="fc-event-title truncate">{eventInfo.event.title}</div>
		</div>
	);
};

export default Calendar;
