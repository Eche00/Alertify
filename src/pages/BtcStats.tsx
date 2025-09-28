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

// BTC only
const BTC = {
  coin: "BTC",
  pythId:
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  coingeckoId: "bitcoin",
};

interface OraclePrices {
  coin: string;
  chainlink?: number;
  pyth?: number;
  redstone?: number;
}

export default function BtcStats() {
  const [prices, setPrices] = useState<OraclePrices | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBTCPrices = async () => {
    setLoading(true);
    try {
      // RedStone
      const redstoneRes = await fetch(
        `https://api.redstone.finance/prices?symbols=${BTC.coin}`
      );
      const redstoneData = await redstoneRes.json();
      const redstoneValue =
        redstoneData && redstoneData[BTC.coin] ? redstoneData[BTC.coin].value : undefined;

      // Pyth
      const pythRes = await fetch(
        `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${BTC.pythId}`
      );
      const pythData = await pythRes.json();
      const pythParsed = pythData.parsed?.[0];
      const pythPrice =
        pythParsed?.price?.price !== undefined && pythParsed?.price?.expo !== undefined
          ? Number(pythParsed.price.price) * Math.pow(10, pythParsed.price.expo)
          : undefined;

      // Chainlink via CoinGecko proxy
      const chainlinkRes = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${BTC.coingeckoId}&vs_currencies=usd`
      );
      const chainlinkData = await chainlinkRes.json();
      const chainlinkValue = chainlinkData[BTC.coingeckoId]?.usd;

      setPrices({
        coin: BTC.coin,
        redstone: redstoneValue,
        pyth: pythPrice,
        chainlink: chainlinkValue,
      });
    } catch (err) {
      console.error("Error fetching BTC prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBTCPrices();

    // Auto-refresh every 1 minute
    const interval = setInterval(fetchBTCPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: "Chainlink", price: prices?.chainlink ?? 0 },
    { name: "Pyth", price: prices?.pyth ?? 0 },
    { name: "RedStone", price: prices?.redstone ?? 0 },
  ];

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold mb-4">BTC Price Comparison</h1>

      {loading && <p>Loading BTC prices...</p>}

      {prices && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="shadow-lg rounded-2xl p-4">
              <h2 className="font-semibold">Chainlink</h2>
              <p className="text-xl">
                ${prices.chainlink?.toLocaleString() ?? "—"}
              </p>
            </div>
            <div className="shadow-lg rounded-2xl p-4">
              <h2 className="font-semibold">Pyth</h2>
              <p className="text-xl">${prices.pyth?.toLocaleString() ?? "—"}</p>
            </div>
            <div className="shadow-lg rounded-2xl p-4">
              <h2 className="font-semibold">RedStone</h2>
              <p className="text-xl">${prices.redstone?.toLocaleString() ?? "—"}</p>
            </div>
          </div>

          <div className="w-full h-80 mt-8">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
