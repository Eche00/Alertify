"use client";

import { NotificationAdd, Refresh } from "@mui/icons-material";
import Loader from "../components/Loader";
import { usePythFeeds } from "../utils/oracles";
import { useEffect, useRef, useState } from "react";
import AlertModal from "./AlertModal";
import { toast } from "react-hot-toast";  

interface ChainLinkProps {
  onFeedsUpdate?: (feeds: any[]) => void;
}

export default function PythPage({ onFeedsUpdate }: ChainLinkProps) {
  const [modal, setModal] = useState<boolean>(false);
  const { data, loading, refetch } = usePythFeeds();
  const prevDataRef = useRef<any[]>([]);
  const [withChange, setWithChange] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("alerts") || "[]");
    setAlerts(stored);
  }, [modal]); // reload alerts whenever modal changes

  useEffect(() => {
    if (data.length > 0) {
      const updated = data.map((item) => {
        const prev = prevDataRef.current.find((d) => d.asset === item.asset);
        const change = prev ? item.price - prev.price : 0;
        const prevColor = prev?.color || "text-green-600 font-semibold";

        let color = prevColor;
        if (change > 0) color = "text-green-600 font-semibold";
        else if (change < 0) color = "text-red-600 font-semibold";

        return { ...item, change, color };
      });

      prevDataRef.current = updated;
      setWithChange(updated);

      if (onFeedsUpdate) onFeedsUpdate(updated);
    }
  }, [data]);

  return (
    <div className="w-full mt-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
        Pyth Feeds{" "}
        <button
           onClick={async () => {
            try {
              await refetch();
              toast.success("Feeds refreshed ");
            } catch (err) {
              toast.error("Failed to refresh feeds ");
            }
          }}
          className="bg-[#B71C1C] disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white py-2 px-[16px] text-[12px] rounded-[8px] cursor-pointer hover:scale-105 transition-all duration-300"
          disabled={loading}
        >
          <Refresh fontSize="medium" /> Refresh
        </button>
      </h1>

      {loading && <p className="text-center">Loading Pyth feeds...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-nowrap">
          <thead className="bg-[#B71C1C] text-slate-100">
            <tr>
              <th className="p-3 border border-gray-300 text-left">Asset</th>
              <th className="p-3 border border-gray-300 text-center">Oracle</th>
              <th className="p-3 border border-gray-300 text-center">Price (USD)</th>
              <th className="p-3 border border-gray-300 text-center">Status</th>
              <th className="p-3 border border-gray-300 text-center">Last Updated</th>
              <th className="p-3 border border-gray-300 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {withChange.length > 0 ? (
              withChange.map((item, index) => {
                const alreadyAlerted = alerts.some(
                  (a) => a.asset === item.asset && a.oracle === item.oracle
                );

                return (
                  <tr key={index} className="hover:bg-[#B71C1C]/20 text-gray-800">
                    <td className="p-3 border border-gray-300">{item.asset}</td>
                    <td className="p-3 border border-gray-300 text-center">
                      {item.oracle}
                    </td>

                    <td
                      className={`p-3 border border-gray-300 text-center ${item.color}`}
                    >
                      {item.price !== "N/A" ? `$${item.price}` : "N/A"}
                    </td>

                    <td className="p-3 border border-gray-300 text-center">
                      {item.status}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      {item.updated}
                    </td>
                    <td className="p-3 border border-gray-300 flex items-end justify-end">
                      <button
                        className={`px-3 py-1 border rounded-md text-sm cursor-pointer transition-all duration-300 flex items-center gap-1 
                          ${
                            alreadyAlerted
                              ? "bg-[#B71C1C] text-white border-[#B71C1C] hover:bg-[#B71C1C]/80"
        : "border-gray-500 hover:bg-gray-600 text-gray-500 hover:text-white"
                          }`}
                        onClick={() => {
                          setSelectedAsset(item);
                          setModal(true);
                        }}
                      >
                        <NotificationAdd /> Alert
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  {loading ? <Loader /> : "No Pyth feeds available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && <AlertModal setModal={setModal} asset={selectedAsset} />}
    </div>
  );
}
