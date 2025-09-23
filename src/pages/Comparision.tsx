"use client";

import {
  ChangeCircle,
  Check,
  CurrencyExchange,
} from "@mui/icons-material";

// Define a generic Feed type
interface Feed {
  asset: string;
  oracle: string;
  status: string; // "Active", "Stale", etc.
  price?: number;
  updated?: string | number;
}

interface ComparisonProps {
  feeds: Feed[]; // pass in the feeds of the selected oracle
}

function Comparision({ feeds }: ComparisonProps) {
  // Compute feed counts
  const totalFeeds = feeds.length;
  const healthyFeeds = feeds.filter((f) => f.status === "Active").length;
  const deviatedFeeds = feeds.filter((f) => f.status === "Deviated").length;

  return (
    <div className="bg-white flex items-center lg:flex-row flex-col gap-5 shadow-lg w-[90%] mx-auto sm:p-10 p-5 relative rounded-[18px]">
      {/* Total Feeds */}
      <section className="flex flex-1 flex-col bg-white rounded-2xl sm:min-h-[200px] min-h-[100px] relative w-full justify-between items-start p-5">
        <div className="flex flex-1 w-full gap-5 justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Feeds</p>
            <h3 className="text-2xl font-bold text-[#B71C1C]">Total Feeds</h3>
          </div>
          <div className="bg-[#f5092016] w-[40px] h-[40px] flex items-center justify-center rounded-full">
            <span className="text-red-700 text-xl">
              <CurrencyExchange />
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-[#B71C1C]">{totalFeeds}</h3>
      </section>

      {/* Healthy Feeds */}
      <section className="flex flex-1 flex-col bg-[#B71C1C]/10 rounded-2xl sm:min-h-[200px] min-h-[100px] relative w-full justify-between items-start p-5">
        <div className="flex flex-1 w-full gap-5 justify-between">
          <div>
            <p className="text-sm text-gray-800 mb-1">Healthy</p>
            <h3 className="text-2xl font-bold text-[#B71C1C]">Healthy Feeds</h3>
            <p className="text-xs text-gray-800 mt-1">Total Healthy Feeds</p>
          </div>
          <div className="bg-[#f5092134] w-[40px] h-[40px] flex items-center justify-center rounded-full">
            <span className="text-white text-xl">
              <Check />
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-[#B71C1C]">{healthyFeeds}</h3>
      </section>

      {/* Stale Feeds */}
     

      {/* Deviated Feeds */}
      <section className="flex flex-1 flex-col bg-[#B71C1C] rounded-2xl sm:min-h-[200px] min-h-[100px] relative w-full justify-between items-start p-5">
        <div className="flex flex-1 w-full gap-5 justify-between">
          <div>
            <p className="text-sm text-gray-200 mb-1">Deviations</p>
            <h3 className="text-2xl font-bold text-white">Deviated Feeds</h3>
            <p className="text-xs text-gray-200 mt-1">Total Deviated Feeds</p>
          </div>
          <div className="bg-[#f5092016] w-[40px] h-[40px] flex items-center justify-center rounded-full">
            <span className="text-white text-xl">
              <ChangeCircle />
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white">{deviatedFeeds}</h3>
      </section>
    </div>
  );
}

export default Comparision;
