import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
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

export default function OracleComparison() {
  const [chainlinkCoin, setChainlinkCoin] = useState("bitcoin");
  const [redstoneCoin, setRedstoneCoin] = useState("ethereum");
  const [pythCoin, setPythCoin] = useState("solana");

  const [prices, setPrices] = useState<{
    chainlink?: number;
    redstone?: number;
    pyth?: number;
  }>({});

  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      // ---- Chainlink
      const clRes = await fetch(
        `${COINGECKO_API}?ids=${chainlinkCoin}&vs_currencies=usd`
      );
      const clJson = await clRes.json();
      const chainlinkPrice = clJson[chainlinkCoin]?.usd ?? undefined;

      // ---- RedStone
      const redSym = SYMBOLS[COINS.indexOf(redstoneCoin)] || "ETH";
      const rsRes = await fetch(`${REDSTONE_API}?symbols=${redSym}`);
      const rsJson = await rsRes.json();
      const redstonePrice = rsJson[redSym]?.value ?? undefined;

      // ---- Pyth
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
        const latestRes = await fetch(
          `${PYTH_API}/updates/price/latest?ids[]=${selectedFeed.id}`
        );
        const latest = await latestRes.json();
        const parsed = latest.parsed?.[0];
        if (parsed?.price?.price && parsed?.price?.expo) {
          pythValue =
            Number(parsed.price.price) * Math.pow(10, parsed.price.expo);
        }
      }

      setPrices({
        chainlink: chainlinkPrice,
        redstone: redstonePrice,
        pyth: pythValue,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [chainlinkCoin, redstoneCoin, pythCoin]);

  // Prepare chart data
  const chartData = [
    {
      name: "Current Prices",
      Chainlink: prices.chainlink ?? 0,
      RedStone: prices.redstone ?? 0,
      Pyth: prices.pyth ?? 0,
    },
  ];

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold"> Comparison Dashboard</h1>
      <p className="text-gray-600">
        Chainlink, RedStone & Pyth.
      </p>

      {/* SELECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4  rounded-2xl shadow-sm bg-gray-300">
          <h2 className="font-semibold mb-2 text-indigo-600">Chainlink Coin</h2>
          <select
            value={chainlinkCoin}
            onChange={(e) => setChainlinkCoin(e.target.value)}
            className="w-full border border-gray-400 rounded-lg p-2 outline-none"
          >
            {COINS.map((coin) => (
              <option key={coin} value={coin}>
                {coin.charAt(0).toUpperCase() + coin.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl shadow-sm bg-gray-300">
          <h2 className="font-semibold mb-2 text-red-500">RedStone Coin</h2>
          <select
            value={redstoneCoin}
            onChange={(e) => setRedstoneCoin(e.target.value)}
            className="w-full border border-gray-400 rounded-lg p-2 outline-none"
          >
            {COINS.map((coin) => (
              <option key={coin} value={coin}>
                {coin.charAt(0).toUpperCase() + coin.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4  rounded-2xl shadow-sm bg-gray-300">
          <h2 className="font-semibold mb-2 text-purple-500">Pyth Coin</h2>
          <select
            value={pythCoin}
            onChange={(e) => setPythCoin(e.target.value)}
            className="w-full border border-gray-400 rounded-lg p-2 outline-none"
          >
            {COINS.map((coin) => (
              <option key={coin} value={coin}>
                {coin.charAt(0).toUpperCase() + coin.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading prices...</p>}

      {!loading && (
        <>
          {/* PRICE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="shadow-lg rounded-2xl p-4  bg-gray-400">
              <h2 className="font-semibold text-indigo-600">
                Chainlink ({SYMBOLS[COINS.indexOf(chainlinkCoin)]})
              </h2>
              <p className="text-xl font-bold">
                ${prices.chainlink?.toLocaleString() ?? "—"}
              </p>
            </div>

            <div className="shadow-lg rounded-2xl p-4  bg-gray-400">
              <h2 className="font-semibold text-red-500">
                RedStone ({SYMBOLS[COINS.indexOf(redstoneCoin)]})
              </h2>
              <p className="text-xl font-bold">
                ${prices.redstone?.toLocaleString() ?? "—"}
              </p>
            </div>

            <div className="shadow-lg rounded-2xl p-4  bg-gray-400">
              <h2 className="font-semibold text-purple-500">
                Pyth ({SYMBOLS[COINS.indexOf(pythCoin)]})
              </h2>
              <p className="text-xl font-bold">
                ${prices.pyth?.toLocaleString() ?? "—"}
              </p>
            </div>
          </div>

          {/* MULTI-LINE CHART */}
          <div className="w-full h-80 mt-8">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Chainlink"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="RedStone"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Pyth"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
