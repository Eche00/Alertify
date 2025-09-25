import { useLocation } from "react-router";

function Header() {
  const location = useLocation()
  return (
    <div className="w-full bg-[#FBFCFF]">
    {/* container  */}
    <section className="sm:px-10 px-2 py-6 shadow-2xl flex items-center justify-between">
    <h1 className="text-2xl font-bold  flex items-center justify-between">{location.pathname === '/' ? "Dashboard": "Alert"}</h1>

          <div className="flex items-center gap-3">
          <button className=" bg-red-700 px-[32px] text-white py-2 rounded-[8px] shadow-xl">Join</button>
          </div>
    </section>
    </div>
  )
}

export default Header