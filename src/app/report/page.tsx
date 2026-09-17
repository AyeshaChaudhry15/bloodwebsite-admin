"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BloodGroupData {
  group: string;
  count: number;
  rh: "+" | "-";
  compat: string;
}

const data: BloodGroupData[] = [
  { group: "O+", count: 340, rh: "+", compat: "O+, A+, B+, AB+" },
  { group: "A+", count: 210, rh: "+", compat: "A+, AB+" },
  { group: "B+", count: 135, rh: "+", compat: "B+, AB+" },
  { group: "AB+", count: 115, rh: "+", compat: "AB+" },
  { group: "B-", count: 100, rh: "-", compat: "B+, B-, AB+, AB-" },
  { group: "A-", count: 80, rh: "-", compat: "A+, A-, AB+, AB-" },
  { group: "O-", count: 65, rh: "-", compat: "Everyone" },
  { group: "AB-", count: 55, rh: "-", compat: "AB+, AB-" },
];

const total = data.reduce((sum, d) => sum + d.count, 0);
const maxCount = Math.max(...data.map((d) => d.count));
const rhPositive = data
  .filter((d) => d.rh === "+")
  .reduce((s, d) => s + d.count, 0);
const rhNegative = total - rhPositive;
const sortedData = [...data].sort((a, b) => b.count - a.count);
const mostCommon = sortedData[0];
const rarest = sortedData[sortedData.length - 1];

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  highlight?: boolean;
}

function StatCard({ label, value, sub, highlight }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs text-black mb-2">{label}</div>
      <div
        className={
          "text-xl font-bold " + (highlight ? "text-red-600" : "text-black")
        }
      >
        {value}
      </div>
      <div className="text-xs text-black mt-1">{sub}</div>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  text: string;
}

function InsightCard({ title, text }: InsightCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-bold text-xl mb-3 text-red-500">{title}</h3>
      <p className="text-sm text-black leading-relaxed">{text}</p>
    </div>
  );
}

export default function BloodGroupReport() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <button
                onClick={() => window.history.back()}
                className="h-10 rounded-lg border border-[#dfe4eb] bg-white px-5 text-[12px] font-semibold text-[#4c5667] transition hover:bg-gray-50"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Blood group distribution
            </h1>
            <p className="text-gray-500 text-md mt-1.5">
              Registered donor pool · updated 17 September 2026
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 ">
          <StatCard
            label="Most common"
            value={mostCommon.group}
            sub={
              mostCommon.count +
              " donors · " +
              ((mostCommon.count / total) * 100).toFixed(1) +
              "%"
            }
            highlight
          />
          <StatCard
            label="Rarest"
            value={rarest.group}
            sub={
              rarest.count +
              " donors · " +
              ((rarest.count / total) * 100).toFixed(1) +
              "%"
            }
          />
          <StatCard
            label="Rh-positive"
            value={rhPositive.toLocaleString()}
            sub={((rhPositive / total) * 100).toFixed(1) + "% of pool"}
          />
          <StatCard
            label="Rh-negative"
            value={rhNegative.toLocaleString()}
            sub={((rhNegative / total) * 100).toFixed(1) + "% of pool"}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Full breakdown</h2>
            <div className="flex items-center gap-4 text-xs text-black">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500 text-black"></span>{" "}
                Rh+
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-black"></span> Rh−
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {data.map((d, i) => {
              const pct = ((d.count / total) * 100).toFixed(1);
              const widthPct = (d.count / maxCount) * 100;
              return (
                <div
                  key={d.group}
                  className="flex items-center gap-3 text-black"
                >
                  <div className="w-12 shrink-0 text-sm font-semibold font-mono text-gray-900">
                    {d.group}
                  </div>
                  <div className="flex-1 h-6 rounded-md bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-md origin-left transition-transform duration-700 ease-out"
                      style={{
                        width: widthPct + "%",
                        backgroundColor: d.rh === "+" ? "#ef4444" : "#9ca3af",
                        transform: mounted ? "scaleX(1)" : "scaleX(0)",
                        transitionDelay: i * 60 + "ms",
                      }}
                    ></div>
                  </div>
                  <div className="w-24 shrink-0 text-right text-sm font-mono">
                    {d.count.toLocaleString()}
                  </div>
                  <div className="w-14 shrink-0 text-right text-xs text-black font-mono">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 ">
          <InsightCard
            title="Universal donor supply"
            text="O− donors can give to any recipient regardless of blood type, but make up a small slice of the pool — the second-smallest group. Steady O− outreach keeps emergency supply healthy."
          />
          <InsightCard
            title="Distribution shape"
            text="O and A groups together account for roughly two-thirds of the donor pool, closely tracking typical population-level frequencies. B and AB groups remain comparatively under-represented."
          />
        </div>
      </div>
    </div>
  );
}
