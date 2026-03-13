import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { registerDevice } from '../lib/firestore';

export const isMockFirebase = () => {
    const key = import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key";
    return key === "dummy_api_key" || key === "your_api_key_here";
};

export const signInWithGoogle = async () => {
    if (isMockFirebase()) {
        console.warn("Using Mock Firebase Auth for Local Development");
        
        const mockEmail = `mock_${Math.random().toString(36).substring(7)}@test.com`;
        const numericUid = Math.floor(Math.random() * 90000000) + 10000000;
        const mockUid = String(numericUid); // Keep it string, but numeric
        
        const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
        localStorage.setItem('deviceId', deviceId);
        
        return { uid: mockUid, email: mockEmail, displayName: "Mock Local Student", emailVerified: true };
    }

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const studentRef = doc(db, 'students', user.email || '');
        const studentSnapshot = await getDoc(studentRef);

        if (!studentSnapshot.exists()) {
            await setDoc(studentRef, {
                email: user.email,
                name: user.displayName || 'Student',
                password: "google-auth",
                enrolledSubjectIds: [],
                devices: [],
                maxDevices: 2,
                createdAt: serverTimestamp()
            });
        }

        const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
        localStorage.setItem('deviceId', deviceId);

        const deviceAllowed = await registerDevice(user.email || '', deviceId);

        if (!deviceAllowed) {
            await auth.signOut();
            throw new Error("Maximum device limit reached (2 devices).");
        }

        return user;
    } catch (error: any) {
        console.error("Firebase Google Auth Error:", error.code, error.message);
        throw error;
    }
};

export const registerUser = async (email: string, pass: string, name: string) => {
    if (isMockFirebase()) {
        console.warn("Using Mock Firebase Auth for Local Development");
        throw new Error("auth/requires-verification");
    }

    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    const studentRef = doc(db, 'students', user.email || '');
    await setDoc(studentRef, {
        email: user.email,
        name: name,
        password: "email-auth",
        enrolledSubjectIds: [],
        devices: [],
        maxDevices: 2,
        createdAt: serverTimestamp()
    });

    await sendEmailVerification(user);
    await auth.signOut();
    throw new Error("auth/requires-verification");
};

export const loginUser = async (email: string, pass: string) => {
    if (isMockFirebase()) {
        console.warn("Using Mock Firebase Auth for Local Development");
        
        const numericUid = Math.floor(Math.random() * 90000000) + 10000000;
        const mockUid = String(numericUid);
        const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
        localStorage.setItem('deviceId', deviceId);
        
        return { uid: mockUid, email: email, displayName: "Mock Local Student", emailVerified: true };
    }

    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    if (!user.emailVerified) {
        await auth.signOut();
        throw new Error("Please verify your email before logging in.");
    }

    const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);

    const deviceAllowed = await registerDevice(user.email || '', deviceId);

    if (!deviceAllowed) {
        await auth.signOut();
        throw new Error("Security Error: Maximum device limit reached (2 devices).");
    }

    return user;
};
