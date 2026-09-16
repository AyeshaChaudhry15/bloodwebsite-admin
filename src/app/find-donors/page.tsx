"use client";

import { useMemo, useState } from "react";
import donorsData from "../data/donar.json";

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
};

type FilterState = {
  search: string;
  bloodGroup: string;
  city: string;
  status: string;
  donation: string;
};

const PAGE_SIZE = 8;

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>(donorsData.donors as Donor[]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    bloodGroup: "All",
    city: "All",
    status: "All",
    donation: "All"
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [viewDonor, setViewDonor] = useState<Donor | null>(null);
  const [editDonor, setEditDonor] = useState<Donor | null>(null);

  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const cities = [
    "All",
    "Bahawalpur",
    "Lahore",
    "Multan",
    "Karachi",
    "Islamabad",
    "Faisalabad",
    "Rawalpindi",
    "Sialkot"
  ];

  const filteredDonors = useMemo(() => {
    const search = filters.search.toLowerCase().trim();

    return donors.filter((donor) => {
      const matchesSearch =
        !search ||
        donor.name.toLowerCase().includes(search) ||
        donor.phone.toLowerCase().includes(search) ||
        donor.gmail.toLowerCase().includes(search) ||
        donor.whatsappNo.toLowerCase().includes(search) ||
        donor.cnic.toLowerCase().includes(search);

      const matchesBlood =
        filters.bloodGroup === "All" ||
        donor.bloodGroup === filters.bloodGroup;

      const matchesCity =
        filters.city === "All" || donor.city === filters.city;

      const matchesStatus =
        filters.status === "All" || donor.status === filters.status;

      const matchesDonation =
        filters.donation === "All" ||
        (filters.donation === "Recent" && donor.lastDonation.includes("2025")) ||
        (filters.donation === "Older" && donor.lastDonation.includes("2024"));

      return (
        matchesSearch &&
        matchesBlood &&
        matchesCity &&
        matchesStatus &&
        matchesDonation
      );
    });
  }, [donors, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredDonors.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const currentDonors = filteredDonors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const allCurrentSelected =
    currentDonors.length > 0 &&
    currentDonors.every((donor) => selected.includes(donor.id));

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      bloodGroup: "All",
      city: "All",
      status: "All",
      donation: "All"
    });
    setPage(1);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      setSelected((prev) =>
        prev.filter((id) => !currentDonors.some((donor) => donor.id === id))
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...currentDonors.map((donor) => donor.id)])
      ]);
    }
  };

  const deleteDonor = (id: number) => {
    setDonors((prev) => prev.filter((donor) => donor.id !== id));
    setSelected((prev) => prev.filter((item) => item !== id));
    setMenuId(null);
  };

  const deleteSelected = () => {
    setDonors((prev) => prev.filter((donor) => !selected.includes(donor.id)));
    setSelected([]);
  };

  const saveEdit = () => {
    if (!editDonor) return;

    setDonors((prev) =>
      prev.map((donor) =>
        donor.id === editDonor.id ? editDonor : donor
      )
    );

    setEditDonor(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setMenuId(null);
    }
  };

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f7f9fc] p-4 md:p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5">
          <h1 className="text-[24px] font-bold tracking-[-0.5px] text-[#172033]">
            Find Donors <span className="font-semibold">(Admin Only)</span>
          </h1>
        </div>

        <div className="rounded-xl border border-[#e5e9f0] bg-white p-4 shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
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
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search donors by name, phone, CNIC..."
                className="h-11 w-full rounded-lg border border-[#e2e7ee] bg-white pl-10 pr-4 text-[13px] text-[#273142] outline-none transition focus:border-[#dc3545] focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="h-11 rounded-lg bg-[#c92835] px-5 text-[13px] font-semibold text-white transition hover:bg-[#b51f2c]"
            >
              Advanced Filter
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Blood Group"
              value={filters.bloodGroup}
              options={bloodGroups}
              onChange={(value) => updateFilter("bloodGroup", value)}
            />

            <FilterSelect
              label="City"
              value={filters.city}
              options={cities}
              onChange={(value) => updateFilter("city", value)}
            />

            <FilterSelect
              label="Availability"
              value={filters.status}
              options={["All", "Available", "Unavailable"]}
              onChange={(value) => updateFilter("status", value)}
            />

            <FilterSelect
              label="Last Donation"
              value={filters.donation}
              options={["All", "Recent", "Older"]}
              onChange={(value) => updateFilter("donation", value)}
            />
          </div>

          {advancedOpen && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50/50 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <FilterSelect
                  label="Status"
                  value={filters.status}
                  options={["All", "Available", "Unavailable"]}
                  onChange={(value) => updateFilter("status", value)}
                />

                <FilterSelect
                  label="Blood Group"
                  value={filters.bloodGroup}
                  options={bloodGroups}
                  onChange={(value) => updateFilter("bloodGroup", value)}
                />

                <FilterSelect
                  label="City"
                  value={filters.city}
                  options={cities}
                  onChange={(value) => updateFilter("city", value)}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={resetFilters}
              className="h-10 rounded-lg border border-[#dfe4eb] bg-white px-5 text-[13px] font-medium text-[#4c5667] transition hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              onClick={() => setPage(1)}
              className="h-10 rounded-lg bg-[#c92835] px-6 text-[13px] font-semibold text-white transition hover:bg-[#b51f2c]"
            >
              Search
            </button>

            {selected.length > 0 && (
              <button
                onClick={deleteSelected}
                className="h-10 rounded-lg border border-red-200 bg-red-50 px-5 text-[13px] font-semibold text-red-600 transition hover:bg-red-100"
              >
                Delete Selected ({selected.length})
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#e5e9f0] bg-white shadow-[0_3px_15px_rgba(20,30,50,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1350px] border-collapse">
              <thead>
                <tr className="border-b border-[#edf0f4] bg-white">
                  <th className="w-12 px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allCurrentSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 accent-[#c92835]"
                    />
                  </th>
                  <TableHeading>Name</TableHeading>
                  <TableHeading>Blood Group</TableHeading>
                  <TableHeading>Mobile No</TableHeading>
                  <TableHeading>Whatsapp No</TableHeading>
                  <TableHeading>GMail</TableHeading>
                  <TableHeading>City</TableHeading>
                  <TableHeading>Educational Sector</TableHeading>
                  <TableHeading>Last Donation</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Actions</TableHeading>
                </tr>
              </thead>

              <tbody>
                {currentDonors.length > 0 ? (
                  currentDonors.map((donor) => (
                    <tr
                      key={donor.id}
                      className="border-b border-[#edf0f4] transition hover:bg-[#fafbfc]"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(donor.id)}
                          onChange={() => toggleSelect(donor.id)}
                          className="h-4 w-4 accent-[#c92835]"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4b5b9] to-[#d9e1eb] text-[10px] font-bold text-[#6e3440]">
                            {getInitials(donor.name)}
                          </div>
                          <span className="text-[12px] font-semibold text-[#293343]">
                            {donor.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-[12px] font-medium text-[#384354]">
                        {donor.bloodGroup}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-[#4d5868]">
                        {donor.phone || "—"}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-[#4d5868]">
                        {donor.whatsappNo || "—"}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-[#4d5868]">
                        {donor.gmail || "—"}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-[#4d5868]">
                        {donor.city || "—"}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-[#4d5868]">
                        {donor.educationalSector || "Nill"}
                      </td>

                      <td className="px-4 py-3 text-[12px] text-[#4d5868]">
                        {donor.lastDonation}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${
                            donor.status === "Available"
                              ? "bg-[#d9f4e3] text-[#29905a]"
                              : "bg-[#ffe0e3] text-[#e04958]"
                          }`}
                        >
                          {donor.status}
                        </span>
                      </td>

                      <td className="relative px-4 py-3">
                        <button
                          onClick={() =>
                            setMenuId(menuId === donor.id ? null : donor.id)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[#606a79] transition hover:bg-gray-100"
                        >
                          <span className="text-lg leading-none">•••</span>
                        </button>

                        {menuId === donor.id && (
                          <div className="absolute right-4 top-12 z-30 w-36 overflow-hidden rounded-lg border border-[#e4e8ee] bg-white py-1 shadow-xl">
                            <button
                              onClick={() => {
                                setViewDonor(donor);
                                setMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-[12px] text-[#394454] hover:bg-gray-50"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                setEditDonor(donor);
                                setMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-[12px] text-[#394454] hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteDonor(donor.id)}
                              className="block w-full px-4 py-2 text-left text-[12px] text-red-600 hover:bg-red-50"
                            >
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
                      colSpan={11}
                      className="px-5 py-16 text-center text-sm text-[#7b8492]"
                    >
                      No donors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#edf0f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-[#697383]">
              Showing{" "}
              <span className="font-semibold text-[#3e4755]">
                {filteredDonors.length === 0
                  ? 0
                  : (currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#3e4755]">
                {Math.min(currentPage * PAGE_SIZE, filteredDonors.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#3e4755]">
                {filteredDonors.length}
              </span>{" "}
              donors
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e1e5eb] text-[#667180] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>

              {visiblePages.map((number) => (
                <button
                  key={number}
                  onClick={() => goToPage(number)}
                  className={`h-8 min-w-8 rounded-md px-2 text-[12px] font-semibold transition ${
                    currentPage === number
                      ? "bg-[#c92835] text-white"
                      : "border border-[#e1e5eb] bg-white text-[#596474] hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}

              {totalPages > 6 && (
                <>
                  <span className="px-1 text-[#8b94a2]">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={`h-8 min-w-8 rounded-md border border-[#e1e5eb] px-2 text-[12px] font-semibold text-[#596474] hover:bg-gray-50 ${
                      currentPage === totalPages ? "bg-[#c92835] text-white" : ""
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e1e5eb] text-[#667180] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewDonor && (
        <Modal onClose={() => setViewDonor(null)}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f4b5b9] to-[#d9e1eb] font-bold text-[#6e3440]">
              {getInitials(viewDonor.name)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172033]">
                {viewDonor.name}
              </h2>
              <p className="text-xs text-[#788292]">
                Donor ID #{viewDonor.id}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <InfoItem label="Blood Group" value={viewDonor.bloodGroup} />
            <InfoItem label="Status" value={viewDonor.status} />
            <InfoItem label="Mobile No" value={viewDonor.phone || "—"} />
            <InfoItem label="Whatsapp No" value={viewDonor.whatsappNo || "—"} />
            <InfoItem label="GMail" value={viewDonor.gmail || "—"} />
            <InfoItem label="City" value={viewDonor.city || "—"} />
            <InfoItem label="Educational Sector" value={viewDonor.educationalSector || "Nill"} />
            <InfoItem label="CNIC" value={viewDonor.cnic} />
            <InfoItem label="Age" value={`${viewDonor.age} years`} />
            <InfoItem label="Gender" value={viewDonor.gender} />
            <InfoItem label="Last Donation" value={viewDonor.lastDonation} />
          </div>

          <button
            onClick={() => setViewDonor(null)}
            className="mt-6 h-10 w-full rounded-lg bg-[#c92835] text-sm font-semibold text-white"
          >
            Close
          </button>
        </Modal>
      )}

      {editDonor && (
        <Modal onClose={() => setEditDonor(null)}>
          <h2 className="text-lg font-bold text-[#172033]">Edit Donor</h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Name"
              value={editDonor.name}
              onChange={(value) =>
                setEditDonor({ ...editDonor, name: value })
              }
            />

            <InputField
              label="Mobile No"
              value={editDonor.phone}
              onChange={(value) =>
                setEditDonor({ ...editDonor, phone: value })
              }
            />

            <InputField
              label="GMail"
              value={editDonor.gmail}
              onChange={(value) =>
                setEditDonor({ ...editDonor, gmail: value })
              }
              type="email"
            />

       <InputField
  label="Whatsapp No"
  value={editDonor.whatsappNo}
  onChange={(value) =>
    setEditDonor({ ...editDonor, whatsappNo: value })
  }
/>

            <InputField
              label="CNIC"
              value={editDonor.cnic}
              onChange={(value) =>
                setEditDonor({ ...editDonor, cnic: value })
              }
            />

            <InputField
              label="Last Donation"
              value={editDonor.lastDonation}
              onChange={(value) =>
                setEditDonor({ ...editDonor, lastDonation: value })
              }
            />

            <FilterSelect
              label="Blood Group"
              value={editDonor.bloodGroup}
              options={bloodGroups.filter((item) => item !== "All")}
              onChange={(value) =>
                setEditDonor({ ...editDonor, bloodGroup: value })
              }
            />

            <FilterSelect
              label="City"
              value={editDonor.city}
              options={cities.filter((item) => item !== "All")}
              onChange={(value) =>
                setEditDonor({ ...editDonor, city: value })
              }
            />

            <FilterSelect
              label="Status"
              value={editDonor.status}
              options={["Available", "Unavailable"]}
              onChange={(value) =>
                setEditDonor({
                  ...editDonor,
                  status: value as "Available" | "Unavailable"
                })
              }
            />

            <FilterSelect
              label="Educational Sector"
              value={editDonor.educationalSector}
              options={["School", "College", "University", "Nill"]}
              onChange={(value) =>
                setEditDonor({
                  ...editDonor,
                  educationalSector: value as "School" | "College" | "University" | "Nill"
                })
              }
            />

            <InputField
              label="Age"
              value={String(editDonor.age)}
              onChange={(value) =>
                setEditDonor({
                  ...editDonor,
                  age: Number(value) || 0
                })
              }
              type="number"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setEditDonor(null)}
              className="h-10 flex-1 rounded-lg border border-[#dfe4eb] text-sm font-semibold text-[#596474]"
            >
              Cancel
            </button>

            <button
              onClick={saveEdit}
              className="h-10 flex-1 rounded-lg bg-[#c92835] text-sm font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2px] text-[#657081]">
      {children}
    </th>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold text-[#4e5969]">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#dfe4eb] bg-white px-3 text-[12px] text-[#455061] outline-none focus:border-[#c92835] focus:ring-2 focus:ring-red-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold text-[#4e5969]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-[#dfe4eb] px-3 text-[12px] text-[#455061] outline-none focus:border-[#c92835] focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

function InfoItem({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#edf0f4] bg-[#fafbfc] p-3">
      <p className="text-[10px] font-semibold uppercase text-[#8a94a3]">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-[#303b4b]">
        {value}
      </p>
    </div>
  );
}

function Modal({
  children,
  onClose
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-[#737d8c] hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}