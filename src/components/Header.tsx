
function Header() {
  return (
    <div className="w-full bg-[#FBFCFF]">
    {/* container  */}
    <section className="sm:px-10 px-2 shadow-2xl py-3 flex items-center justify-between">
    <input
            type="text"
            placeholder="Quantity"
            className=" rounded-2xl border border-gray-400  py-3 sm:px-[32px] px-[10px] w-fit  text-black outline-none placeholder:text-gray-400 "
          />

          <div className="flex items-center gap-3">
          <p>EN</p><p>EN</p>
          </div>
    </section>
    </div>
  )
}

export default Header