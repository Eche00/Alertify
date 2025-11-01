import  { useEffect, useState } from "react";
import {  collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CheckCircle, ErrorOutline, PriceChange, Refresh } from "@mui/icons-material";
import toast from "react-hot-toast";

// 🔗 API Endpoints
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const REDSTONE_API = "https://api.redstone.finance/prices";
const PYTH_FEEDS_API = "https://hermes.pyth.network/v2/price_feeds";
const PYTH_PRICE_API = "https://hermes.pyth.network/v2/updates/price/latest";

// 🪙 Symbol Lists
const CHAINLINK_COINS = [
  "bitcoin", "ethereum", "solana", "litecoin", "cardano",
  "polkadot", "binancecoin", "ripple", "matic-network", "dogecoin",
  "shiba-inu", "avalanche-2", "chainlink", "stellar", "tron",
  "vechain", "filecoin", "cosmos", "algorand", "internet-computer", "aptos",
  "arbitrum", "optimism", "sui", "hedera-hashgraph", "the-graph",
  "aave", "synthetix-network-token", "pancakeswap-token", "uniswap"
];

const REDSTONE_SYMBOLS = [
  "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
  "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
  "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
  "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI", "CRV"
]

const PYTH_SYMBOLS = [
  "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
  "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
  "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
  "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI"
];

//  FETCH FUNCTIONS
async function fetchChainlinkPrices() {
  try {
    const ids = CHAINLINK_COINS.join(",");
    const res = await fetch(`${COINGECKO_API}?ids=${ids}&vs_currencies=usd`);
    const data = await res.json();

    const prices: Record<string, any> = {};
    for (const coin of CHAINLINK_COINS) {
      const price = data[coin]?.usd;
      prices[coin.toUpperCase()] = {
        oracle: "Chainlink",
        price: price ?? null,
        status: price ? "Active" : "Failed",
        updated: new Date().toISOString(),
      };
    }
    return prices;
  } catch (err) {
    console.error("Chainlink Error:", err);
    return CHAINLINK_COINS.reduce((acc, c) => {
      acc[c.toUpperCase()] = { oracle: "Chainlink", price: null, status: "Failed", updated: new Date().toISOString() };
      return acc;
    }, {} as Record<string, any>);
  }
}

async function fetchRedstonePrices() {
  try {
    const res = await fetch(`${REDSTONE_API}?symbols=${REDSTONE_SYMBOLS.join(",")}`);
    const data = await res.json();

    const prices: Record<string, any> = {};
    for (const sym of REDSTONE_SYMBOLS) {
      const price = data[sym]?.value;
      const timestamp = data[sym]?.timestamp;
      prices[sym] = {
        oracle: "RedStone",
        price: price ?? null,
        status: price ? "Active" : "Failed",
        updated: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
      };
    }
    return prices;
  } catch (err) {
    console.error("Redstone Error:", err);
    return REDSTONE_SYMBOLS.reduce((acc, s) => {
      acc[s] = { oracle: "RedStone", price: null, status: "Failed", updated: new Date().toISOString() };
      return acc;
    }, {} as Record<string, any>);
  }
}

async function fetchPythPrices() {
  try {
    const feedsRes = await fetch(PYTH_FEEDS_API);
    const feedsData = await feedsRes.json();

  const selected = feedsData.filter((f: any) => {
  const base = f.attributes?.base;
  const display = f.attributes?.display_symbol || "";
  
  return (
    PYTH_SYMBOLS.includes(base) &&
    (display.includes("/USD") || display.includes("/USDT"))
  );
});


    if (selected.length === 0) return {};

    const query = selected.map((f: any) => `ids[]=${f.id}`).join("&");
    const pricesRes = await fetch(`${PYTH_PRICE_API}?${query}`);
    const pricesData = await pricesRes.json();

    const formatted: Record<string, any> = {};
    pricesData.parsed.forEach((p: any) => {
      const feed = selected.find((f: any) => f.id === p.id);
      const asset = feed?.attributes?.base || p.id;

      const rawPrice = Number(p.price.price);
      const expo = Number(p.price.expo);
      const realPrice = rawPrice * Math.pow(10, expo);
      
      formatted[asset.toUpperCase()] = {
        oracle: "Pyth",
        price: realPrice,
        status: "Active",
        updated: new Date(p.price.publish_time * 1000).toISOString(),
      };
    });

    return formatted;
  } catch (err) {
    console.error("Pyth Error:", err);
    return PYTH_SYMBOLS.reduce((acc, s) => {
      acc[s] = { oracle: "Pyth", price: null, status: "Failed", updated: new Date().toISOString() };
      return acc;
    }, {} as Record<string, any>);
  }
}

//  Fetch All Oracles
async function fetchAllPrices() {
  const [chainlink, redstone, pyth] = await Promise.all([
    fetchChainlinkPrices(),
    fetchRedstonePrices(),
    fetchPythPrices(),
  ]);
  return {
    chainlink,
    redstone,
    pyth,
    timestamp: new Date().toISOString(),
    created: Date.now(),
  };
}

export default function Pricefeedupdate() {
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [prices, setPrices] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto fetch on mount
  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllPrices();
      setPrices(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
  if (!prices) return;
  setPushing(true);
  setError(null);
  try {
    //  Create a new object with updated push timestamps
    const pushData = {
      ...prices,
      pushedAt: new Date().toISOString(), // new field for push time
      created: Date.now(), // overwrite or create a new one
    };

    await addDoc(collection(db, "priceHistory"), pushData);
    toast.success(" Successfully pushed to Firestore!");
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to push to Firestore");
  } finally {
    setPushing(false);
  }
};


  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
  <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
    <h1 className="text-3xl font-extrabold mb-6 text-[#B71C1C] flex items-center gap-2">
       Oracle Pricefeed Manager
    </h1>

    {loading ? (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B71C1C] border-t-transparent mb-4"></div>
        <p className="text-gray-700 font-medium">Fetching latest oracle data...</p>
      </div>
    ) : (
      <>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleFetch}
            disabled={loading}
            className="flex items-center gap-2 bg-[#B71C1C] hover:bg-[#a41818] text-white px-5 py-2.5 rounded-lg shadow transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            <Refresh/> Fetch Again
          </button>

          <button
            onClick={handlePush}
            disabled={pushing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {pushing ? "⏳ Pushing..." : "📤 Push to Firestore"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-2 mb-6">
            <ErrorOutline/> {error}
          </div>
        )}

        {prices && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                <CheckCircle/> Latest Fetched Prices
              </h2>
              <p className="text-gray-500 text-sm">
                Timestamp: <span className="font-medium">{prices.timestamp}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["redstone","chainlink",  "pyth"].map((oracle) => (
                <div
                  key={oracle}
                  className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-bold mb-3 capitalize text-[#B71C1C] flex items-center gap-2">
                    <span className="text-xl"><PriceChange/></span> {oracle}
                  </h3>
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <ul className="text-sm divide-y divide-gray-100">
                      {Object.entries(prices[oracle]).map(([sym, val]: any) => (
                        <li key={sym} className="flex justify-between py-1.5">
                          <span className="font-medium text-gray-800">{sym}</span>
                          <span
                            className={`${
                              val.price ? "text-green-600" : "text-gray-400"
                            } font-semibold`}
                          >
                            {val.price ? `$${val.price.toFixed(4)}` : "N/A"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </div>
</div>

  );
}
