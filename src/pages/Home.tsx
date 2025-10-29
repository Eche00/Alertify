import Currencies from "../components/Currencies";
import DashboardTable from "./dashboardTable";


function Home() {
  

  return (
    <div className="py-[24px] sm:pr-[24px] bg-[#F4F6FE] flex flex-col flex-1 w-full max-h-[100vh] overflow-scroll">
      <Currencies />
      <div className="bg-white flex items-center lg:flex-row flex-col gap-5 shadow-lg w-[90%] mx-auto sm:p-10 p-5 relative rounded-[18px]">
            {/* Total Feeds */}
            <section className="flex flex-1 flex-col bg-white rounded-2xl sm:min-h-[200px] min-h-[100px] relative w-full justify-between items-start p-5">
              <div className="flex flex-1 w-full gap-5 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#B71C1C]">Redstone Feeds</h3>
                  <p className="text-sm text-gray-500 mb-1">Total Redstone Feeds</p>
                </div>
                <div className="bg-[#f5092016] w-[40px] h-[40px] flex items-center justify-center rounded-full">
                  <span className="text-red-700 text-xl">
                    <img src="https://cryptocurrencyjobs.co/startups/assets/logos/redstone.png" alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#B71C1C]">18</h3>
            </section>
      
            {/* Healthy Feeds */}
            <section className="flex flex-1 flex-col bg-[#B71C1C]/10 rounded-2xl sm:min-h-[200px] min-h-[100px] relative w-full justify-between items-start p-5">
              <div className="flex flex-1 w-full gap-5 justify-between">
                <div>
                <h3 className="text-2xl font-bold text-[#B71C1C]">Chainlink Feeds</h3>
                  <p className="text-xs text-gray-800 mt-1">Total Chainlink Feeds</p>
                </div>
                <div className="bg-[#f5092016] w-[40px] h-[40px] flex items-center justify-center rounded-full">
                  <span className="text-red-700 text-xl">
                    <img src="https://images.seeklogo.com/logo-png/42/1/chainlink-link-logo-png_seeklogo-423097.png" alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                  </span>
                
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#B71C1C]">30</h3>
            </section>
      
            {/* Deviated Feeds */}
            <section className="flex flex-1 flex-col bg-[#B71C1C] rounded-2xl sm:min-h-[200px] min-h-[100px] relative w-full justify-between items-start p-5">
              <div className="flex flex-1 w-full gap-5 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Pyth Feeds</h3>
                  <p className="text-xs text-gray-200 mt-1">Total Pyth Feeds</p>
                </div>
                <div className="bg-[#f5092016] w-[40px] h-[40px] flex items-center justify-center rounded-full">
                  <span className="text-red-700 text-xl">
                    <img src="https://cryptocurrencyjobs.co/startups/assets/logos/pyth.jpg" alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">31</h3>
            </section>
          </div>
<DashboardTable/>
    </div>
  );
}

export default Home;
