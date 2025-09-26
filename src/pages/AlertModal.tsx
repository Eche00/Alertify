import React, { useState } from "react";
import { createAlert } from "../utils/alert";
import { toast } from "react-hot-toast";

interface AlertProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  asset: any;
}

function AlertModal({ setModal, asset }: AlertProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertType, setAlertType] = useState("Price Above");
  const [threshold, setThreshold] = useState<number | "">("");
  const [notifyMethods, setNotifyMethods] = useState({
    email: true,
    telegram: false,
    discord: false,
  });

  const [contacts, setContacts] = useState({
    email: "",
    telegram: "",
    discord: "",
  });

  const handleCheckboxChange = (method: string) => {
    setNotifyMethods((prev) => ({
      ...prev,
      [method]: !prev[method as keyof typeof prev],
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setContacts((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateAlert = async () => {
    if (!threshold) {
      toast.error("Please set a threshold value");
      return;
    }

    setLoading(true);
    const result = await createAlert(
      asset.asset,
      asset.oracle,
      Number(threshold),
      alertType,
      {
        email: notifyMethods.email ? contacts.email : null,
        telegram: notifyMethods.telegram ? contacts.telegram : null,
        discord: notifyMethods.discord ? contacts.discord : null,
      }
    );
    setLoading(false);

    if (result.success) {
      toast.success(`Alert created for ${asset.asset}`);
      setModal(false);
    } else {
      toast.error("Failed to create alert. Check console.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] bg-black/30 flex items-center justify-center">
      <main className="bg-[#FFFFFF] p-6 w-full sm:max-w-[500px] max-w-[90%] mx-auto h-fit rounded-[18px] shadow-xl relative">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-5">
          Set Price Alert for {asset?.asset}
          <p className="bg-[#B71C1C] flex items-center justify-center gap-2 text-white py-1 px-[16px] text-[12px] rounded-[5px] w-fit">
            {asset?.oracle}
          </p>
        </h2>

        {/* Alert Type & Threshold */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">Alert Type</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
            >
              <option>Price Above</option>
              <option>Price Below</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">Threshold ($)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) =>
                setThreshold(e.target.value ? Number(e.target.value) : "")
              }
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
                  value={contacts.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
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
                  value={contacts.telegram}
                  onChange={(e) =>
                    handleContactChange("telegram", e.target.value)
                  }
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
                  value={contacts.discord}
                  onChange={(e) =>
                    handleContactChange("discord", e.target.value)
                  }
                  placeholder="Enter your Discord username"
                  className="border border-gray-400 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                />
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
            onClick={() => setModal(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAlert}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white hover:scale-105 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#B71C1C]"
            }`}
          >
            {loading ? "Creating..." : "Create Alert"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default AlertModal;
