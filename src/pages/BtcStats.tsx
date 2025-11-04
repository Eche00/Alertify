"use client";
import { useEffect, useState } from "react";
import History from "./History";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const REDSTONE_API = "https://api.redstone.finance/prices";
const PYTH_API = "https://hermes.pyth.network/v2";

// ✅ Full Coin List (CoinGecko IDs)
const COINS = [
  "bitcoin", "ethereum", "solana", "litecoin", "cardano",
  "polkadot", "binancecoin", "ripple", "matic-network", "dogecoin",
  "shiba-inu", "avalanche-2", "chainlink", "stellar", "tron",
  "vechain", "filecoin", "cosmos", "algorand", "internet-computer",
  "aptos", "arbitrum", "optimism", "sui", "hedera-hashgraph",
  "the-graph", "aave", "synthetix-network-token", "pancakeswap-token", "uniswap"
];

// ✅ Clean Symbol Map (for 1:1 comparison)
const SYMBOL_MAP: Record<string, string> = {
  "bitcoin": "BTC",
  "ethereum": "ETH",
  "solana": "SOL",
  "litecoin": "LTC",
  "cardano": "ADA",
  "polkadot": "DOT",
  "binancecoin": "BNB",
  "ripple": "XRP",
  "matic-network": "MATIC",
  "dogecoin": "DOGE",
  "shiba-inu": "SHIB",
  "avalanche-2": "AVAX",
  "chainlink": "LINK",
  "stellar": "XLM",
  "tron": "TRX",
  "vechain": "VET",
  "filecoin": "FIL",
  "cosmos": "ATOM",
  "algorand": "ALGO",
  "internet-computer": "ICP",
  "aptos": "APT",
  "arbitrum": "ARB",
  "optimism": "OP",
  "sui": "SUI",
  "hedera-hashgraph": "HBAR",
  "the-graph": "GRT",
  "aave": "AAVE",
  "synthetix-network-token": "SNX",
  "pancakeswap-token": "CAKE",
  "uniswap": "UNI",
};

export default function OracleComparison() {
  const [chainlinkCoin, setChainlinkCoin] = useState("bitcoin");
  const [redstoneCoin, setRedstoneCoin] = useState("ethereum");
  const [pythCoin, setPythCoin] = useState("solana");

  const [prices, setPrices] = useState<{ chainlink?: number; redstone?: number; pyth?: number }>({});
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Real-Time Prices
  const fetchPrices = async () => {
    setLoading(true);
    try {
      // --- Chainlink (via CoinGecko) ---
      const clRes = await fetch(`${COINGECKO_API}/simple/price?ids=${chainlinkCoin}&vs_currencies=usd`);
      const clJson = await clRes.json();
      const chainlinkPrice = clJson[chainlinkCoin]?.usd ?? undefined;

      // --- RedStone ---
      const redSym = SYMBOL_MAP[redstoneCoin] || "ETH";
      const rsRes = await fetch(`${REDSTONE_API}?symbols=${redSym}`);
      const rsJson = await rsRes.json();
      const redstonePrice = rsJson[redSym]?.value ?? undefined;

      // --- Pyth ---
      const pythSym = SYMBOL_MAP[pythCoin] || "SOL";
      const feedsRes = await fetch(`${PYTH_API}/price_feeds`);
      const feeds = await feedsRes.json();

      // Match feed symbol by “SYM/USD” or “SYMUSD”
      const selectedFeed = feeds.find((f: any) => {
        const sym = f.attributes?.display_symbol?.toUpperCase?.();
        return sym === `${pythSym}/USD` || sym === `${pythSym}USD`;
      });

      let pythValue: number | undefined = undefined;
      if (selectedFeed?.id) {
        const latestRes = await fetch(`${PYTH_API}/updates/price/latest?ids[]=${selectedFeed.id}`);
        const latest = await latestRes.json();
        const parsed = latest.parsed?.[0];
        if (parsed?.price?.price != null && parsed?.price?.expo != null) {
          pythValue = parsed.price.price * Math.pow(10, parsed.price.expo);
        }
      }

      setPrices({ chainlink: chainlinkPrice, redstone: redstonePrice, pyth: pythValue });
    } catch (err) {
      console.error("Error fetching oracle data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-refresh every minute
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [chainlinkCoin, redstoneCoin, pythCoin]);

  return (
    <div className="p-6 grid gap-6 max-h-screen overflow-scroll">
      <h1 className="text-2xl font-bold">Comparison Dashboard</h1>
      <p className="text-gray-600">Chainlink, RedStone & Pyth Oracle Comparison</p>

      {/* --- COIN SELECTORS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "RedStone", color: "text-red-500", state: redstoneCoin, set: setRedstoneCoin },
          { label: "Chainlink", color: "text-indigo-600", state: chainlinkCoin, set: setChainlinkCoin },
          { label: "Pyth", color: "text-purple-500", state: pythCoin, set: setPythCoin },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl shadow-sm bg-gray-300">
            <h2 className={`font-semibold mb-2 ${s.color}`}>{s.label}</h2>
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
              { label: "RedStone", img: "https://cryptocurrencyjobs.co/startups/assets/logos/redstone.png", val: prices.redstone },
              { label: "Chainlink", img: "https://images.seeklogo.com/logo-png/42/1/chainlink-link-logo-png_seeklogo-423097.png", val: prices.chainlink },
              { label: "Pyth", img: "https://cryptocurrencyjobs.co/startups/assets/logos/pyth.jpg", val: prices.pyth },
            ].map((p) => (
              <div key={p.label} className="shadow-lg rounded-2xl p-4 bg-[#0f172a] text-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{p.label}</h2>
                  <img src={p.img} alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                </div>
                <p className="text-xl font-bold mt-2">
                  {p.val ? `$${p.val.toLocaleString()}` : "—"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- HISTORICAL CHART --- */}
      {/* <History
        redstoneCoin={redstoneCoin}
        pythCoin={pythCoin}
      /> */}
          <History
          chainlinkCoin={chainlinkCoin}

  redstoneCoin={SYMBOL_MAP[redstoneCoin] || redstoneCoin.toUpperCase()}
  pythCoin={SYMBOL_MAP[pythCoin] || pythCoin.toUpperCase()}
/>

    </div>
  );
}
