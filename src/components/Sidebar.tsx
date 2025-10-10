import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Compare } from "@mui/icons-material";
function Sidebar() {
  return (
       <main  className=" flex flex-col w-fit  overflow-scroll relative ">
          {/* header  */}
          <header className=" py-[20px] px-[24px] flex items-center justify-between border-b border-gray-400 w-[80%] mx-auto flex-col">
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 1 }}
              viewport={{ once: true }}
              className=" flex  items-center gap-[8px]  lg:w-[250px]">
              <img src="/logo.webp" alt="logo" className="lg:w-[100px] sm:w-[70px] w-[30px] lg:h-[100px] sm:h-[40px] h-[30px]  object-cover" /> <h2 className="text-black text-4xl sm:text-4xl font-extrabold select-none">
  <span className="lg:flex hidden">Alertify</span>
</h2>
            </motion.section>
          </header>
          {/* navigation  */}
          <div className="py-[16px] text-[#E8ECEFBF]">
            <ul className="lg:mx-[24px] mx-[15px]  lg:border-none  border-b-[1px] border-[#80a8b6]  flex flex-col gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] py-[12px] px-[20px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] py-[12px] px-[20px]  "
                }>
                <span><DonutSmallIcon/></span>
                <p className=" lg:flex hidden">Dashboard</p>
              </NavLink>
              <NavLink
                to="/comparison"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] py-[12px] px-[20px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] py-[12px] px-[20px]  "
                }>
                <span><Compare/></span>
                <p className=" lg:flex hidden">Comparison</p>
              </NavLink>         
              <NavLink
                to="/alert"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] py-[12px] px-[20px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] py-[12px] px-[20px]  "
                }>
                <span><NotificationsActiveIcon/></span>
                <p className=" lg:flex hidden">Alert</p>
              </NavLink>         
            </ul>
          </div>
      </main>
  );
}

export default Sidebar;
