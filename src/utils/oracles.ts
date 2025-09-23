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
  oracle: "Pyth";
  status: string;
  updated: string | number;
}

//  APIs 
const COINS = [
  "bitcoin", "ethereum", "solana", "litecoin", "cardano",
  "polkadot", "binancecoin", "ripple", "matic-network", "dogecoin",
  "shiba-inu", "avalanche-2", "chainlink", "stellar", "tron",
  "vechain", "filecoin", "cosmos", "algorand", "internet-computer"
];
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const REDSTONE_API = "https://api.redstone.finance/prices";
const REDSTONE_SYMBOLS = [
  "ETH", "BTC", "SOL", "LINK", "ADA", "DOT", "BNB", "XRP", "MATIC", "LTC",
  "DOGE", "UNI", "AVAX", "ATOM", "FIL", "ALGO", "TRX", "FTM", "NEAR", "ICP"
].join(",");
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
      const res = await fetch(PYTH_API);
      const result = await res.json();

      const formatted: PythFeed[] = (result.slice(0, 20) || []).map(
        (item: any) => ({
          asset: item.attributes?.base || item.id,
          oracle: "Pyth",
          status: "Active",
          price: item.attributes?.price?.price || "N/A",
          updated: new Date(item.attributes?.price?.publish_time * 1000).toLocaleTimeString() || "N/A",
        })
      );

      setData(formatted);
    } catch (err) {
      console.error("Error fetching Pyth feeds:", err);
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
