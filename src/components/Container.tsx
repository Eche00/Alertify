import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Container() {
 
  return (     <section className="flex p-0 m-0 border-none overflow-hidden h-[100vh]">
          <div className=" flex  bg-[##B71C1C] text-[#FFFFFF] shadow-lg  p-0 m-0 border-none w-fit min-h-[100vh]">
          <Sidebar />
          </div>
        <div className="flex flex-col flex-1 overflow-scroll">
          <Header/>
        <Outlet />
        </div>
        </section>

     
  );
}

export default Container;
