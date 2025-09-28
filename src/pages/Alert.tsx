"use client";

import { useEffect, useState } from "react";

interface NotifyMethods {
  email: string | null;
  telegram: string | null;
  discord: string | null;
}

interface AlertData {
  id: string;
  asset: string;
  oracle: string;
  threshold: number;
  type: string;
  notify: NotifyMethods;
  createdAt: string;
}

function Alert() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("alerts") || "[]");
    setAlerts(stored);
  }, []);



  return (
    <div className="sm:py-[24px] sm:pr-[24px] bg-[#F4F6FE] w-full flex flex-1 z-0 h-auto overflow-hidden ">
      <div className="w-full mt-10 max-w-[95%] mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-nowrap">
            <thead className="bg-[#B71C1C] text-slate-100">
              <tr>
                <th className="p-3 border border-gray-300 text-left">Asset</th>
                <th className="p-3 border border-gray-300 text-center">Oracle</th>
                <th className="p-3 border border-gray-300 text-center">
                  Threshold
                </th>
                <th className="p-3 border border-gray-300 text-center">Type</th>
                <th className="p-3 border border-gray-300 text-center">
                  Notifications
                </th>
                <th className="p-3 border border-gray-300 text-center">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.length > 0 ? (
                alerts.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#B71C1C]/20 text-gray-800"
                  >
                    <td className="p-3 border border-gray-300">{item.asset}</td>
                    <td className="p-3 border border-gray-300 text-center">
                      {item.oracle}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      ${item.threshold}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {item.type}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {Object.entries(item.notify)
                        .filter(([_, v]) => v)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-gray-500"
                  >
                    No alerts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Alert;
