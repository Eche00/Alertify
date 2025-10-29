import { Scale } from "@mui/icons-material";
import { useLocation } from "react-router";

function Header() {
  const location = useLocation()
  return (
    <div className="w-full bg-[#FBFCFF]">
    {/* container  */}
    <section className="sm:px-10 px-2 py-6 shadow-2xl flex items-center justify-between">
    <h1 className="text-2xl font-bold  flex items-center justify-between">
      {location.pathname === '/' && "Dashboard"}
      {location.pathname === '/comparison' && "Comparison"}
      {location.pathname === '/alert' && "Alert"}
      {location.pathname === '/create' && "Create"}
      {location.pathname === '/pricefeeds' && "Price Feeds"}
      </h1>

          <div className="flex items-center gap-3">
          <button className=" bg-red-700 sm:px-[32px] px-[16px] text-white sm:py-2 py-1 rounded-[8px] shadow-xl"><Scale/></button>
          </div>
    </section>
    </div>
  )
}

export default Header