import { useState, useEffect } from "react";

export function useStudentAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentId, setStudentId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("studentId");
        setIsLoggedIn(!!id);
        setStudentId(id);

        const onStorage = () => {
            const newId = localStorage.getItem("studentId");
            setIsLoggedIn(!!newId);
            setStudentId(newId);
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return { isLoggedIn, studentId };
}
