"use client";

import { useState, useEffect } from "react";

//  Feed Interfaces 
export interface ChainlinkFeed {
  asset: string;
  oracle: "Chainlink";
  status: string;
  price: number | string;
  updated: string | number;
}

export interface RedstoneFeed {
  asset: string;
  oracle: "RedStone";
  price: number;
  status: string;
  updated: string | number;
}

export interface PythFeed {
  asset: string;
  oracle: string;
  status: string;
  price: any;
  updated: string;
}

//  APIs 
// Chainlink uses CoinGecko IDs:
const COINS = [
  "bitcoin", "ethereum", "solana", "litecoin", "cardano",
  "polkadot", "binancecoin", "ripple", "matic-network", "dogecoin",
  "shiba-inu", "avalanche-2", "chainlink", "stellar", "tron",
  "vechain", "filecoin", "cosmos", "algorand", "internet-computer", "aptos",
  "arbitrum", "optimism", "sui", "hedera-hashgraph", "the-graph",
  "aave", "synthetix-network-token", "pancakeswap-token", "uniswap"
];

// Symbols used for Pyth filtering (uppercase symbols):
const symbols = [
  "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
  "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
  "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
  "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI"
];

// RedStone symbols — must match their API supported symbols exactly:
const REDSTONE_SYMBOLS = [
  "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
  "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
  "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
  "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI", "CRV"
].join(",");

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const REDSTONE_API = "https://api.redstone.finance/prices";



const PYTH_API = "https://hermes.pyth.network/v2/price_feeds";

//  Chainlink Hook 
export function useChainlinkFeeds() {
  const [data, setData] = useState<ChainlinkFeed[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ids = COINS.join(",");
      const res = await fetch(`${COINGECKO_API}?ids=${ids}&vs_currencies=usd`);
      const result = await res.json();

      const formatted: ChainlinkFeed[] = COINS.map((coin) => ({
        asset: coin.toUpperCase(),
        oracle: "Chainlink",
        status: "Active",
        price: result[coin]?.usd ?? "N/A",
        updated: new Date().toLocaleTimeString(), // shows current time
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}

//  RedStone Hook 
export function useRedstoneFeeds() {
  const [data, setData] = useState<RedstoneFeed[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${REDSTONE_API}?symbols=${REDSTONE_SYMBOLS}`);
      const result = await res.json();

      const formatted: RedstoneFeed[] = Object.keys(result)
        .map((symbol: string) => ({
          asset: symbol,
          oracle: "RedStone",
          price: result[symbol]?.value ?? "N/A",
          status: "Active",
          updated: result[symbol]?.timestamp
            ? new Date(result[symbol].timestamp).toLocaleTimeString()
            : "N/A",
        }));


      setData(formatted);
    } catch (err) {
      console.error("Error fetching RedStone feeds:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

  }, []);

  return { data, loading, refetch: fetchData };
}

//  Pyth Hook 

export function usePythFeeds() {
  const [data, setData] = useState<PythFeed[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get all feeds
      const feedsRes = await fetch(PYTH_API);
      const feeds = await feedsRes.json();

      // 2. Filter for your selected symbols
      const selected = feeds.filter((f: any) =>
        symbols.includes(f.attributes?.base) ||
        symbols.includes(f.attributes?.display_symbol?.split("/")?.[0])
      );

      if (selected.length === 0) {
        setData([]);
        return;
      }

      // 3. Fetch latest prices for those IDs
      const query = selected.map((f: any) => `ids[]=${f.id}`).join("&");
      const pricesRes = await fetch(`https://hermes.pyth.network/v2/updates/price/latest?${query}`);
      const prices = await pricesRes.json();

      // 4. Merge metadata + prices
      const formatted: PythFeed[] = prices.parsed.map((p: any) => {
        const feed = selected.find((f: any) => f.id === p.id);
        const asset = feed?.attributes?.base || p.id;

        const rawPrice = Number(p.price.price);
        const expo = Number(p.price.expo);
        const realPrice = rawPrice * Math.pow(10, expo); // Apply exponent

        return {
          asset,
          oracle: "Pyth",
          status: "Active",
          price: realPrice.toFixed(6), // e.g. 24.965933
          updated: new Date(p.price.publish_time * 1000).toLocaleTimeString("en-GB", {
            hour12: false
          }),
        };
      });

      setData(formatted);
    } catch (err) {
      console.error("Error fetching Pyth feeds:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}



