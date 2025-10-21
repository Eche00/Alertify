// pricesData.ts

export const pricesData = {
  BTC: makeCoin("BTC", 67000),
  ETH: makeCoin("ETH", 2480),
  SOL: makeCoin("SOL", 155),
  LTC: makeCoin("LTC", 74),
  ADA: makeCoin("ADA", 0.48),
  DOT: makeCoin("DOT", 6.1),
  BNB: makeCoin("BNB", 590),
  XRP: makeCoin("XRP", 0.56),
  MATIC: makeCoin("MATIC", 0.89),
  DOGE: makeCoin("DOGE", 0.12),
  SHIB: makeCoin("SHIB", 0.0000089),
  AVAX: makeCoin("AVAX", 27),
  LINK: makeCoin("LINK", 15.2),
  XLM: makeCoin("XLM", 0.11),
  TRX: makeCoin("TRX", 0.098),
  VET: makeCoin("VET", 0.032),
  FIL: makeCoin("FIL", 4.9),
  ATOM: makeCoin("ATOM", 7.6),
  ALGO: makeCoin("ALGO", 0.19),
  ICP: makeCoin("ICP", 9.8),
  APT: makeCoin("APT", 6.2),
  ARB: makeCoin("ARB", 0.95),
  OP: makeCoin("OP", 1.8),
  SUI: makeCoin("SUI", 0.62),
  HBAR: makeCoin("HBAR", 0.086),
  GRT: makeCoin("GRT", 0.29),
  AAVE: makeCoin("AAVE", 89),
  SNX: makeCoin("SNX", 2.9),
  CAKE: makeCoin("CAKE", 1.6),
  UNI: makeCoin("UNI", 4.2),
};

// Utility generator — creates 720 hourly price snapshots (30 days)
function makeCoin(symbol: string, basePrice: number) {
  const start = new Date("2025-10-01T00:00:00Z"); // Start from Oct 1st
  const hours: string[] = [];

  for (let i = 0; i < 24 * 30; i++) { // 30 days * 24 hours = 720
    const d = new Date(start.getTime() + i * 3600 * 1000);
    hours.push(d.toISOString());
  }

  const history: Record<string, any> = {};

  hours.forEach((h) => {
    const randomOffset = (Math.random() - 0.5) * 0.02; // ±1% variation
    const chainlink = +(basePrice * (1 + randomOffset)).toFixed(6);
    const redstone = +(basePrice * (1 + randomOffset * 0.9)).toFixed(6);
    const pyth = +(basePrice * (1 + randomOffset * 1.1)).toFixed(6);

    history[h] = {
      Chainlink: {
        price: chainlink,
        status: "Active",
        updated: new Date(new Date(h).getTime() + 10 * 1000).toISOString(), // +10s
      },
      RedStone: {
        price: redstone,
        status: "Active",
        updated: new Date(new Date(h).getTime() + 8 * 1000).toISOString(), // +8s
      },
      Pyth: {
        price: pyth,
        status: "Active",
        updated: new Date(new Date(h).getTime() + 12 * 1000).toISOString(), // +12s
      },
    };
  });

  return { symbol, history };
}
