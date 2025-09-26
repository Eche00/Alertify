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
  const [contacts, setContacts] = useState({
    email: "",
  });

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
        email: contacts.email || null, // direct check, no notifyMethods
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
          <p className="text-sm text-gray-900 mb-1 font-bold">Email</p>
        </div>

        {/* Conditional Contact Input */}
        <div className="mb-6 flex flex-col gap-4">
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
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100 cursor-pointer"
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
            } cursor-pointer`}
          >
            {loading ? "Creating..." : "Create Alert"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default AlertModal;
