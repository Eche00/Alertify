import { useEffect, useState } from "react";

export function useTopCoins() {
  const [topCoins, setTopCoins] = useState<any[]>([]);

  const fetchTopCoins = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
      );
      const data = await res.json();
      setTopCoins(data);
    } catch (error) {
      console.log("Couldn't fetch currencies:", error);
      setTopCoins([]);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTopCoins();

    // Fetch every 5 seconds
    const interval = setInterval(fetchTopCoins, 60000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return topCoins;
}
