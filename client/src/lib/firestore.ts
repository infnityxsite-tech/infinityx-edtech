import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const registerDevice = async (email: string, deviceId: string) => {
    const studentRef = doc(db, 'students', email);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return false;

    const data = snap.data();
    const devices = data.devices || [];
    const maxDevices = data.maxDevices || 2;

    if (devices.includes(deviceId)) {
        return true;
    }

    if (devices.length >= maxDevices) {
        return false;
    }

    devices.push(deviceId);
    await setDoc(studentRef, { devices }, { merge: true });
    return true;
};
