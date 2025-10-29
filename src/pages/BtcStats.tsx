import { useEffect, useState } from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
import History from "./History";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const REDSTONE_API = "https://api.redstone.finance/prices";
const PYTH_API = "https://hermes.pyth.network/v2";

const COINS = [
  "bitcoin", "ethereum", "solana", "litecoin", "cardano",
  "polkadot", "binancecoin", "ripple", "matic-network", "dogecoin",
  "shiba-inu", "avalanche-2", "chainlink", "stellar", "tron",
  "vechain", "filecoin", "cosmos", "algorand", "internet-computer", "aptos",
  "arbitrum", "optimism", "sui", "hedera-hashgraph", "the-graph",
  "aave", "synthetix-network-token", "pancakeswap-token", "uniswap"
];

const SYMBOLS = [
  "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
  "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
  "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
  "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI"
];

//  Type-safe timeframe mapping
type Timeframe = "12h" | "24h" | "7d" | "30d";

const timeframeMap: Record<Timeframe, number> = {
  "12h": 0.5,
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

//  Type for chart point
interface CoinDataPoint {
  time: string;
  price: number;
}

export default function OracleComparison() {
  const [chainlinkCoin, setChainlinkCoin] = useState("bitcoin");
  const [redstoneCoin, setRedstoneCoin] = useState("ethereum");
  const [pythCoin, setPythCoin] = useState("solana");
  const [timeframe, setTimeframe] = useState<Timeframe>("24h");

  const [prices, setPrices] = useState<{ chainlink?: number; redstone?: number; pyth?: number }>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //  Fetch Real-Time Prices
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const clRes = await fetch(`${COINGECKO_API}/simple/price?ids=${chainlinkCoin}&vs_currencies=usd`);
      const clJson = await clRes.json();
      const chainlinkPrice = clJson[chainlinkCoin]?.usd ?? undefined;

      const redSym = SYMBOLS[COINS.indexOf(redstoneCoin)] || "ETH";
      const rsRes = await fetch(`${REDSTONE_API}?symbols=${redSym}`);
      const rsJson = await rsRes.json();
      const redstonePrice = rsJson[redSym]?.value ?? undefined;

      const pythSym = SYMBOLS[COINS.indexOf(pythCoin)] || "SOL";
      const feedsRes = await fetch(`${PYTH_API}/price_feeds`);
      const feeds = await feedsRes.json();
      const selectedFeed = feeds.find(
        (f: any) =>
          f.attributes?.base === pythSym ||
          f.attributes?.display_symbol?.startsWith(pythSym + "/")
      );

      let pythValue;
      if (selectedFeed) {
        const latestRes = await fetch(`${PYTH_API}/updates/price/latest?ids[]=${selectedFeed.id}`);
        const latest = await latestRes.json();
        const parsed = latest.parsed?.[0];
        if (parsed?.price?.price && parsed?.price?.expo) {
          pythValue = Number(parsed.price.price) * Math.pow(10, parsed.price.expo);
        }
      }

      setPrices({ chainlink: chainlinkPrice, redstone: redstonePrice, pyth: pythValue });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch Historical Data for Chart
  const fetchHistoricalData = async (coinId: string, days: number): Promise<CoinDataPoint[]> => {
    const res = await fetch(`${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const data = await res.json();

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price,
    }));
  };

  // Load Chart Data
  const loadChartData = async () => {
    setLoading(true);
    const days = timeframeMap[timeframe] || 1;

    try {
      const [clData, rsData, pyData] = await Promise.all([
        fetchHistoricalData(chainlinkCoin, days),
        fetchHistoricalData(redstoneCoin, days),
        fetchHistoricalData(pythCoin, days),
      ]);

      const merged = clData.map((point: CoinDataPoint, i: number) => ({
        name: point.time,
        Chainlink: point.price,
        RedStone: rsData[i]?.price ?? null,
        Pyth: pyData[i]?.price ?? null,
      }));

      setChartData(merged);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    loadChartData();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [chainlinkCoin, redstoneCoin, pythCoin, timeframe]);

  return (
    <div className="p-6 grid gap-6 max-h-screen  overflow-scroll">
      <h1 className="text-2xl font-bold">Comparison Dashboard</h1>
      <p className="text-gray-600">Chainlink, RedStone & Pyth Oracle Comparison</p>

      {/* --- SELECTORS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Chainlink", color: "text-indigo-600", state: chainlinkCoin, set: setChainlinkCoin },
          { label: "RedStone", color: "text-red-500", state: redstoneCoin, set: setRedstoneCoin },
          { label: "Pyth", color: "text-purple-500", state: pythCoin, set: setPythCoin },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl shadow-sm bg-gray-300">
            <h2 className={`font-semibold mb-2 ${s.color}`}>{s.label} Coin</h2>
            <select
              value={s.state}
              onChange={(e) => s.set(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 outline-none"
            >
              {COINS.map((coin) => (
                <option key={coin} value={coin}>
                  {coin.charAt(0).toUpperCase() + coin.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {loading && <p>Loading prices...</p>}

      {!loading && (
        <>
          {/* --- PRICE CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              { label: "Chainlink", color: "text-indigo-600", val: prices.chainlink, sym: chainlinkCoin },
              { label: "RedStone", color: "text-red-500", val: prices.redstone, sym: redstoneCoin },
              { label: "Pyth", color: "text-purple-500", val: prices.pyth, sym: pythCoin },
            ].map((p) => (
              <div key={p.label} className="shadow-lg rounded-2xl p-4 bg-gray-400">
                <h2 className={`font-semibold ${p.color}`}>{p.label}</h2>
                <p className="text-xl font-bold">${p.val?.toLocaleString() ?? "—"}</p>
              </div>
            ))}
          </div>

          {/* --- CHART SECTION --- */}
          {/* <div className="w-full h-fit mt-10 p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-lg">
            <div className="w-full bg-slate-900 rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4 px-4">Oracle Price Comparison</h2>

              <ResponsiveContainer width="100%" height={350}>
  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
    <XAxis
      dataKey="name"
      stroke="#94a3b8"
      tick={{ fill: "#94a3b8", fontSize: 12 }}
      axisLine={{ stroke: "#475569" }}
      tickLine={{ stroke: "#475569" }}
      padding={{ left: 10, right: 10 }}
    />
    <YAxis
      stroke="#94a3b8"
      tick={{ fill: "#94a3b8", fontSize: 12 }}
      domain={["auto", "auto"]}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(30,41,59,0.9)",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
      }}
      labelStyle={{ color: "#cbd5e1" }}
    />
    <Legend
      wrapperStyle={{ color: "#cbd5e1", fontSize: 13 }}
      verticalAlign="top"
      height={40}
    />

    <defs>
      <linearGradient id="chainlinkGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
      </linearGradient>
      <linearGradient id="redstoneGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
      </linearGradient>
      <linearGradient id="pythGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
      </linearGradient>
    </defs>

    <Area
      type="monotone"
      dataKey="Chainlink"
      stroke="#3b82f6"
      strokeWidth={2}
      fillOpacity={1}
      fill="url(#chainlinkGradient)"
    />
    <Area
      type="monotone"
      dataKey="RedStone"
      stroke="#ef4444"
      strokeWidth={2}
      fillOpacity={1}
      fill="url(#redstoneGradient)"
    />
    <Area
      type="monotone"
      dataKey="Pyth"
      stroke="#a855f7"
      strokeWidth={2}
      fillOpacity={1}
      fill="url(#pythGradient)"
    />
  </AreaChart>
</ResponsiveContainer>


              <div className="flex justify-center mt-4">
                <div className="inline-flex bg-slate-800 rounded-lg shadow-inner border border-slate-700">
                  {[
                    { label: "12H", value: "12h" },
                    { label: "1D", value: "24h" },
                    { label: "1W", value: "7d" },
                    { label: "1M", value: "30d" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTimeframe(t.value as Timeframe)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg 
                        ${
                          timeframe === t.value
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-gray-400 hover:text-white hover:bg-slate-700"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
        </>
      )}
      <History/>
    </div>
  );
}
