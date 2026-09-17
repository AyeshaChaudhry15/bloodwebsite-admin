"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  MapPin,
  Users,
  X,
  Image as ImageIcon,
} from "lucide-react";

type EventStatus = "Upcoming" | "Past";
type TabType = "All" | "Upcoming" | "Past";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  category: string;
  image: string;
  description: string;
  status: EventStatus;
}

interface EventForm {
  title: string;
  date: string;
  location: string;
  organizer: string;
  category: string;
  image: string;
  description: string;
  status: EventStatus;
}

const initialEvents: Event[] = [
  {
    id: 7,
    title: "Community Blood Drive",
    date: "Apr 26, 2025",
    location: "City Hospital, Lahore",
    organizer: "Health Foundation",
    category: "Blood Donation Camps",
    image: "/event-1.jfif",
    description:
      "Join us for a community blood donation drive and help save lives.",
    status: "Past",
  },
  {
    id: 2,
    title: "World Blood Donor Day Camp",
    date: "Jun 14, 2025",
    location: "Jinnah Convention Center, Karachi",
    organizer: "Blood Care Pakistan",
    category: "Blood Donation Camps",
    image: "/event-2.jfif",
    description:
      "A special blood donation campaign organized to encourage voluntary blood donation.",
    status: "Past",
  },
  {
    id: 3,
    title: "Emergency Blood Donation Camp",
    date: "Aug 22, 2025",
    location: "General Hospital, Islamabad",
    organizer: "Life Savers Foundation",
    category: "Emergency Camps",
    image: "/event-3.jfif",
    description:
      "Emergency blood donation camp for patients and families in need.",
    status: "Past",
  },
  {
    id: 4,
    title: "Blood Donation Camp",
    date: "Oct 10, 2024",
    location: "Lahore, Pakistan",
    organizer: "Blood Care Foundation",
    category: "Blood Donation Camps",
    image: "/event-4.jfif",
    description:
      "A community blood donation camp organized to support patients in need.",
    status: "Past",
  },
  {
    id: 5,
    title: "Community Blood Donation Drive",
    date: "Nov 18, 2024",
    location: "Karachi, Pakistan",
    organizer: "Blood Donors Society",
    category: "Blood Donation Camps",
    image: "/event-5.jfif",
    description:
      "Community members came together to donate blood and support those in need.",
    status: "Past",
  },
  {
    id: 6,
    title: "Mega Blood Donation Camp",
    date: "Mar 12, 2025",
    location: "Islamabad, Pakistan",
    organizer: "Life Savers Pakistan",
    category: "Blood Donation Camps",
    image: "/event-6.jfif",
    description:
      "A large-scale blood donation event bringing donors and volunteers together.",
    status: "Past",
  },
  {
    id: 1,
    title: "Upcoming Blood Donation Camp",
    date: "Oct 25, 2026",
    location: "Islamabad, Pakistan",
    organizer: "Life Savers Pakistan",
    category: "Blood Donation Camps",
    image: "/blood-drive.jfif",
    description:
      "Join our upcoming blood donation camp and help save lives through your valuable donation.",
    status: "Upcoming",
  },
];

const emptyForm: EventForm = {
  title: "",
  date: "",
  location: "",
  organizer: "",
  category: "Blood Donation Camps",
  image: "",
  description: "",
  status: "Upcoming",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [form, setForm] = useState<EventForm>({ ...emptyForm });

  const openAddModal = (): void => {
    setEditingEvent(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (event: Event): void => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      date: event.date,
      location: event.location,
      organizer: event.organizer,
      category: event.category,
      image: event.image,
      description: event.description,
      status: event.status,
    });
    setShowModal(true);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter event title.");
      return;
    }

    if (!form.date.trim()) {
      alert("Please enter event date.");
      return;
    }

    if (!form.location.trim()) {
      alert("Please enter event location.");
      return;
    }

    if (!form.organizer.trim()) {
      alert("Please enter organizer name.");
      return;
    }

    if (!form.image.trim()) {
      alert("Please enter image path.");
      return;
    }

    if (editingEvent) {
      setEvents((previous) =>
        previous.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                ...form,
              }
            : event,
        ),
      );
    } else {
      const newEvent: Event = {
        id: Date.now(),
        title: form.title,
        date: form.date,
        location: form.location,
        organizer: form.organizer,
        category: form.category,
        image: form.image,
        description: form.description,
        status: form.status,
      };

      setEvents((previous) => [newEvent, ...previous]);
    }

    setShowModal(false);
    setEditingEvent(null);
    setForm({ ...emptyForm });
  };

  const deleteEvent = (id: number): void => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) return;

    setEvents((previous) => previous.filter((event) => event.id !== id));
  };

  const filteredEvents: Event[] = events.filter((event) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      event.title.toLowerCase().includes(searchText) ||
      event.location.toLowerCase().includes(searchText) ||
      event.organizer.toLowerCase().includes(searchText) ||
      event.category.toLowerCase().includes(searchText);

    const matchesTab = activeTab === "All" || event.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const upcomingEvent: Event | undefined = events.find(
    (event) => event.status === "Upcoming",
  );

  const totalEvents = events.length;

  const upcomingCount = events.filter(
    (event) => event.status === "Upcoming",
  ).length;

  const pastCount = events.filter((event) => event.status === "Past").length;

  return (
    <main className="min-h-screen bg-[#f6f8fa] p-5 md:p-8 lg:p-10">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={() => window.history.back()}
          className="h-10 rounded-lg border border-[#dfe4eb] bg-white px-5 text-[12px] font-semibold text-[#4c5667] transition hover:bg-gray-50"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold text-[#173653] md:text-5xl">
            Events
          </h1>

          <p className="mt-2 text-md text-gray-500">
            Manage your upcoming and past blood donation events.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#e51e3e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c91835]"
        >
          <Plus size={18} />
          Add New Event
        </button>
      </div>

      {upcomingEvent && (
        <div className="mb-8 overflow-hidden rounded-2xl bg-[#173653] shadow-sm">
          <div className="grid md:grid-cols-[300px_1fr]">
            <div className="h-60 md:h-full">
              <img
                src={upcomingEvent.image}
                alt={upcomingEvent.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8">
              <span className="inline-flex rounded-full bg-[#e51e3e] px-4 py-1.5 text-xs font-bold text-white">
                Upcoming Event
              </span>

              <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                {upcomingEvent.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                {upcomingEvent.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-[#ff7187]" />
                  <span>{upcomingEvent.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#ff7187]" />
                  <span>{upcomingEvent.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={17} className="text-[#ff7187]" />
                  <span>{upcomingEvent.organizer}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Events</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold text-[#173653]">{totalEvents}</p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4f8]">
              <CalendarDays size={21} className="text-[#173653]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Upcoming Events</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold text-[#e51e3e]">{upcomingCount}</p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f2]">
              <CalendarDays size={21} className="text-[#e51e3e]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Past Events</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold text-[#173653]">{pastCount}</p>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4f8]">
              <CalendarDays size={21} className="text-[#173653]" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["All", "Upcoming", "Past"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#e51e3e] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white px-3 md:max-w-xs">
            <Search size={18} className="shrink-0 text-gray-400" />

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Event
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Organizer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-gray-600">
                      No events found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try another search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event: Event) => (
                  <tr
                    key={event.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-14 w-20 rounded-lg object-cover"
                        />

                        <div>
                          <p className="font-semibold text-[#173653]">
                            {event.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {event.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-[#e51e3e]"
                        />
                        {event.date}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="shrink-0 text-[#e51e3e]" />
                        {event.location}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} className="shrink-0 text-[#e51e3e]" />
                        {event.organizer}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.status === "Upcoming"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(event)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                          title="Edit Event"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5 md:p-6">
              <div>
                <h2 className="text-xl font-bold text-[#173653]">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingEvent
                    ? "Update event information."
                    : "Add a new event to your website."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 md:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Event Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Community Blood Drive"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Event Date
                  </label>

                  <input
                    type="text"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    placeholder="Oct 25, 2026"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City Hospital, Lahore"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Organizer
                  </label>

                  <input
                    type="text"
                    name="organizer"
                    value={form.organizer}
                    onChange={handleChange}
                    placeholder="Health Foundation"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e]"
                  >
                    <option value="Blood Donation Camps">
                      Blood Donation Camps
                    </option>

                    <option value="Awareness Campaigns">
                      Awareness Campaigns
                    </option>

                    <option value="Emergency Camps">Emergency Camps</option>

                    <option value="Community Events">Community Events</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e]"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Past">Past</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#173653]">
                    <ImageIcon size={16} />
                    Image Path
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="/event-1.jfif"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e] placeholder:text-gray-400"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Example: /event-1.jfif
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#173653]">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write event description..."
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#e51e3e] focus:ring-1 focus:ring-[#e51e3e] placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#e51e3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c91835]"
                >
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
