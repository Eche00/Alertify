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
  timestamp?: string;
  pushedAt?: string;
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

  const { latestTwo, filteredData } = useMemo(() => {
    if (data.length === 0) return { latestTwo: [], filteredData: [] };
    const sorted = [...data].sort((a, b) => a.created - b.created);
    const latestTwo = sorted.slice(-2);
    const latestTimestamp = latestTwo.at(-1)?.created || 0;

    const now = new Date(latestTimestamp);
    const cutoff = new Date(latestTimestamp);
    if (timeframe === "halfday") cutoff.setHours(now.getHours() - 12);
    if (timeframe === "daily") cutoff.setDate(now.getDate() - 1);
    if (timeframe === "weekly") cutoff.setDate(now.getDate() - 7);
    if (timeframe === "monthly") cutoff.setDate(now.getDate() - 30);

    const filteredData = sorted.filter((doc) => {
      const ts = new Date(doc.timestamp || doc.pushedAt || doc.created);
      return ts >= cutoff;
    });

    return { latestTwo, filteredData };
  }, [data, timeframe]);

  const allTimestamps = useMemo(() => {
    const set = new Set<string>();
    filteredData.forEach((doc) => {
      const ts = doc.timestamp || doc.pushedAt || doc.created;
      if (ts) set.add(new Date(ts).toISOString());
    });
    return Array.from(set).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  // ✅ FIXED: Normalized lookup function with alias handling
  const buildSeriesData = useMemo(() => {
    const toMap = (oracle: Oracle, coin: string) => {
      const oracleKeyMap: Record<Oracle, string> = {
        Chainlink: "chainlink",
        RedStone: "redstone",
        Pyth: "pyth",
      };
      const oracleKey = oracleKeyMap[oracle];
      const map = new Map<string, number>();

      const normalize = (s: string) => s.replace(/[-_ ]/g, "").toUpperCase();

      const coinVariants: Record<string, string[]> = {
        BITCOIN: ["BITCOIN", "BTC"],
        ETHEREUM: ["ETHEREUM", "ETH"],
        SOLANA: ["SOLANA", "SOL"],
        AVALANCHE: ["AVALANCHE", "AVAX"],
        POLKADOT: ["POLKADOT", "DOT"],
        CHAINLINK: ["CHAINLINK", "LINK"],
        OPTIMISM: ["OPTIMISM", "OP"],
        DOGECOIN: ["DOGECOIN", "DOGE"],
        RIPPLE: ["RIPPLE", "XRP"],
        STELLAR: ["STELLAR", "XLM"],
        CARDANO: ["CARDANO", "ADA"],
        HEDERAHASHGRAPH: ["HEDERAHASHGRAPH", "HBAR"],
        INTERNETCOMPUTER: ["INTERNETCOMPUTER", "ICP"],
        SYNTHETIXNETWORKTOKEN: ["SYNTHETIXNETWORKTOKEN", "SNX"],
        THEGRAPH: ["THEGRAPH", "GRT"],
        TRON: ["TRON", "TRX"],
        VECHAIN: ["VECHAIN", "VET"],
        SUI: ["SUI"],
      };

      const normalizedCoin = normalize(coin);
      const variants =
        coinVariants[normalizedCoin] ??
        [coin, coin.toUpperCase(), coin.toLowerCase(), normalize(coin)];

      filteredData.forEach((doc) => {
        const source = doc[oracleKey];
        if (!source) return;

        const matchKey = Object.keys(source).find((key) =>
          variants.some((v) => normalize(key).includes(normalize(v)))
        );

        if (matchKey) {
          const entry = source[matchKey];
          if (entry && entry.price !== null) {
            map.set(new Date(doc.timestamp || doc.pushedAt || doc.created).toISOString(), entry.price);
          }
        }
      });

      return map;
    };

    const chainlinkMap = toMap("Chainlink", chainlinkCoin);
    const redstoneMap = toMap("RedStone", redstoneCoin);
    const pythMap = toMap("Pyth", pythCoin);

    const formattedTimes = allTimestamps.map((t) =>
      new Date(t).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

    return {
      x: formattedTimes,
      chainlink: allTimestamps.map((t) => chainlinkMap.get(t) ?? null),
      redstone: allTimestamps.map((t) => redstoneMap.get(t) ?? null),
      pyth: allTimestamps.map((t) => pythMap.get(t) ?? null),
    };
  }, [filteredData, chainlinkCoin, redstoneCoin, pythCoin, allTimestamps]);

  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
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
    <div className="w-full mt-10 p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-lg">
      <div className="w-full bg-slate-900 rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4 px-4">Oracle Price History</h2>

        {/* Timeframe Controls */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-800 rounded-lg border border-slate-700">
            {[ "halfday", "daily", "weekly", "monthly"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  timeframe === tf
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                { tf === "halfday" ? "12H" : tf === "daily" ? "1D" : tf === "weekly" ? "1W" : "1M"}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <Chart
          options={{
            ...options,
            chart: { ...options.chart, background: "transparent" },
            grid: { borderColor: "rgba(255,255,255,0.1)" },
            xaxis: {
              ...options.xaxis,
              labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
              axisBorder: { color: "#475569" },
              axisTicks: { color: "#475569" },
            },
            yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "12px" } } },
            legend: { ...options.legend, labels: { colors: "#cbd5e1" } },
            tooltip: { ...options.tooltip, theme: "dark" },
          }}
          series={series}
          type="area"
          height={450}
        />

        {/* Price Table */}
       <div className="mt-8 w-full overflow-x-auto rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
  <table className="w-full min-w-[600px] text-sm text-gray-300 border-t border-slate-700">
    <thead className="bg-slate-800 text-gray-200">
      <tr>
        <th className="px-4 py-2 text-left whitespace-nowrap">Timestamp</th>
        <th className="px-4 py-2 text-left whitespace-nowrap">Chainlink</th>
        <th className="px-4 py-2 text-left whitespace-nowrap">RedStone</th>
        <th className="px-4 py-2 text-left whitespace-nowrap">Pyth</th>
      </tr>
    </thead>
    <tbody>
      {buildSeriesData.x.map((time, i) => (
        <tr
          key={time}
          className={`${
            i % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"
          } hover:bg-slate-700/30 transition-colors duration-200`}
        >
          <td className="px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{time}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            {buildSeriesData.chainlink[i]
              ? `$${buildSeriesData.chainlink[i]?.toLocaleString()}`
              : "-"}
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            {buildSeriesData.redstone[i]
              ? `$${buildSeriesData.redstone[i]?.toLocaleString()}`
              : "-"}
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            {buildSeriesData.pyth[i]
              ? `$${buildSeriesData.pyth[i]?.toLocaleString()}`
              : "-"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {latestTwo.length > 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Latest entries:{" "}
            <span className="text-gray-300">
              {new Date(latestTwo[0].timestamp || latestTwo[0].created).toLocaleString()} →{" "}
              {new Date(latestTwo.at(-1)!.timestamp || latestTwo.at(-1)!.created).toLocaleString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default History;
