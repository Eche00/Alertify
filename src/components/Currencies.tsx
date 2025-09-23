// import AirIcon from "@mui/icons-material/Air";
import { useTopCoins } from "../utils/usecurrencies";

// interface appliances: [{title: String,}]
function Currencies() {
  const topCoins = useTopCoins()

  return (
      <div>
        <h2 className="px-10 font-bold text-[16px]">Top 20 Coins by Market Cap</h2>
      <div className="xxl:w-fit w-full overflow-scroll">
        <section className=" w-fit  flex items-stretch gap-6 px-10 pt-3 p-10 xxl:border-3 dark:border-none border-blue-700 rounded-[10px] ">
          {topCoins.map((coin:any) => (
            <div
             key={coin.id}
              className="flex items-center justify-center gap-3 shadow-xl p-3 rounded-2xl   min-w-[150px] cursor-pointer bg-white h-[50px]">
              
              <p className="text-sm font-semibold text-gray-700 text-center text-nowrap">
                {coin.name}<span className="text-sm font-semibold text-gray-900 text-center text-nowrap"> ({coin.symbol})</span> ~ ${coin.current_price}
              </p>
            </div>
          ))}
        </section>
      </div>
      </div>
  );
}

export default Currencies