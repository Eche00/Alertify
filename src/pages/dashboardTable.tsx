"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useRedstoneFeeds, usePythFeeds, useChainlinkFeeds } from "../utils/oracles";
import { Add, Compare, Refresh } from "@mui/icons-material";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function DashboardTable() {
  const navigate = useNavigate(); 

  const { data: redstoneData, loading: redstoneLoading, refetch: refetchRedstone } = useRedstoneFeeds();
  const { data: pythData, loading: pythLoading, refetch: refetchPyth } = usePythFeeds();
  const { data: chainlinkData, loading: chainlinkLoading, refetch: refetchChainlink } = useChainlinkFeeds();

  const [redstone, setRedstone] = useState<any[]>([]);
  const [pyth, setPyth] = useState<any[]>([]);
  const [chainlink, setChainlink] = useState<any[]>([]);

  useEffect(() => {
    if (redstoneData.length > 0) setRedstone(redstoneData.slice(0, 3));
    if (pythData.length > 0) setPyth(pythData.slice(0, 3));
    if (chainlinkData.length > 0) setChainlink(chainlinkData.slice(0, 3));
  }, [redstoneData, pythData, chainlinkData]);

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchRedstone(), refetchPyth(), refetchChainlink()]);
      toast.success("Feeds refreshed successfully");
    } catch {
      toast.error("Failed to refresh feeds");
    }
  };
 const actions = [
    {
      title: "Create Alert",
      description: "Set up threshold-based alerts to track specific price movements in real time.",
      icon: <Add className="w-6 h-6 text-[#B71C1C]" />,
      to: "/create",
    },
    {
      title: "Compare Feeds",
      description: "Analyze price differences across multiple oracle networks easily.",
      icon: <Compare className="w-6 h-6 text-[#B71C1C]" />,
      to: "/comparison",
    },
    {
      title: "View Pricefeeds",
      description: "See all available feeds, track live data, and identify trends.",
      icon: <AlignVerticalBottomIcon className="w-6 h-6 text-[#B71C1C]" />,
      to: "/pricefeeds",
    },
    {
      title: "Your Alerts",
      description: "Review all alerts created on this device and manage notifications.",
      icon: <NotificationsActiveIcon className="w-6 h-6 text-[#B71C1C]" />,
      to: "/alert",
    },
  ];
  const renderTable = (title: string, data: any[], loading: boolean) => (
    <div className="bg-white rounded-2xl shadow-xl p-5 w-full sm:w-[48%] lg:w-[32%] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#B71C1C]">{title}</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-[#B71C1C] disabled:opacity-60 flex items-center gap-1 text-white text-xs px-3 py-1.5 rounded-md hover:scale-105 transition-all duration-300"
        >
          <Refresh fontSize="small" /> Refresh
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm text-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-[#B71C1C] text-white">
              <tr>
                <th className="p-2 text-left sm:text-sm text-[10px]">Asset</th>
                <th className="p-2 text-center sm:text-sm text-[10px] sm:text-center text-right">Price (USD)</th>
                <th className="p-2 text-center sm:flex hidden">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-[#B71C1C]/10 transition-all">
                    <td className="p-2 font-medium ">{item.asset.slice(0,3)}</td>
                    <td className="p-2 text-center sm:text-center text-right">
                      ${item.price?.toLocaleString() || "N/A"}
                    </td>
                    <td className="p-2 text-center text-green-600 sm:flex hidden">
                      {item.status || "Active"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-3 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-[90%] mx-auto py-6 bg-[#F4F6FE]  flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-[#B71C1C]">Dashboard Overview</h1>

      <div className="flex flex-wrap justify-center gap-2">
        {renderTable("RedStone", redstone, redstoneLoading)}
        {renderTable("Chainlink", chainlink, chainlinkLoading)}
        {renderTable("Pyth", pyth, pythLoading)}
      </div>

     <div className="mt-16  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 place-items-center items-stretch">
  {actions.map((item, index) => (
    <div
      key={index}
      onClick={() => navigate(item.to)}
      className="group relative w-full flex flex-col justify-between max-w-[280px] p-6 rounded-2xl bg-gradient-to-br from-white/70 to-white/90 backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
    >
      {/* Icon + Title */}
      <div className="flex sm:flex-row flex-col sm:items-center items-start  gap-3 mb-5">
        <div className="p-3 bg-[#B71C1C]/10 rounded-2xl group-hover:bg-[#B71C1C]/20 transition-all duration-500 transform group-hover:rotate-6 group-hover:scale-110">
          {item.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#B71C1C] tracking-tight">
            {item.title}
          </h3>
          <div className="h-[2px] w-0 bg-[#B71C1C] group-hover:w-full transition-all duration-500 rounded-full"></div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {item.description}
      </p>

      {/* CTA Button */}
      <button className="relative w-full bg-[#B71C1C] text-white text-sm font-medium py-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.03] cursor-pointer">
        <span className="relative z-10 ">Go →</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#B71C1C] to-[#a31515] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </button>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl bg-[#B71C1C]/10 rounded-2xl"></div>
    </div>
  ))}
</div>

    </div>
  );
}

export default DashboardTable;
