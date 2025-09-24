import { useState } from "react";
import Currencies from "../components/Currencies";
import Comparision from "./Comparision";
import CurrencyComparison from "./CurrencyComparison";
import Table from "./Table";



type OracleType = "RedStone" | "Chainlink" | "Pyth";

function Home() {
  const [selectedOracle, setSelectedOracle] = useState<OracleType>("RedStone");
  const [selectedFeeds, setSelectedFeeds] = useState<any[]>([]);

  return (
    <div className="py-[24px] sm:pr-[24px] bg-[#F4F6FE]  flex flex-col flex-1 w-full max-h-[100vh] overflow-scroll">
     <Currencies/>
     <Comparision feeds={selectedFeeds}/> 
     <Table 
        selectedOracle={selectedOracle}
        setSelectedOracle={setSelectedOracle}
        setSelectedFeeds={setSelectedFeeds}/>
     <CurrencyComparison/>
    </div>
  );
}

export default Home;
