import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface NotifyMethods {
  email: string | null;
  telegram: string | null;
  discord: string | null;
}

export const createAlert = async (
  asset: string,
  oracle: string,
  threshold: number,
  type: string,
  notify: NotifyMethods
) => {
  try {
    const docRef = await addDoc(collection(db, "alerts"), {
      asset,
      oracle,
      threshold,
      type,
      notify,
      createdAt: serverTimestamp(),
    });

    const newAlert = {
      id: docRef.id,
      asset,
      oracle,
      threshold,
      type,
      notify,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("alerts") || "[]");
    existing.push(newAlert);
    localStorage.setItem("alerts", JSON.stringify(existing));

    return { success: true, id: docRef.id, data: newAlert };
  } catch (err) {
    console.error("Error creating alert:", err);
    return { success: false, error: err };
  }
};
