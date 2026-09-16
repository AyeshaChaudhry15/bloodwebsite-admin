"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Settings,
  UserRound,
  Users,
  X,
  Droplets,
  Activity,
  MapPin,
  CircleUserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const stats = [
  {
    title: "Total Donors",
    value: "1,248",
    change: "12%",
    label: "Registered donors",
    positive: true,
    icon: Users,
    iconClass: "bg-red-50 text-red-500",
  },
  {
    title: "Blood Requests",
    value: "86",
    change: "5%",
    label: "This month",
    positive: false,
    icon: Droplets,
    iconClass: "bg-red-50 text-red-500",
  },
  {
    title: "Volunteers",
    value: "312",
    change: "18%",
    label: "Active volunteers",
    positive: true,
    icon: Users,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    title: "Lives Saved",
    value: "2,430",
    change: "15%",
    label: "Through our platform",
    positive: true,
    icon: Heart,
    iconClass: "bg-red-50 text-red-500",
  },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Find Donors", icon: MapPin, href: "/find-donors" },
  { name: "Blood Requests", icon: Droplets, href: "/blood-request" },
  { name: "Donors", icon: UserRound, href: "/donors" },
  { name: "Volunteers", icon: Users, href: "/admin/volunteers" },
  { name: "Users", icon: CircleUserRound, href: "/admin/users" },
  { name: "Events", icon: CalendarDays, href: "/admin/event" },
  { name: "Blogs", icon: FileText, href: "/admin/blogs" },
  { name: "Pages", icon: ClipboardList, href: "/admin/pages" },
  { name: "Announcements", icon: Activity, href: "/admin/announcements" },
  { name: "Reports", icon: FileText, href: "/admin/reports" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

const bloodGroups = [
  { group: "A+", value: 230 },
  { group: "A-", value: 95 },
  { group: "B+", value: 155 },
  { group: "B-", value: 115 },
  { group: "O+", value: 360 },
  { group: "O-", value: 80 },
  { group: "AB+", value: 130 },
  { group: "AB-", value: 75 },
];

const requests = [
  {
    name: "Ali Raza",
    blood: "O+",
    location: "Bahawalpur",
    status: "Urgent",
  },
  {
    name: "Sana Khan",
    blood: "A-",
    location: "Lahore",
    status: "Pending",
  },
  {
    name: "Bilal Ahmed",
    blood: "B+",
    location: "Multan",
    status: "Fulfilled",
  },
  {
    name: "Ayesha Malik",
    blood: "AB+",
    location: "Karachi",
    status: "Pending",
  },
  {
    name: "Hassan Raza",
    blood: "O-",
    location: "Islamabad",
    status: "Urgent",
  },
];

const donors = [
  {
    name: "Muhammad Usman",
    blood: "O+",
    city: "Bahawalpur",
    date: "Sep 15, 2025",
  },
  {
    name: "Ayesha Khan",
    blood: "A+",
    city: "Lahore",
    date: "Sep 14, 2025",
  },
  {
    name: "Bilal Ahmed",
    blood: "B-",
    city: "Multan",
    date: "Sep 14, 2025",
  },
  {
    name: "Fatima Noor",
    blood: "AB+",
    city: "Karachi",
    date: "Sep 13, 2025",
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const active =
    navItems.find((item) => item.href === pathname)?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#172033]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[238px] flex-col bg-[#122333] text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[72px] shrink-0 items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500">
              <Droplets size={21} fill="white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">PWS</h1>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-md transition ${
                  isActive
                    ? "bg-[#e9232e] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <button className="flex items-center gap-3 text-md text-gray-300 hover:text-white">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[238px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-5 lg:px-7">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                className="h-10 w-[260px] rounded-lg bg-[#f5f7fa] pl-9 pr-3 text-md outline-none placeholder:text-gray-400"
              />

              <svg
                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1 8 8Z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-gray-500">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                <UserRound size={18} className="text-gray-500" />
              </div>

              <div className="hidden sm:block">
                <p className="text-md font-semibold">Admin</p>
              </div>

              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>

              <p className="mt-1 text-md text-gray-500">
                Welcome back! Here's what's happening today.
              </p>
            </div>

            <button className="flex h-10 items-center gap-2 self-start rounded-md border border-gray-200 bg-white px-3 text-md text-gray-600 shadow-sm sm:self-auto">
              <CalendarDays size={16} />
              <span>Sep 16, 2025</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconClass}`}
                      >
                        <Icon size={20} />
                      </div>

                      <p className="text-md font-medium text-gray-500">
                        {stat.title}
                      </p>
                    </div>

                    <MoreHorizontal size={18} className="text-gray-300" />
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>

                    <span
                      className={`mb-1 text-sm font-semibold ${
                        stat.positive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      ↑ {stat.change}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_1fr]">
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-md font-bold">
                  Blood Group Distribution
                </h3>

                <button className="text-sm text-red-500">
                  View Report
                </button>
              </div>

              <div className="flex h-[205px] gap-3">
                <div className="flex flex-col justify-between pb-6 pt-1 text-sm text-gray-400">
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>

                <div className="relative flex flex-1 items-end justify-around gap-2 border-b border-gray-200 pb-6">
                  <div className="absolute inset-x-0 top-0 flex h-full flex-col justify-between pb-6">
                    <span className="border-t border-gray-100" />
                    <span className="border-t border-gray-100" />
                    <span className="border-t border-gray-100" />
                    <span className="border-t border-gray-100" />
                    <span className="border-t border-gray-100" />
                  </div>

                  {bloodGroups.map((item) => (
                    <div
                      key={item.group}
                      className="relative z-10 flex h-full flex-1 items-end justify-center"
                    >
                      <div
                        className="w-full max-w-[18px] rounded-t-sm bg-[#ed4a50]"
                        style={{
                          height: `${(item.value / 400) * 165}px`,
                        }}
                      />

                      <span className="absolute -bottom-5 text-sm text-gray-500">
                        {item.group}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-md font-bold">
                  Recent Blood Requests
                </h3>

                <Link
                  href="/admin/blood-requests"
                  className="text-sm font-medium text-red-500"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-400">
                      <th className="pb-2 font-medium">Patient Name</th>
                      <th className="pb-2 font-medium">Blood Group</th>
                      <th className="pb-2 font-medium">Location</th>
                      <th className="pb-2 text-right font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((request) => (
                      <tr
                        key={request.name}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-3 text-sm font-medium">
                          {request.name}
                        </td>

                        <td className="py-3 text-sm text-gray-500">
                          {request.blood}
                        </td>

                        <td className="py-3 text-sm text-gray-500">
                          {request.location}
                        </td>

                        <td className="py-3 text-right">
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              request.status === "Urgent"
                                ? "bg-red-50 text-red-500"
                                : request.status === "Pending"
                                  ? "bg-orange-50 text-orange-500"
                                  : "bg-green-50 text-green-600"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.5fr]">
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-md font-bold">Recent Donors</h3>

                <Link
                  href="/admin/donors"
                  className="text-sm font-medium text-red-500"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-400">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Blood Group</th>
                      <th className="pb-2 font-medium">City</th>
                      <th className="pb-2 text-right font-medium">
                        Registered On
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {donors.map((donor, index) => (
                      <tr
                        key={donor.name}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                index % 2 === 0
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {donor.name.charAt(0)}
                            </div>

                            <span className="text-sm font-medium">
                              {donor.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 text-sm text-gray-500">
                          {donor.blood}
                        </td>

                        <td className="py-3 text-sm text-gray-500">
                          {donor.city}
                        </td>

                        <td className="py-3 text-right text-sm text-gray-500">
                          {donor.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="relative min-h-[190px] overflow-hidden rounded-lg bg-[#d7192a] p-6 text-white shadow-sm">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

              <div className="absolute right-5 top-8">
                <Heart
                  size={47}
                  fill="white"
                  strokeWidth={0}
                  className="opacity-90"
                />
              </div>

              <div className="relative z-10 max-w-[220px] pt-17">
                <h3 className="text-3xl font-bold">
                  Together
                  <br />
                  We Save Lives
                </h3>

                <p className="mt-4 text-md leading-5 text-white/80">
                  Manage donors, requests and make a bigger impact.
                </p>
              </div>

              <div className="absolute bottom-4 right-5">
                <Droplets size={38} fill="white" strokeWidth={0} />
              </div>

              <div className="absolute bottom-[-35px] right-[-20px] h-28 w-28 rounded-full bg-white/10" />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}