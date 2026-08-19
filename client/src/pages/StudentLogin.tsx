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
import { getDeviceId, getDeviceName } from "@/lib/deviceId";
import { auth } from "@/lib/firebase";

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
    const verifyDeviceMutation = trpc.admin.verifyDeviceSession.useMutation();

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const user = await signInWithGoogle();
            
            // Sync user to PostgreSQL backend and fetch their numeric DB ID
            const pgResponse = await syncGoogleMutation.mutateAsync({
                openId: user.uid,
                name: user.displayName || "Student",
                email: user.email || ""
            });

            const studentDbId = String(pgResponse.user.id);

            // SERVER-SIDE device verification (PostgreSQL)
            try {
                await verifyDeviceMutation.mutateAsync({
                    userId: studentDbId,
                    deviceId: getDeviceId(),
                    deviceName: getDeviceName()
                });
            } catch (deviceErr: any) {
                // Only block if it's a real device-limit FORBIDDEN error
                const isForbidden = deviceErr?.data?.code === "FORBIDDEN" || 
                                   deviceErr?.message?.includes("DEVICE_LIMIT_REACHED");
                if (isForbidden) {
                    await auth.signOut();
                    toast.error(t(
                        "Device limit reached. This account is already registered on 2 devices. Please contact support.",
                        "تم الوصول إلى الحد الأقصى للأجهزة. هذا الحساب مسجل بالفعل على جهازين. يرجى التواصل مع الدعم.",
                        "Device limit reached. This account is already registered on 2 devices. Please contact support."
                    ));
                    return;
                }
                // Non-device error — proceed anyway, don't block login
                console.warn("Device verification error (non-blocking):", deviceErr?.message);
            }

            localStorage.setItem("studentToken", user.uid);
            localStorage.setItem("studentId", studentDbId);
            localStorage.setItem("studentName", user.displayName || "");
            toast.success(t("Logged in with Google successfully! 🎉", "تم تسجيل الدخول بنجاح! 🎉", "Logged in with Google successfully! 🎉"));
            navigate("/dashboard");
        } catch (error: any) {
            if (error.message?.includes("device limit reached") || error.message?.includes("Maximum device limit") || error.message?.includes("Device limit")) {
                // Already handled above
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
        if (!email || !password) return toast.error(t("Please fill in all fields", "يرجى ملء جميع الحقول", "Please fill in all fields"));
        setIsLoading(true);
        try {
            const user = await loginUser(email, password);
            
            // Universal sync to get Postgres ID
            const pgResponse = await syncGoogleMutation.mutateAsync({
                openId: user.uid,
                name: user.displayName || "Student",
                email: user.email || email
            });

            const studentDbId = String(pgResponse.user.id);

            // SERVER-SIDE device verification (PostgreSQL)
            try {
                await verifyDeviceMutation.mutateAsync({
                    userId: studentDbId,
                    deviceId: getDeviceId(),
                    deviceName: getDeviceName()
                });
            } catch (deviceErr: any) {
                // Only block if it's a real device-limit FORBIDDEN error
                const isForbidden = deviceErr?.data?.code === "FORBIDDEN" || 
                                   deviceErr?.message?.includes("DEVICE_LIMIT_REACHED");
                if (isForbidden) {
                    await auth.signOut();
                    toast.error(t(
                        "Device limit reached. This account is already registered on 2 devices. Please contact support.",
                        "تم الوصول إلى الحد الأقصى للأجهزة. هذا الحساب مسجل بالفعل على جهازين. يرجى التواصل مع الدعم.",
                        "Device limit reached. This account is already registered on 2 devices. Please contact support."
                    ));
                    return;
                }
                // Non-device error — proceed anyway, don't block login
                console.warn("Device verification error (non-blocking):", deviceErr?.message);
            }

            localStorage.setItem("studentToken", user.uid);
            localStorage.setItem("studentId", studentDbId);
            localStorage.setItem("studentName", user.displayName || "");
            toast.success(t("Welcome back! 🎉", "مرحباً بعودتك! 🎉", "Welcome back! 🎉"));
            navigate("/dashboard");
        } catch (error: any) {
            if (error.message?.includes("email before logging")) {
                toast.error(t("Please verify your email inbox/spam folder before logging in.", "يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول.", "Please verify your email inbox/spam folder before logging in."));
            } else if (error.message?.includes("device limit reached") || error.message?.includes("Maximum device limit") || error.message?.includes("Device limit")) {
                // Already handled above
            } else {
                toast.error(error.message || t("Invalid credentials.", "بيانات غير صحيحة.", "Invalid credentials."));
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
        <div className={`min-h-screen ${isLight ? 'bg-[#F5F4EF] text-[#1F2925]' : 'bg-[#07111b] text-white'} flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Back to home */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-6">
                <Link href="/">
                    <button className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isLight ? 'text-[#5E6862] hover:text-[#1F2925]' : 'text-slate-400 hover:text-white'}`}>
                        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {t("Back to site", "العودة للموقع", "Back to site")}
                    </button>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/">
                    <div className="flex justify-center items-center gap-2.5 cursor-pointer mb-8 group">
                        <div className="bg-[#6453C2] p-2 rounded-xl shadow-md shadow-[#6453C2]/20">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className={`text-2xl font-extrabold ${isLight ? 'text-[#1F2925]' : 'text-white'}`}>
                            InfinityX
                        </span>
                    </div>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className={`${isLight ? 'bg-white border-[#D8DDD8]' : 'bg-[#0d1225]/80 border-white/[0.06]'} border rounded-2xl shadow-xl shadow-black/5 overflow-hidden`}>
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 text-center">
                        <h2 className={`text-xl font-bold ${isLight ? 'text-[#1F2925]' : 'text-white'}`}>
                            {isLogin 
                                ? t("Welcome Back", "مرحباً بعودتك", "Welcome Back") 
                                : t("Create Account", "إنشاء حساب", "Create Account")}
                        </h2>
                        <p className={`text-sm mt-1 ${isLight ? 'text-[#5E6862]' : 'text-slate-400'}`}>
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
                                    <Label htmlFor="name" className={`text-xs font-semibold ${isLight ? 'text-[#1F2925]' : 'text-slate-400'}`}>{t("Full Name", "الاسم الكامل", "Full Name")}</Label>
                                    <Input
                                        id="name" type="text" value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder={t("Ahmed Hassan", "أحمد حسن", "Ahmed Hassan")}
                                        className={`h-11 border focus:ring-[#6453C2]/20 focus:border-[#6453C2] rounded-xl ${isLight ? 'bg-[#F5F4EF] border-[#D8DDD8] text-[#1F2925] placeholder:text-[#7B847F]' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className={`text-xs font-semibold ${isLight ? 'text-[#1F2925]' : 'text-slate-400'}`}>{t("Email address", "البريد الإلكتروني", "Email address")}</Label>
                                <Input
                                    id="email" type="email" value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    className={`h-11 border focus:ring-[#6453C2]/20 focus:border-[#6453C2] rounded-xl ${isLight ? 'bg-[#F5F4EF] border-[#D8DDD8] text-[#1F2925] placeholder:text-[#7B847F]' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className={`text-xs font-semibold ${isLight ? 'text-[#1F2925]' : 'text-slate-400'}`}>{t("Password", "كلمة المرور", "Password")}</Label>
                                <Input
                                    id="password" type="password" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`h-11 border focus:ring-[#6453C2]/20 focus:border-[#6453C2] rounded-xl ${isLight ? 'bg-[#F5F4EF] border-[#D8DDD8] text-[#1F2925] placeholder:text-[#7B847F]' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                                />
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#6453C2] hover:bg-[#5342AE] text-white shadow-md shadow-[#6453C2]/20 text-sm font-semibold rounded-xl"
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("Please wait...", "الرجاء الانتظار...", "Please wait...")}</>
                                    ) : isLogin ? t("Sign In to Portal", "الدخول للمنصة", "Sign In to Portal") : t("Create Account", "إنشاء حساب", "Create Account")}
                                </Button>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-[#D8DDD8] dark:border-white/[0.06]"></div>
                                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-[#7B847F] uppercase tracking-widest">{t("Or continue with", "أو تابع باستخدام", "Or continue with")}</span>
                                    <div className="flex-grow border-t border-[#D8DDD8] dark:border-white/[0.06]"></div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isGoogleLoading || isLoading}
                                    variant="outline"
                                    className={`w-full h-11 border font-medium flex items-center justify-center gap-2 transition-all rounded-xl ${isLight ? 'bg-white border-[#D8DDD8] hover:bg-[#EAEDEA] text-[#1F2925]' : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-slate-300'}`}
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
                    <div className={`px-8 py-5 border-t text-center ${isLight ? 'border-[#D8DDD8] bg-[#EAEDEA]/50' : 'border-white/[0.04] bg-white/[0.02]'}`}>
                        <p className={`text-sm ${isLight ? 'text-[#5E6862]' : 'text-slate-500'}`}>
                            {isLogin ? t("Don't have an account?", "ليس لديك حساب؟", "Don't have an account?") : t("Already have an account?", "هل لديك حساب بالفعل؟", "Already have an account?")}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className={`mx-1.5 font-semibold transition-colors ${isLight ? 'text-[#6453C2] hover:text-[#5342AE]' : 'text-cyan-400 hover:text-cyan-300'}`}
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
