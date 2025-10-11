"use client";

import React, { useMemo, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { toast } from "react-hot-toast";

import {
  useChainlinkFeeds,
  useRedstoneFeeds,
  usePythFeeds,
} from "../utils/oracles";

import type {
  ChainlinkFeed,
  RedstoneFeed,
  PythFeed,
} from "../utils/oracles";
import OracleComparison from "./BtcStats";

type OracleName = "Chainlink" | "RedStone" | "Pyth";

interface NormalizedFeed {
  assetKey: string;
  assetDisplay: string;
  oracle: OracleName;
  price: number | string;
}

const ASSET_NORMALIZATION_MAP: Record<string, string> = {
  //  normalization map...
  ethereum: "ETH", ETH: "ETH", eth: "ETH", bitcoin: "BTC", BTC: "BTC", btc: "BTC", solana: "SOL", SOL: "SOL", litecoin: "LTC", LTC: "LTC", cardano: "ADA", ADA: "ADA", polkadot: "DOT", DOT: "DOT", binancecoin: "BNB", BNB: "BNB", ripple: "XRP", XRP: "XRP", "matic-network": "MATIC", MATIC: "MATIC", dogecoin: "DOGE", DOGE: "DOGE", "shiba-inu": "SHIB", SHIB: "SHIB", "avalanche-2": "AVAX", AVAX: "AVAX", chainlink: "LINK", LINK: "LINK", stellar: "XLM", XLM: "XLM", tron: "TRX", TRX: "TRX", vechain: "VET", VET: "VET", filecoin: "FIL", FIL: "FIL", cosmos: "ATOM", ATOM: "ATOM", algorand: "ALGO", ALGO: "ALGO", "internet-computer": "ICP", ICP: "ICP", aptos: "APT", APT: "APT", arbitrum: "ARB", ARB: "ARB", optimism: "OP", OP: "OP", sui: "SUI", SUI: "SUI", "hedera-hashgraph": "HBAR", HBAR: "HBAR", "the-graph": "GRT", GRT: "GRT", aave: "AAVE", AAVE: "AAVE", "synthetix-network-token": "SNX", SNX: "SNX", "pancakeswap-token": "CAKE", CAKE: "CAKE", uniswap: "UNI", UNI: "UNI",
};

const normalizeAsset = (asset: string): { key: string; display: string } => {
  const display =
    ASSET_NORMALIZATION_MAP[asset] ||
    ASSET_NORMALIZATION_MAP[asset.toLowerCase()] ||
    asset.toUpperCase();
  const key = display.toLowerCase();
  return { key, display };
};

const Comparison: React.FC = () => {
  const {
    data: chainlinkData,
    loading: loadingChainlink,
    refetch: refetchChainlink,
  } = useChainlinkFeeds();
  const {
    data: redstoneData,
    loading: loadingRedstone,
    refetch: refetchRedstone,
  } = useRedstoneFeeds();
  const {
    data: pythData,
    loading: loadingPyth,
    refetch: refetchPyth,
  } = usePythFeeds();

  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allData: NormalizedFeed[] = useMemo(() => {
    const normalize = (
      feeds: (ChainlinkFeed | RedstoneFeed | PythFeed)[]
    ): NormalizedFeed[] =>
      feeds.map((f) => {
        const { key, display } = normalizeAsset(f.asset);
        return {
          assetKey: key,
          assetDisplay: display,
          oracle: f.oracle as OracleName,
          price: f.price,
        };
      });

    return [
      ...normalize(chainlinkData || []),
      ...normalize(redstoneData || []),
      ...normalize(pythData || []),
    ];
  }, [chainlinkData, redstoneData, pythData]);

  // Unique asset pairs
  const assetKeyDisplayPairs = Array.from(
    new Map(allData.map((feed) => [feed.assetKey, feed.assetDisplay]))
  );

  const oracles: OracleName[] = ["Chainlink", "RedStone", "Pyth"];

  const isLoading =
    loadingChainlink || loadingRedstone || loadingPyth || refreshing;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchChainlink(),
        refetchRedstone(),
        refetchPyth(),
      ]);
      toast.success("Feeds refreshed");
    } catch (err) {
      toast.error("Failed to refresh feeds");
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered assets based on search term (case-insensitive)
  const filteredAssets = assetKeyDisplayPairs.filter(([ display]) =>
    display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sm:p-8 p-2 min-h-screen">

<OracleComparison/>

      <div className="mb-6 flex md:flex-row flex-col md:items-center items-start justify-between gap-4">
      <h1 className="text-2xl font-bold mb-6 md:text-wrap text-nowrap">
        Price Feeds
      </h1>

      {/* Search Input */}
      <div className=" flex md:flex-row flex-col-reverse md:items-center items-start justify-between gap-4">
      
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:min-w-[300px] min-w-[100%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
        />

<button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-[#B71C1C] disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white py-2 px-[16px] text-[12px] rounded-[8px] cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <Refresh fontSize="medium" />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      </div>

      {isLoading && !refreshing ? (
        <div className="text-gray-600 text-lg">Loading data...</div>
      ) : (
        <div className="overflow-x-auto pb-10">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-nowrap ">
            <thead className="bg-[#B71C1C] text-slate-100">
              <tr>
                <th className="py-3 px-6 text-left">Asset</th>
                {oracles.map((oracle) => (
                  <th key={oracle} className="py-3 px-6 text-left">
                    {oracle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={oracles.length + 1} className="text-center p-4">
                    No assets found.
                  </td>
                </tr>
              ) : (
                filteredAssets
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map(([assetKey, assetDisplay], index) => {
                    const prices = oracles.map((oracle) => {
                      const feed = allData.find(
                        (f) => f.assetKey === assetKey && f.oracle === oracle
                      );
                      const price =
                        feed && !isNaN(Number(feed.price))
                          ? Number(feed.price)
                          : null;
                      return price;
                    });

                    const sortedPrices = prices
                      .filter((p): p is number => p !== null)
                      .sort((a, b) => a - b);

                    return (
                      <tr
                        key={assetKey}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-3 border border-gray-300">{assetDisplay}</td>
                        {oracles.map((oracle, i) => {
                          const price = prices[i];

                          let colorClass = "";
                          if (price === null) {
                            colorClass = "";
                          } else {
                            const rank = sortedPrices.indexOf(price);
                            if (rank === 0) colorClass = "text-red-600";
                            else if (
                              rank === sortedPrices.length - 1 &&
                              sortedPrices.length > 1
                            )
                              colorClass = "text-green-600";
                            else colorClass = "text-yellow-600";
                          }

                          return (
                            <td
                              key={oracle + assetKey}
                              className={`py-3 px-6 font-mono ${colorClass}`}
                            >
                              {price !== null ? `$${price.toFixed(4)}` : "N/A"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comparison;
