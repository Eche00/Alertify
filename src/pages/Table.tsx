"use client";

import ChainLink from "./ChainLink";
import Redstone from "./Redstone";
import Pyth from "./Pyth";

export type OracleType = "RedStone" | "Chainlink" | "Pyth";

interface TableProps {
  selectedOracle: OracleType;
  setSelectedOracle: (oracle: OracleType) => void;
  setSelectedFeeds: (feeds: any[]) => void;
}

function Table({ selectedOracle, setSelectedOracle, setSelectedFeeds }: TableProps) {
  const renderOracle = () => {
    switch (selectedOracle) {
      case "Chainlink":
        return <ChainLink onFeedsUpdate={setSelectedFeeds} />;
      case "RedStone":
        return <Redstone onFeedsUpdate={setSelectedFeeds} />;
      case "Pyth":
        return <Pyth onFeedsUpdate={setSelectedFeeds} />;
      default:
        return <p>Please select an oracle to display its feeds.</p>;
    }
  };

  return (
    <div className="mt-20 w-[90%] mx-auto">
      {/* Buttons */}
      <div className="flex items-center justify-between sm:gap-4 gap-2 mb-6 bg-white sm:w-fit w-full p-2 rounded-[10px] shadow-xl">
        {([ "RedStone", "Chainlink", "Pyth"] as OracleType[]).map((oracle) => (
          <button
            key={oracle}
            onClick={() => setSelectedOracle(oracle)}
            className={`sm:w-[100px] w-[70px] sm:text-[14px] text-[8px] py-2 rounded-lg cursor-pointer ${
              selectedOracle === oracle
                ? "bg-[#B71C1C] text-white"
                : "text-[#B71C1C] hover:bg-[#B71C1C]/20"
            } transition-all duration-300`}
          >
            {oracle}
          </button>
        ))}
      </div>

      {/* Render selected oracle below */}
      <div className="mt-8">{renderOracle()}</div>
    </div>
  );
}

export default Table;
