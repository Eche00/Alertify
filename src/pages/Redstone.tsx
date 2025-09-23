"use client";

import { NotificationAdd, Refresh } from "@mui/icons-material";
import Loader from "../components/Loader";
import { useRedstoneFeeds } from "../utils/oracles";
import { useEffect } from "react";

interface ChainLinkProps {
  onFeedsUpdate?: (feeds: any[]) => void;
}
export default function RedstonePage({ onFeedsUpdate }: ChainLinkProps) {
  const { data, loading,refetch } = useRedstoneFeeds();

  useEffect(() => {
    if (onFeedsUpdate) onFeedsUpdate(data);
  }, [data]);
  return (
    <div className="w-full mt-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">RedStone Feeds <button onClick={refetch} className="text-[#B71C1C] cursor-pointer hover:scale-105 transition-all duration-300"><Refresh fontSize="large"/></button>
      </h1>
      {loading && <p className="text-center">Loading RedStone feeds...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-nowra">
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
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-[#B71C1C]/20 text-gray-800">
                  <td className="p-3 border border-gray-300">{item.asset}</td>
                  <td className="p-3 border border-gray-300 text-center">{item.oracle}</td>
                  <td className="p-3 border border-gray-300 text-center">
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">{item.status}</td>
                  <td className="p-3 border border-gray-300 text-center">{item.updated}</td>
                  <td className="p-3 border border-gray-300 flex items-end justify-end">
                    <button className="px-3 py-1 border border-red-500 hover:bg-red-600 text-red-500 hover:text-white rounded-md text-sm cursor-pointer transition-all duration-300 flex items-center gap-1">
                      <NotificationAdd /> Alert
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  {loading ? <Loader /> : "No RedStone feeds available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
