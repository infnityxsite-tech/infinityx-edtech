import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { loginUser, registerUser, signInWithGoogle } from "@/contexts/AuthContext";

export default function StudentLogin() {
    const [, navigate] = useLocation();
    const [isLogin, setIsLogin] = useState(true);

    // Registration state
    const [name, setName] = useState("");
    // Shared state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setGoogleLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const user = await signInWithGoogle();
            localStorage.setItem("studentToken", user.uid);
            localStorage.setItem("studentId", user.uid);
            localStorage.setItem("studentName", user.displayName || "");

            toast.success("Logged in with Google successfully! 🎉");
            navigate("/dashboard");
        } catch (error: any) {
            if (error.message?.includes("device limit reached") || error.message?.includes("Maximum device limit")) {
                toast.error("Security Error: Maximum device limit reached (2 devices).");
            } else {
                toast.error(error.message || "Failed to sign in with Google.");
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleRegistrationSubmit = async () => {
        if (!name || !email || !password) return toast.error("Please fill in all fields");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");

        setIsLoading(true);
        try {
            await registerUser(email, password, name);
        } catch (error: any) {
            if (error.message === "auth/requires-verification" || error.message?.includes("requires-verification")) {
<<<<<<< HEAD
                toast.success("Registration successful! Please check your email to verify your account before logging in.");
=======
                toast.success("تم التسجيل بنجاح! أرسلنا رابط التفعيل لبريدك. يرجى فحص صندوق الوارد ومجلد الرسائل غير المرغوب فيها (Spam/Junk).");
>>>>>>> 78fe380 (final chamge student sign in)
                setIsLogin(true); // Automatically switch user to login view
                setPassword(""); // Clear password field for security
            } else {
                toast.error(error.message || "Registration failed.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async () => {
        if (!email || !password) return toast.error("Please fill in all fields");

        setIsLoading(true);
        try {
            const user = await loginUser(email, password);
            localStorage.setItem("studentToken", user.uid);
            localStorage.setItem("studentId", user.uid);
            localStorage.setItem("studentName", user.displayName || "");

            toast.success("Welcome back! 🎉");
            navigate("/dashboard");
        } catch (error: any) {
            if (error.message === "Please verify your email before logging in." || error.message?.includes("email before logging")) {
<<<<<<< HEAD
                toast.error("Please verify your email inbox/spam folder before logging in.");
=======
                toast.error("حسابك غير مفعل بعد. يرجى مراجعة بريدك الإلكتروني (بما في ذلك مجلد Spam) والضغط على رابط التفعيل.");
>>>>>>> 78fe380 (final chamge student sign in)
            }
            else if (error.message?.includes("device limit reached") || error.message?.includes("Maximum device limit")) {
                toast.error("Security Error: Maximum device limit reached (2 devices).");
            }
            else {
                toast.error(error.message || "Invalid credentials.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLoginSubmit();
        } else {
            handleRegistrationSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/">
                    <div className="flex justify-center items-center gap-2 cursor-pointer mb-8">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                            InfinityX
                        </span>
                    </div>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Card className="border-0 shadow-2xl shadow-blue-900/5 relative overflow-hidden backdrop-blur-xl bg-white/80">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <CardTitle className="text-2xl font-bold text-slate-900">
                            {isLogin ? "Welcome Back Student" : "Create Student Account"}
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                            {isLogin
                                ? "Enter your email and password to access your courses."
                                : "Join InfinityX today and start your tech journey."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Ahmed Hassan"
                                        className="h-11 bg-white/50 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    className="h-11 bg-white/50 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-11 bg-white/50 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 text-base font-medium"
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Please wait...
                                        </>
                                    ) : isLogin ? "Sign In to Portal" : "Create Account"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                {/* Continue with Google Button */}
                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isGoogleLoading || isLoading}
                                    variant="outline"
                                    className="w-full h-11 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                    {isGoogleLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                    )}
                                    Google
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 pt-6 mt-2">
                        <p className="text-sm text-slate-500 text-center">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-1 font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                {isLogin ? "Register now" : "Sign in instead"}
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
