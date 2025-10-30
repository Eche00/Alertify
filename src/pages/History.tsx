"use client";
import React, { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

type Oracle = "Chainlink" | "RedStone" | "Pyth";

interface OraclePrice {
  price: number | null;
  status: string;
  error?: string | null;
}

interface FirestoreDoc {
  timestamp: string;
  created: number;
  chainlink?: Record<string, OraclePrice>;
  redstone?: Record<string, OraclePrice>;
  pyth?: Record<string, OraclePrice>;
  [key: string]: any;
}

interface Props {
  chainlinkCoin: string;
  redstoneCoin: string;
  pythCoin: string;
}

const History: React.FC<Props> = ({ chainlinkCoin, redstoneCoin, pythCoin }) => {
  const [data, setData] = useState<FirestoreDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"halfday" | "daily" | "weekly" | "monthly">("halfday");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "priceHistory"), orderBy("created", "asc"), limit(720));
        const snapshot = await getDocs(q);
        const docs: FirestoreDoc[] = snapshot.docs.map((doc) => doc.data() as FirestoreDoc);
        setData(docs);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeframe === "halfday") cutoff.setHours(now.getHours() - 12);
    if (timeframe === "daily") cutoff.setDate(now.getDate() - 1);
    if (timeframe === "weekly") cutoff.setDate(now.getDate() - 7);
    if (timeframe === "monthly") cutoff.setDate(now.getDate() - 30);

    return data.filter((doc) => new Date(doc.timestamp) >= cutoff);
  }, [data, timeframe]);

  const allTimestamps = useMemo(() => {
    const set = new Set<string>();
    filteredData.forEach((doc) => set.add(new Date(doc.timestamp).toISOString()));
    return Array.from(set).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  const buildSeriesData = useMemo(() => {
    const toMap = (oracle: Oracle, coin: string) => {
      const oracleKey = oracle.toLowerCase();
      const map = new Map<string, number>();
      filteredData.forEach((doc) => {
        const entry = doc[oracleKey]?.[coin];
        if (entry && entry.price !== null) {
          map.set(new Date(doc.timestamp).toISOString(), entry.price);
        }
      });
      return map;
    };

    const chainlinkMap = toMap("Chainlink", chainlinkCoin);
    const redstoneMap = toMap("RedStone", redstoneCoin);
    const pythMap = toMap("Pyth", pythCoin);

    const times = allTimestamps.map((t) =>
      new Date(t).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

    return {
      x: times,
      chainlink: allTimestamps.map((t) => chainlinkMap.get(t) ?? null),
      redstone: allTimestamps.map((t) => redstoneMap.get(t) ?? null),
      pyth: allTimestamps.map((t) => pythMap.get(t) ?? null),
    };
  }, [filteredData, chainlinkCoin, redstoneCoin, pythCoin, allTimestamps]);

  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] },
    },
    xaxis: { categories: buildSeriesData.x },
    colors: ["#0070f3", "#B71C1C", "#27ae60"],
    legend: { position: "top" },
    tooltip: { y: { formatter: (v) => (v ? `$${v.toLocaleString()}` : "-") } },
  };

  const series = [
    { name: `Chainlink (${chainlinkCoin.toUpperCase()})`, data: buildSeriesData.chainlink },
    { name: `RedStone (${redstoneCoin.toUpperCase()})`, data: buildSeriesData.redstone },
    { name: `Pyth (${pythCoin.toUpperCase()})`, data: buildSeriesData.pyth },
  ];

  if (loading) return <p className="p-8 text-gray-500">Loading chart data...</p>;

  return (
    <div className="w-full h-fit mt-10 p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-lg">
      <div className="w-full bg-slate-900 rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4 px-4">
          Oracle Price History (Live)
        </h2>

        {/* --- Timeframe Toggle --- */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-800 rounded-lg shadow-inner border border-slate-700">
            {["halfday", "daily", "weekly", "monthly"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  timeframe === tf
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {tf === "halfday"
                  ? "12H"
                  : tf === "daily"
                  ? "1D"
                  : tf === "weekly"
                  ? "1W"
                  : "1M"}
              </button>
            ))}
          </div>
        </div>

        {/* --- Apex Chart --- */}
        <div className="w-full h-[450px]">
          <Chart
            options={{
              ...options,
              chart: {
                ...options.chart,
                background: "transparent",
              },
              grid: {
                borderColor: "rgba(255,255,255,0.1)",
              },
              xaxis: {
                ...options.xaxis,
                labels: {
                  style: { colors: "#94a3b8", fontSize: "12px" },
                },
                axisBorder: { color: "#475569" },
                axisTicks: { color: "#475569" },
              },
              yaxis: {
                labels: {
                  style: { colors: "#94a3b8", fontSize: "12px" },
                },
              },
              legend: {
                ...options.legend,
                labels: { colors: "#cbd5e1" },
              },
              tooltip: {
                ...options.tooltip,
                theme: "dark",
              },
            }}
            series={series}
            type="area"
            height={450}
          />
        </div>
      </div>
    </div>
  );
};

export default History;
