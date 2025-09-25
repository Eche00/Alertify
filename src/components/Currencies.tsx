import { useEffect, useRef } from "react";
import { useTopCoins } from "../utils/usecurrencies";

function Currencies() {
  const topCoins = useTopCoins();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1; // px per step
    const interval = setInterval(() => {
      if (!scrollContainer) return;

      // Keep scrolling
      scrollContainer.scrollLeft += scrollSpeed;

      // Reset to start instantly when it reaches the end
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }
    }, 30); // controls smoothness (smaller = smoother)

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="px-10 font-bold text-[16px]">Top 20 Coins by Market Cap</h2>
      <div
        ref={scrollRef}
        className="xxl:w-fit w-full overflow-x-hidden"
      >
        <section className="w-fit flex items-stretch gap-6 px-10 pt-3 p-10 xxl:border-3 dark:border-none border-blue-700 rounded-[10px]">
          {topCoins.map((coin: any) => (
            <div
              key={coin.id}
              className="flex items-center justify-center gap-3 shadow-xl p-3 rounded-2xl min-w-[150px] cursor-pointer bg-white h-[50px]"
            >
              <p className="text-sm font-semibold text-gray-700 text-center text-nowrap">
                {coin.name}
                <span className="text-sm font-semibold text-gray-900 text-center text-nowrap">
                  {" "}
                  ({coin.symbol})
                </span>{" "}
                ~ ${coin.current_price}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Currencies;
