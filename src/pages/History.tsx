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
  chainlink?: Record<string, OraclePrice>;
  redstone?: Record<string, OraclePrice>;
  pyth?: Record<string, OraclePrice>;
  [key: string]: any;
}

const History: React.FC = () => {
  const [data, setData] = useState<FirestoreDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [chainlinkCoin, setChainlinkCoin] = useState("btc");
  const [redstoneCoin, setRedstoneCoin] = useState("eth");
  const [pythCoin, setPythCoin] = useState("sol");

  // 🔥 Fetch Firestore data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "priceHistory"), orderBy("timestamp", "asc"), limit(720));
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

    // refresh hourly
    const interval = setInterval(fetchData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 Filter data based on timeframe
  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeframe === "daily") cutoff.setDate(now.getDate() - 1);
    if (timeframe === "weekly") cutoff.setDate(now.getDate() - 7);
    if (timeframe === "monthly") cutoff.setDate(now.getDate() - 30);

    return data.filter((doc) => new Date(doc.timestamp) >= cutoff);
  }, [data, timeframe]);

  // 🧩 Merge timestamps across all oracles (to align x-axis)
  const allTimestamps = useMemo(() => {
    const set = new Set<string>();
    filteredData.forEach((doc) => {
      set.add(new Date(doc.timestamp).toISOString());
    });
    return Array.from(set).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  // 🧮 Build series aligned to merged timestamps
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
    xaxis: { categories: buildSeriesData.x, labels: { style: { fontSize: "10px" } } },
    yaxis: {
      labels: {
        formatter: (v) => `$${v.toFixed(2)}`,
        style: { fontSize: "10px" },
      },
    },
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Oracle Price History (Live)</h1>

      {/* Timeframe Selector */}
      <div className="flex gap-3 mb-6">
        {["daily", "weekly", "monthly"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              timeframe === tf ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Coin Selectors */}
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
              {Object.keys(data[0]?.chainlink || {}).map((coin) => (
                <option key={coin} value={coin}>
                  {coin.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", height: 500 }}>
        <Chart options={options} series={series} type="area" height={500} />
      </div>
    </div>
  );
};

export default History;
