import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { loginUser, registerUser, signInWithGoogle } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";

export default function StudentLogin() {
    const [, navigate] = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const { t, isRTL } = useLanguage();
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setGoogleLoading] = useState(false);

    const syncGoogleMutation = trpc.admin.syncGoogleStudent.useMutation();

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const user = await signInWithGoogle();
            
            // Sync user to PostgreSQL backend
            await syncGoogleMutation.mutateAsync({
                openId: user.uid,
                name: user.displayName || "Student",
                email: user.email || ""
            });

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
                toast.success("Registration successful! Please check your email to verify your account before logging in.");
                setIsLogin(true);
                setPassword("");
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
            if (error.message?.includes("email before logging")) {
                toast.error("Please verify your email inbox/spam folder before logging in.");
            } else if (error.message?.includes("device limit reached") || error.message?.includes("Maximum device limit")) {
                toast.error("Security Error: Maximum device limit reached (2 devices).");
            } else {
                toast.error(error.message || "Invalid credentials.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) handleLoginSubmit();
        else handleRegistrationSubmit();
    };

    return (
        <div className={`min-h-screen ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#060a14] text-white'} flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background effects */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[200px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Back to home */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-6">
                <Link href="/">
                    <button className={`flex items-center gap-1.5 text-sm transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}>
                        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {t("Back to site", "العودة للموقع", "Back to site")}
                    </button>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/">
                    <div className="flex justify-center items-center gap-2.5 cursor-pointer mb-8 group">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2  rounded-xl shadow-lg shadow-cyan-500/20">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className={`text-2xl font-extrabold bg-clip-text text-transparent ${isLight ? 'bg-gradient-to-r from-slate-900 to-cyan-600' : 'bg-gradient-to-r from-white to-cyan-400'}`}>
                            InfinityX
                        </span>
                    </div>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className={`${isLight ? 'bg-white border-slate-200' : 'bg-[#0d1225]/80 border-white/[0.06]'} backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden`}>
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 text-center">
                        <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {isLogin 
                                ? t("Welcome Back", "مرحباً بعودتك", "Welcome Back") 
                                : t("Create Account", "إنشاء حساب", "Create Account")}
                        </h2>
                        <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                            {isLogin
                                ? t("Enter your credentials to access your courses.", "أدخل بياناتك للوصول إلى دوراتك.", "Enter your credentials to access your courses.")
                                : t("Join InfinityX and start your tech journey.", "انضم إلى إنفينيتي إكس وابدأ رحلتك التقنية.", "Join InfinityX and start your tech journey.")}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{t("Full Name", "الاسم الكامل", "Full Name")}</Label>
                                    <Input
                                        id="name" type="text" value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder={t("Ahmed Hassan", "أحمد حسن", "Ahmed Hassan")}
                                        className={`h-11 border focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{t("Email address", "البريد الإلكتروني", "Email address")}</Label>
                                <Input
                                    id="email" type="email" value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    className={`h-11 border focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{t("Password", "كلمة المرور", "Password")}</Label>
                                <Input
                                    id="password" type="password" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`h-11 border focus:ring-cyan-500/30 focus:border-cyan-500/40 rounded-xl ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                />
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 text-sm font-semibold rounded-xl"
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("Please wait...", "الرجاء الانتظار...", "Please wait...")}</>
                                    ) : isLogin ? t("Sign In to Portal", "الدخول للمنصة", "Sign In to Portal") : t("Create Account", "إنشاء حساب", "Create Account")}
                                </Button>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-slate-200 dark:border-white/[0.06]"></div>
                                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">{t("Or continue with", "أو تابع باستخدام", "Or continue with")}</span>
                                    <div className="flex-grow border-t border-slate-200 dark:border-white/[0.06]"></div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isGoogleLoading || isLoading}
                                    variant="outline"
                                    className={`w-full h-11 border font-medium flex items-center justify-center gap-2 transition-all rounded-xl ${isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-slate-300'}`}
                                >
                                    {isGoogleLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    )}
                                    Google
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Footer toggle */}
                    <div className={`px-8 py-5 border-t text-center ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-white/[0.02]'}`}>
                        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                            {isLogin ? t("Don't have an account?", "ليس لديك حساب؟", "Don't have an account?") : t("Already have an account?", "هل لديك حساب بالفعل؟", "Already have an account?")}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className={`mx-1.5 font-semibold transition-colors ${isLight ? 'text-cyan-600 hover:text-cyan-700' : 'text-cyan-400 hover:text-cyan-300'}`}
                            >
                                {isLogin ? t("Register now", "سجل الآن", "Register now") : t("Sign in instead", "سجل الدخول بدلاً من ذلك", "Sign in instead")}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
