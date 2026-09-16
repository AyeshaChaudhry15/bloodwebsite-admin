"use client";

import { useMemo, useState } from "react";
import donorData from "../data/donar.json";

type Donation = {
  id: string;
  date: string;
  bloodGroup: string;
  units: number;
  hospital: string;
  recipientName: string;
  status: string;
  nextEligibleDate: string;
};

type DonationRequest = {
  id: string;
  requestDate: string;
  patientName: string;
  bloodGroup: string;
  city: string;
  hospital: string;
  unitsRequired: number;
  status: string;
  responseDate: string;
  note?: string;
};

type Donor = {
  id: number;
  name: string;
  bloodGroup: string;
  phone: string;
  gmail: string;
  whatsappNo: string;
  city: string;
  educationalSector: "School" | "College" | "University" | "Nill";
  lastDonation: string;
  status: "Available" | "Unavailable";
  age: number;
  gender: string;
  cnic: string;
  registrationDate: string;
  currentAvailability: {
    status: string;
    lastDonation: string;
    nextEligibleDate: string;
    rule: string;
  };
  donationHistory: Donation[];
  bloodDonationRequests: DonationRequest[];
  summary: {
    totalCompletedDonations: number;
    totalUnitsDonated: number;
    totalDonationRequests: number;
    acceptedRequests: number;
    rejectedRequests: number;
    pendingRequests: number;
  };
};

function addThreeMonths(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setMonth(date.getMonth() + 3);
  return date;
}

function formatDate(dateString: string) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAvailability(donor: Donor) {
  const completed = donor.donationHistory.filter(
    (item) => item.status.toLowerCase() === "completed"
  );

  const latestDonation = [...completed].sort(
    (a, b) =>
      new Date(`${b.date}T00:00:00`).getTime() -
      new Date(`${a.date}T00:00:00`).getTime()
  )[0];

  if (!latestDonation) {
    return {
      available: donor.status === "Available",
      lastDonation: "",
      nextEligibleDate: null as Date | null,
    };
  }

  const nextEligibleDate = addThreeMonths(latestDonation.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    available: today >= nextEligibleDate,
    lastDonation: latestDonation.date,
    nextEligibleDate,
  };
}

function getStatusClass(status: string) {
  const value = status.toLowerCase();

  if (value === "available" || value === "completed" || value === "accepted") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (value === "rejected" || value === "unavailable") {
    return "bg-red-50 text-red-600";
  }

  return "bg-amber-50 text-amber-600";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#edf0f4] bg-[#fafbfc] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8993a2]">
        {label}
      </p>
      <p className="mt-1.5 break-words text-[13px] font-semibold text-[#293343]">
        {value || "—"}
      </p>
    </div>
  );
}

function SectionTitle({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[16px] font-bold text-[#172033]">{title}</h2>
      {typeof count === "number" && (
        <span className="rounded-full bg-[#fff0f1] px-3 py-1 text-[11px] font-semibold text-[#c92835]">
          {count}
        </span>
      )}
    </div>
  );
}

export default function DonorProfilePage() {
  const donors = donorData.donors as Donor[];
  const [selectedId, setSelectedId] = useState<number>(donors[0]?.id ?? 0);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"donations" | "requests">(
    "donations"
  );

  const filteredDonors = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return donors;

    return donors.filter(
      (donor) =>
        donor.name.toLowerCase().includes(value) ||
        donor.bloodGroup.toLowerCase().includes(value) ||
        donor.city.toLowerCase().includes(value) ||
        donor.phone.toLowerCase().includes(value) ||
        donor.cnic.toLowerCase().includes(value)
    );
  }, [donors, search]);

  const selectedDonor =
    donors.find((donor) => donor.id === selectedId) || donors[0];

  if (!selectedDonor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] p-6">
        <div className="rounded-2xl border border-[#e5e9f0] bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#172033]">No Donors Found</h1>
          <p className="mt-2 text-sm text-[#788292]">
            Please add donors to donar.json.
          </p>
        </div>
      </main>
    );
  }

  const availability = getAvailability(selectedDonor);
  const lastDonation =
    availability.lastDonation || selectedDonor.lastDonation || "";

  return (
    <main className="min-h-screen bg-[#f7f9fc] p-4 md:p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         

          <button
            onClick={() => window.history.back()}
            className="h-10 rounded-lg border border-[#dfe4eb] bg-white px-5 text-[12px] font-semibold text-[#4c5667] transition hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-2xl border border-[#e5e9f0] bg-white shadow-[0_3px_15px_rgba(20,30,50,0.04)] lg:sticky lg:top-5">
            <div className="border-b border-[#edf0f4] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-[#172033]">
                  All Donors
                </h2>
                <span className="rounded-full bg-[#fff0f1] px-3 py-1 text-[11px] font-semibold text-[#c92835]">
                  {donors.length}
                </span>
              </div>

              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b95a7]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search donor..."
                  className="h-10 w-full rounded-lg border border-[#e2e7ee] bg-white pl-10 pr-3 text-[12px] text-[#273142] outline-none transition focus:border-[#c92835] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-2">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => {
                  const donorAvailability = getAvailability(donor);
                  const isSelected = donor.id === selectedDonor.id;

                  return (
                    <button
                      key={donor.id}
                      onClick={() => {
                        setSelectedId(donor.id);
                        setActiveTab("donations");
                      }}
                      className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                        isSelected
                          ? "bg-[#fff0f1] ring-1 ring-[#f2c5c8]"
                          : "hover:bg-[#fafbfc]"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4b5b9] to-[#d9e1eb] text-[11px] font-bold text-[#6e3440]">
                        {getInitials(donor.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[12px] font-bold text-[#293343]">
                            {donor.name}
                          </p>
                          <span className="shrink-0 text-[11px] font-bold text-[#c92835]">
                            {donor.bloodGroup}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="truncate text-[10px] text-[#8993a2]">
                            {donor.city}
                          </p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              donorAvailability.available
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {donorAvailability.available
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center text-sm text-[#7b8492]">
                  No donors found
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <section className="overflow-hidden rounded-2xl border border-[#e5e9f0] bg-white shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
              <div className="h-2 bg-[#c92835]" />

              <div className="p-5 md:p-7">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4b5b9] to-[#d9e1eb] text-lg font-bold text-[#6e3440]">
                      {getInitials(selectedDonor.name)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[21px] font-bold text-[#172033]">
                          {selectedDonor.name}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                            availability.available
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {availability.available
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      <p className="mt-1 text-[12px] text-[#788292]">
                        Donor ID #{selectedDonor.id} •{" "}
                        {selectedDonor.bloodGroup} Blood Group
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#edf0f4] bg-[#fafbfc] px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8993a2]">
                      Next Eligible Donation
                    </p>

                    <p className="mt-1 text-[15px] font-bold text-[#293343]">
                      {availability.nextEligibleDate
                        ? formatDate(
                            availability.nextEligibleDate
                              .toISOString()
                              .slice(0, 10)
                          )
                        : "Available Now"}
                    </p>

                    <p className="mt-1 text-[10px] text-[#7b8492]">
                      {availability.nextEligibleDate
                        ? availability.available
                          ? "3-month waiting period completed"
                          : "3 months required after last donation"
                        : "No completed donation recorded"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_3px_15px_rgba(20,30,50,0.04)] md:p-6">
              <SectionTitle title="Donor Details" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard label="Name" value={selectedDonor.name} />
                <InfoCard label="GMail" value={selectedDonor.gmail} />
                <InfoCard label="Mobile No" value={selectedDonor.phone} />
                <InfoCard
                  label="Whatsapp No"
                  value={selectedDonor.whatsappNo}
                />
                <InfoCard
                  label="Blood Group"
                  value={selectedDonor.bloodGroup}
                />
                <InfoCard label="City" value={selectedDonor.city} />
                <InfoCard
                  label="Educational Sector"
                  value={selectedDonor.educationalSector}
                />
                <InfoCard
                  label="Age"
                  value={`${selectedDonor.age} years`}
                />
                <InfoCard label="Gender" value={selectedDonor.gender} />
                <InfoCard label="CNIC" value={selectedDonor.cnic} />
                <InfoCard
                  label="Registration Date"
                  value={formatDate(selectedDonor.registrationDate)}
                />
                <InfoCard
                  label="Last Blood Donation"
                  value={formatDate(lastDonation)}
                />
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_3px_15px_rgba(20,30,50,0.04)] md:p-6">
              <SectionTitle title="Donation Availability" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#edf0f4] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8993a2]">
                    Current Status
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-[11px] font-bold ${
                        availability.available
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {availability.available
                        ? "Available to Donate"
                        : "Currently Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#edf0f4] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8993a2]">
                    Last Donation
                  </p>
                  <p className="mt-3 text-[15px] font-bold text-[#293343]">
                    {formatDate(lastDonation)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#edf0f4] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8993a2]">
                    Eligible Again
                  </p>
                  <p className="mt-3 text-[15px] font-bold text-[#293343]">
                    {availability.nextEligibleDate
                      ? formatDate(
                          availability.nextEligibleDate
                            .toISOString()
                            .slice(0, 10)
                        )
                      : "Available Now"}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
                <p className="text-[10px] font-semibold uppercase text-[#8993a2]">
                  Total Donations
                </p>
                <p className="mt-2 text-2xl font-bold text-[#172033]">
                  {selectedDonor.summary.totalCompletedDonations}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
                <p className="text-[10px] font-semibold uppercase text-[#8993a2]">
                  Units Donated
                </p>
                <p className="mt-2 text-2xl font-bold text-[#172033]">
                  {selectedDonor.summary.totalUnitsDonated}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
                <p className="text-[10px] font-semibold uppercase text-[#8993a2]">
                  Donation Requests
                </p>
                <p className="mt-2 text-2xl font-bold text-[#172033]">
                  {selectedDonor.summary.totalDonationRequests}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
                <p className="text-[10px] font-semibold uppercase text-[#8993a2]">
                  Accepted Requests
                </p>
                <p className="mt-2 text-2xl font-bold text-[#172033]">
                  {selectedDonor.summary.acceptedRequests}
                </p>
              </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-[#e5e9f0] bg-white shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
              <div className="border-b border-[#edf0f4] p-5 md:p-6">
                <SectionTitle title="Blood Activity" />

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("donations")}
                    className={`rounded-lg px-4 py-2 text-[11px] font-semibold ${
                      activeTab === "donations"
                        ? "bg-[#c92835] text-white"
                        : "border border-[#dfe4eb] text-[#596474]"
                    }`}
                  >
                    Donation History
                  </button>

                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`rounded-lg px-4 py-2 text-[11px] font-semibold ${
                      activeTab === "requests"
                        ? "bg-[#c92835] text-white"
                        : "border border-[#dfe4eb] text-[#596474]"
                    }`}
                  >
                    Blood Requests
                  </button>
                </div>
              </div>

              {activeTab === "donations" ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#edf0f4] bg-[#fafbfc]">
                        {[
                          "Donation ID",
                          "Date",
                          "Blood Group",
                          "Units",
                          "Hospital",
                          "Recipient",
                          "Status",
                          "Eligible Again",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-[#657081]"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {selectedDonor.donationHistory.length > 0 ? (
                        selectedDonor.donationHistory.map((donation) => (
                          <tr
                            key={donation.id}
                            className="border-b border-[#edf0f4] hover:bg-[#fafbfc]"
                          >
                            <td className="px-5 py-4 text-[12px] font-semibold text-[#293343]">
                              {donation.id}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {formatDate(donation.date)}
                            </td>
                            <td className="px-5 py-4 text-[12px] font-semibold text-[#c92835]">
                              {donation.bloodGroup}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {donation.units}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {donation.hospital || "—"}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {donation.recipientName || "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-semibold ${getStatusClass(
                                  donation.status
                                )}`}
                              >
                                {donation.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-[12px] font-semibold text-[#4d5868]">
                              {formatDate(donation.nextEligibleDate)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-5 py-12 text-center text-sm text-[#7b8492]"
                          >
                            No donation history found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#edf0f4] bg-[#fafbfc]">
                        {[
                          "Request ID",
                          "Request Date",
                          "Patient",
                          "Blood Group",
                          "City",
                          "Hospital",
                          "Units",
                          "Status",
                          "Response Date",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wide text-[#657081]"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {selectedDonor.bloodDonationRequests.length > 0 ? (
                        selectedDonor.bloodDonationRequests.map((request) => (
                          <tr
                            key={request.id}
                            className="border-b border-[#edf0f4] hover:bg-[#fafbfc]"
                          >
                            <td className="px-5 py-4 text-[12px] font-semibold text-[#293343]">
                              {request.id}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {formatDate(request.requestDate)}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              <div className="font-semibold text-[#293343]">
                                {request.patientName}
                              </div>
                              {request.note && (
                                <div className="mt-1 max-w-[220px] text-[10px] text-[#8993a2]">
                                  {request.note}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 text-[12px] font-semibold text-[#c92835]">
                              {request.bloodGroup}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {request.city}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {request.hospital || "—"}
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {request.unitsRequired}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-semibold ${getStatusClass(
                                  request.status
                                )}`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-[12px] text-[#4d5868]">
                              {formatDate(request.responseDate)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-5 py-12 text-center text-sm text-[#7b8492]"
                          >
                            No blood donation requests found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
