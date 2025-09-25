"use client";
import { NotificationAdd, Refresh } from "@mui/icons-material";
import Loader from "../components/Loader";
import { useChainlinkFeeds } from "../utils/oracles";
import { useEffect, useRef, useState } from "react";

interface ChainLinkProps {
  onFeedsUpdate?: (feeds: any[]) => void;
}

export default function ChainlinkPage({ onFeedsUpdate }: ChainLinkProps) {
  const { data, loading, refetch } = useChainlinkFeeds();
  const prevDataRef = useRef<any[]>([]);
  const [withChange, setWithChange] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      const updated = data.map((item) => {
        const prev = prevDataRef.current.find((d) => d.asset === item.asset);

        // Ensure prices are numbers
        const currentPrice =
          typeof item.price === "number" ? item.price : parseFloat(item.price);
        const prevPrice =
          prev && typeof prev.price === "number"
            ? prev.price
            : parseFloat(prev?.price ?? "0");

        const change = prev ? currentPrice - prevPrice : 0;
        const prevColor = prev?.color || "text-green-600 font-semibold";

        // Decide color
        let color = prevColor;
        if (change > 0) color = "text-green-600 font-semibold";
        else if (change < 0) color = "text-red-600 font-semibold";

        return { ...item, price: currentPrice, change, color };
      });

      prevDataRef.current = updated; // save current as prev for next run
      setWithChange(updated);

      if (onFeedsUpdate) onFeedsUpdate(updated);
    }
  }, [data]);

  return (
    <div className="w-full mt-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
        Chainlink (CoinGecko)
        <button
          onClick={refetch}
          className="bg-[#B71C1C] disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white py-2 px-[16px] text-[12px] rounded-[8px] cursor-pointer hover:scale-105 transition-all duration-300"
          disabled={loading}
        >
          <Refresh fontSize="medium" /> Refresh
        </button>
      </h1>
      {loading && <p className="text-center">Loading Chainlink feeds...</p>}

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
              withChange.map((item, index) => (
                <tr key={index} className="hover:bg-[#B71C1C]/20 text-gray-800">
                  <td className="p-3 border border-gray-300">{item.asset}</td>
                  <td className="p-3 border border-gray-300 text-center">{item.oracle}</td>
                  <td className={`p-3 border border-gray-300 text-center ${item.color}`}>
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">{item.status}</td>
                  <td className="p-3 border border-gray-300 text-center">{item.updated}</td>
                  <td className="p-3 border border-gray-300 flex items-end justify-end">
                    <button className="px-3 py-1 border border-gray-500 hover:bg-gray-600 text-gray-500 hover:text-white rounded-md text-sm cursor-pointer transition-all duration-300 flex items-center gap-1">
                      <NotificationAdd /> Alert
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  {loading ? <Loader /> : "No feeds available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
