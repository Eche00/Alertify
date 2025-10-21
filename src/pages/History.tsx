"use client";
import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { pricesData } from "../utils/history";

// ---- Types ----
interface OracleData {
  price: number;
  status: string;
  updated: string;
}

interface CoinHistory {
  [timestamp: string]: {
    Chainlink: OracleData;
    RedStone: OracleData;
    Pyth: OracleData;
  };
}

interface CoinData {
  symbol: string;
  history: CoinHistory;
}

type Timeframe = "12h" | "1d" | "1w" | "1m";

const History: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("1w");

  //  Independent coin selectors
  const [chainlinkCoin, setChainlinkCoin] = useState<string>("BTC");
  const [redstoneCoin, setRedstoneCoin] = useState<string>("ETH");
  const [pythCoin, setPythCoin] = useState<string>("SOL");

  const coins = Object.keys(pricesData);

  // Helper: filter history by timeframe
  const getFilteredData = (coin: CoinData) => {
    const entries = Object.entries(coin.history);
    switch (timeframe) {
      case "12h":
        return entries.slice(-12); // last 12 hours
      case "1d":
        return entries.slice(-24); // last 24 hours
      case "1w":
        return entries.slice(-168); // last 7 days
      case "1m":
        return entries.slice(-720); // last 30 days (30*24)
      default:
        return entries;
    }
  };

  // 🧠 Build chart data for each oracle independently
  const buildSeriesData = useMemo(() => {
    const makeSeries = (coinSymbol: string, oracleKey: keyof CoinHistory[string]) => {
      const coin = (pricesData as Record<string, CoinData>)[coinSymbol];
      if (!coin) return [];
      const filtered = getFilteredData(coin);
      return filtered.map(([timestamp, data]) => ({
        time: new Date(timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: data[oracleKey].price,
      }));
    };

    return {
      Chainlink: makeSeries(chainlinkCoin, "Chainlink"),
      RedStone: makeSeries(redstoneCoin, "RedStone"),
      Pyth: makeSeries(pythCoin, "Pyth"),
    };
  }, [timeframe, chainlinkCoin, redstoneCoin, pythCoin]);

  //  Align timestamps (x-axis)
  const xCategories =
    buildSeriesData.Chainlink.length > 0
      ? buildSeriesData.Chainlink.map((d) => d.time)
      : buildSeriesData.RedStone.length > 0
      ? buildSeriesData.RedStone.map((d) => d.time)
      : buildSeriesData.Pyth.map((d) => d.time);

  //  ApexCharts setup
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: xCategories,
      labels: { style: { fontSize: "10px" } },
    },
    yaxis: {
      labels: {
        formatter: (v: number) => `$${v.toFixed(2)}`,
        style: { fontSize: "10px" },
      },
    },
    tooltip: {
      y: { formatter: (v: number) => `$${v.toLocaleString()}` },
    },
    colors: ["#0070f3", "#B71C1C", "#27ae60"],
    legend: { position: "top" },
  };

  //  Prepare chart series
  const series = [
    {
      name: `Chainlink (${chainlinkCoin})`,
      data: buildSeriesData.Chainlink.map((d) => d.price),
    },
    {
      name: `RedStone (${redstoneCoin})`,
      data: buildSeriesData.RedStone.map((d) => d.price),
    },
    {
      name: `Pyth (${pythCoin})`,
      data: buildSeriesData.Pyth.map((d) => d.price),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
       Oracle Price History Comparison
      </h1>

     {/* Oracle Coin Selectors */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {[
    { label: "Chainlink", color: "text-[#0070f3]", state: chainlinkCoin, set: setChainlinkCoin },
    { label: "RedStone", color: "text-[#B71C1C]", state: redstoneCoin, set: setRedstoneCoin },
    { label: "Pyth", color: "text-[#27ae60]", state: pythCoin, set: setPythCoin },
  ].map((oracle) => (
    <div key={oracle.label} className="p-4 rounded-2xl shadow-sm bg-gray-300">
      <h2 className={`font-semibold mb-2 ${oracle.color}`}>{oracle.label} Coin</h2>
      <select
        value={oracle.state}
        onChange={(e) => oracle.set(e.target.value)}
        className="w-full border border-gray-400 rounded-lg p-2 outline-none cursor-pointer"
      >
        {coins.map((coin) => (
          <option key={coin} value={coin}>
            {coin.charAt(0).toUpperCase() + coin.slice(1)}
          </option>
        ))}
      </select>
    </div>
  ))}
</div>


     {/*  Timeframe Selector  */}
<div className="flex flex-wrap items-center gap-3 mb-6">
  {[
    { key: "12h", label: "12 Hours" },
    { key: "1d", label: "1 Day" },
    { key: "1w", label: "1 Week" },
    { key: "1m", label: "1 Month" },
  ].map((tf) => (
    <button
      key={tf.key}
      onClick={() => setTimeframe(tf.key as Timeframe)}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm 
        ${
          timeframe === tf.key
            ? "bg-[#B71C1C] text-white scale-105 shadow-md"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md"
        } cursor-pointer`}
    >
      {tf.label}
    </button>
  ))}
</div>


      {/* --- Chart --- */}
      <div style={{ width: "100%", height: 500 }}>
        <Chart options={options} series={series} type="area" height={500} />
      </div>
    </div>
  );
};

export default History;
