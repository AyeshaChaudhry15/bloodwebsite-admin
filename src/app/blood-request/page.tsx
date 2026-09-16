"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  X,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import bloodRequestsData from "../data/donar.json";

type RequestStatus =
  | "Pending"
  | "Urgent"
  | "Fulfilled"
  | "Canceled";

interface BloodRequest {
  id: number;
  patientName: string;
  bloodGroup: string;
  hospital: string;
  location: string;
  requiredUnits: number;
  status: RequestStatus;
  date: string;
}

const tabs = [
  "All",
  "Pending",
  "Urgent",
  "Fulfilled",
  "Canceled",
] as const;

type Tab = (typeof tabs)[number];

export default function BloodRequests() {
const [requests, setRequests] =
  useState<BloodRequest[]>(bloodRequestsData.bloodRequests as BloodRequest[]);
  
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [newRequest, setNewRequest] = useState({
    patientName: "",
    bloodGroup: "O+",
    hospital: "",
    location: "",
    requiredUnits: 1,
    status: "Pending" as RequestStatus,
  });

  const counts = useMemo(() => {
    return {
      All: requests.length,
      Pending: requests.filter((r) => r.status === "Pending").length,
      Urgent: requests.filter((r) => r.status === "Urgent").length,
      Fulfilled: requests.filter((r) => r.status === "Fulfilled").length,
      Canceled: requests.filter((r) => r.status === "Canceled").length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesTab =
        activeTab === "All" || request.status === activeTab;

      const searchText = search.toLowerCase();

      const matchesSearch =
        request.patientName.toLowerCase().includes(searchText) ||
        request.bloodGroup.toLowerCase().includes(searchText) ||
        request.hospital.toLowerCase().includes(searchText) ||
        request.location.toLowerCase().includes(searchText) ||
        request.status.toLowerCase().includes(searchText);

      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, search]);

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newRequest.patientName ||
      !newRequest.hospital ||
      !newRequest.location
    ) {
      return;
    }

    const request: BloodRequest = {
      id: Date.now(),
      patientName: newRequest.patientName,
      bloodGroup: newRequest.bloodGroup,
      hospital: newRequest.hospital,
      location: newRequest.location,
      requiredUnits: Number(newRequest.requiredUnits),
      status: newRequest.status,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setRequests((prev) => [request, ...prev]);

    setNewRequest({
      patientName: "",
      bloodGroup: "O+",
      hospital: "",
      location: "",
      requiredUnits: 1,
      status: "Pending",
    });

    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );
    setOpenMenu(null);
  };

  const changeStatus = (
    id: number,
    status: RequestStatus
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );

    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-[320px]">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d91f2b] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd1722] active:scale-[0.98]"
          >
            <Plus size={19} />
            Add Request
          </button>
        </div>

        <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-7 py-5 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-[#d91f2b]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab} ({counts[tab]})

                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-t-full bg-[#d91f2b]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#fbfcfd]">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Patient Name
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Blood Group
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Hospital
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Required Units
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {request.patientName}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-700">
                          {request.bloodGroup}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.hospital}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.location}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {request.requiredUnits}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.date}
                      </td>

                      <td className="relative px-5 py-4 text-center">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === request.id
                                ? null
                                : request.id
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {openMenu === request.id && (
                          <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-xl">
                            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Change Status
                            </p>

                            <button
                              onClick={() =>
                                changeStatus(
                                  request.id,
                                  "Pending"
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Clock3 size={16} />
                              Pending
                            </button>

                            <button
                              onClick={() =>
                                changeStatus(
                                  request.id,
                                  "Urgent"
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <AlertCircle size={16} />
                              Urgent
                            </button>

                            <button
                              onClick={() =>
                                changeStatus(
                                  request.id,
                                  "Fulfilled"
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle2 size={16} />
                              Fulfilled
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={() =>
                                handleDelete(request.id)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Search
                            size={22}
                            className="text-slate-400"
                          />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-700">
                          No requests found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Add Blood Request
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Create a new blood request.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddRequest}
              className="space-y-4 p-6"
            >
              <Input
                label="Patient Name"
                placeholder="Enter patient name"
                value={newRequest.patientName}
                onChange={(value) =>
                  setNewRequest({
                    ...newRequest,
                    patientName: value,
                  })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blood Group
                </label>

                <select
                  value={newRequest.bloodGroup}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      bloodGroup: e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              <Input
                label="Hospital"
                placeholder="Enter hospital name"
                value={newRequest.hospital}
                onChange={(value) =>
                  setNewRequest({
                    ...newRequest,
                    hospital: value,
                  })
                }
              />

              <Input
                label="Location"
                placeholder="Enter city"
                value={newRequest.location}
                onChange={(value) =>
                  setNewRequest({
                    ...newRequest,
                    location: value,
                  })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Required Units
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={newRequest.requiredUnits}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        requiredUnits: Number(e.target.value),
                      })
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    value={newRequest.status}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        status: e.target.value as RequestStatus,
                      })
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#d91f2b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#bd1722]"
                >
                  Add Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: RequestStatus;
}) {
  const styles: Record<RequestStatus, string> = {
    Urgent: "bg-red-100 text-red-600",
    Pending: "bg-amber-100 text-amber-700",
    Fulfilled: "bg-emerald-100 text-emerald-700",
    Canceled: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}