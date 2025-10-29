import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Add, Compare } from "@mui/icons-material";
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
function Sidebar() {
  return (
       <main  className=" flex flex-col w-fit  overflow-scroll relative ">
          {/* header  */}
          <header className=" py-[20px] sm:px-[24px] px-[18px] flex items-center justify-between border-b border-gray-400 w-[80%] mx-auto flex-col">
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
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px] "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                }>
                <span><DonutSmallIcon/></span>
                <p className=" lg:flex hidden">Dashboard</p>
              </NavLink>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                }>
                <span><Add/></span>
                <p className=" lg:flex hidden">Create</p>
              </NavLink>         
              <NavLink
                to="/comparison"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                }>
                <span><Compare/></span>
                <p className=" lg:flex hidden">Comparison</p>
              </NavLink>         
              <NavLink
                to="/pricefeeds"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                }>
                <span><AlignVerticalBottomIcon/></span>
                <p className=" lg:flex hidden">Feeds</p>
              </NavLink>         
              <NavLink
                to="/alert"
                className={({ isActive }) =>
                  isActive
                    ? " text-[14px] text-white font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] bg-[#B71C1C] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
                    : " text-[14px] text-gray-600 hover:text-gray-800 font-[600] leading-[24px] flex items-center gap-[20px] rounded-[8px] sm:py-[12px] py-[8px] sm:px-[20px] px-[16px]  "
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
