import { useState } from "react";
import Table from "./Table"
import Stats from "./Stats";
import type { OracleType } from "./Table"; 
function Create() {
    const [selectedOracle, setSelectedOracle] = useState<OracleType>("RedStone");
  const [selectedFeeds, setSelectedFeeds] = useState<any[]>([]);
  return (
    <div className=" py-10 bg-[#F4F6FE] flex-1 w-full max-h-[100vh] overflow-scroll">
        <Stats feeds={selectedFeeds} />
             
              <Table
                selectedOracle={selectedOracle}
                setSelectedOracle={setSelectedOracle}
                setSelectedFeeds={setSelectedFeeds}
              />
    </div>
  )
}

export default Create