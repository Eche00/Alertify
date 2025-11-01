// import { db } from "../src/lib/firebase";
// import { collection, addDoc } from "firebase/firestore";

// const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
// const REDSTONE_API = "https://api.redstone.finance/prices";
// const PYTH_FEEDS_API = "https://hermes.pyth.network/v2/price_feeds";
// const PYTH_PRICE_API = "https://hermes.pyth.network/v2/updates/price/latest";

// const CHAINLINK_COINS = [
//   "bitcoin", "ethereum", "solana", "litecoin", "cardano",
//   "polkadot", "binancecoin", "ripple", "matic-network", "dogecoin",
//   "shiba-inu", "avalanche-2", "chainlink", "stellar", "tron",
//   "vechain", "filecoin", "cosmos", "algorand", "internet-computer", "aptos",
//   "arbitrum", "optimism", "sui", "hedera-hashgraph", "the-graph",
//   "aave", "synthetix-network-token", "pancakeswap-token", "uniswap"
// ] as const;

// const REDSTONE_SYMBOLS = [
//   "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
//   "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
//   "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
//   "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI", "CRV"
// ] as const;

// const PYTH_SYMBOLS = [
//   "BTC", "ETH", "SOL", "LTC", "ADA", "DOT", "BNB", "XRP",
//   "MATIC", "DOGE", "SHIB", "AVAX", "LINK", "XLM", "TRX",
//   "VET", "FIL", "ATOM", "ALGO", "ICP", "APT", "ARB", "OP",
//   "SUI", "HBAR", "GRT", "AAVE", "SNX", "CAKE", "UNI"
// ] as const;

// interface PriceData {
//   oracle: string;
//   price: number | null;
//   status: "Active" | "Failed";
//   updated: string;
// }

// async function fetchChainlinkPrices(): Promise<Record<string, PriceData>> {
//   const ids = CHAINLINK_COINS.join(",");
//   const res = await fetch(`${COINGECKO_API}?ids=${ids}&vs_currencies=usd`);
//   const data: Record<string, { usd: number }> = await res.json();

//   const prices: Record<string, PriceData> = {};
//   for (const coin of CHAINLINK_COINS) {
//     const price = data[coin]?.usd ?? null;
//     prices[coin.toUpperCase()] = {
//       oracle: "Chainlink",
//       price,
//       status: price ? "Active" : "Failed",
//       updated: new Date().toISOString(),
//     };
//   }
//   return prices;
// }

// async function fetchRedstonePrices(): Promise<Record<string, PriceData>> {
//   const res = await fetch(`${REDSTONE_API}?symbols=${REDSTONE_SYMBOLS.join(",")}`);
//   const data: Record<string, { value: number }> = await res.json();

//   const prices: Record<string, PriceData> = {};
//   for (const sym of REDSTONE_SYMBOLS) {
//     const price = data[sym]?.value ?? null;
//     prices[sym] = {
//       oracle: "RedStone",
//       price,
//       status: price ? "Active" : "Failed",
//       updated: new Date().toISOString(),
//     };
//   }
//   return prices;
// }

// async function fetchPythPrices(): Promise<Record<string, PriceData>> {
//   const feedsRes = await fetch(PYTH_FEEDS_API);
//   const feedsData: any[] = await feedsRes.json();

//   const selected = feedsData.filter(
//     (f: any) => PYTH_SYMBOLS.includes(f.attributes?.base)
//   );

//   const query = selected.map((f: any) => `ids[]=${f.id}`).join("&");
//   const pricesRes = await fetch(`${PYTH_PRICE_API}?${query}`);
//   const pricesData: any = await pricesRes.json();

//   const formatted: Record<string, PriceData> = {};
//   pricesData.parsed.forEach((p: any) => {
//     const feed = selected.find((f: any) => f.id === p.id);
//     const asset = feed?.attributes?.base || p.id;
//     const rawPrice = Number(p.price.price);
//     const expo = Number(p.price.expo);
//     const realPrice = rawPrice * Math.pow(10, expo);

//     formatted[asset.toUpperCase()] = {
//       oracle: "Pyth",
//       price: realPrice,
//       status: "Active",
//       updated: new Date(p.price.publish_time * 1000).toISOString(),
//     };
//   });

//   return formatted;
// }

// export async function fetchAllPrices() {
//   const [chainlink, redstone, pyth] = await Promise.all([
//     fetchChainlinkPrices(),
//     fetchRedstonePrices(),
//     fetchPythPrices(),
//   ]);
//   return {
//     chainlink,
//     redstone,
//     pyth,
//     timestamp: new Date().toISOString(),
//   };
// }

// // Run this manually or on a schedule
// export async function updatePrices() {
//   try {
//     const prices = await fetchAllPrices();
//     await addDoc(collection(db, "priceHistory"), {
//       ...prices,
//       pushedAt: new Date().toISOString(),
//     });

//     console.log("✅ Prices updated successfully!");
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     console.error("❌ Failed to update prices:", message);
//   }
// }

console.log("This is a placeholder file for price update logic.");
