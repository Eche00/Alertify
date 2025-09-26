import React, { useState } from "react";


interface alertProps {
  setModal:  React.Dispatch<React.SetStateAction<boolean>>
}
function AlertModal({setModal} : alertProps) {
  const [notifyMethods, setNotifyMethods] = useState({
    email: true,
    telegram: false,
    discord: false,
  });

  const handleCheckboxChange = (method: string) => {
    setNotifyMethods((prev) => ({
      ...prev,
      [method]: !prev[method as keyof typeof prev],
    }));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] bg-black/30 flex items-center justify-center">
      <main className="bg-[#FFFFFF] p-6 w-full sm:max-w-[500px] max-w-[90%] mx-auto h-fit rounded-[18px] shadow-xl relative">

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Set Price Alert for ETH</h2>

        {/* Alert Type & Threshold */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">Alert Type</label>
            <select className="border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]">
              <option>Price Above</option>
              <option>Price Below</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">Threshold ($)</label>
            <input
              type="number"
              className="border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
            />
          </div>
        </div>

        {/* Notification Methods */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Notification Methods</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyMethods.email}
                onChange={() => handleCheckboxChange("email")}
                className="accent-[#B71C1C]"
              />
              Email
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyMethods.telegram}
                onChange={() => handleCheckboxChange("telegram")}
                className="accent-[#B71C1C]"
              />
              Telegram
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyMethods.discord}
                onChange={() => handleCheckboxChange("discord")}
                className="accent-[#B71C1C]"
              />
              Discord
            </label>
          </div>
        </div>

        {/* Conditional Contact Inputs */}
        {(notifyMethods.email || notifyMethods.telegram || notifyMethods.discord) && (
          <div className="mb-6 flex flex-col gap-4">
            {notifyMethods.email && (
              <div>
                <label className="text-sm text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border border-gray-400 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
            )}
            {notifyMethods.telegram && (
              <div>
                <label className="text-sm text-gray-600 mb-1">Telegram Username</label>
                <input
                  type="text"
                  placeholder="Enter your Telegram username"
                  className="border border-gray-400 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
            )}
            {notifyMethods.discord && (
              <div>
                <label className="text-sm text-gray-600 mb-1">Discord Username</label>
                <input
                  type="text"
                  placeholder="Enter your Discord username"
                  className="border border-gray-400 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100" onClick={()=>setModal(false)}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#B71C1C] text-white hover:scale-105">
            Create Alert
          </button>
        </div>
      </main>
    </div>
  );
}

export default AlertModal;
