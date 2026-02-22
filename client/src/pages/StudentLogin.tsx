import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";
import { Link } from "wouter";

export default function StudentLogin() {
    const [, navigate] = useLocation();
    const [isLogin, setIsLogin] = useState(true);

    // Registration state
    const [name, setName] = useState("");
    // Shared state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = trpc.admin.studentLogin.useMutation({
        onSuccess: (data) => {
            localStorage.setItem("studentToken", data.token || "");
            localStorage.setItem("studentId", data.user.id);
            localStorage.setItem("studentName", data.user.name || "");
            toast.success("Welcome back! 🎉");
            navigate("/dashboard");
        },
        onError: (error) => {
            toast.error(error.message || "Invalid credentials");
        }
    });

    const registerMutation = trpc.admin.studentRegister.useMutation({
        onSuccess: (data) => {
            toast.success("Account created! Please log in.");
            setIsLogin(true);
            setPassword("");
        },
        onError: (error) => {
            toast.error(error.message || "Registration failed");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            if (!email || !password) return toast.error("Please fill in all fields");
            loginMutation.mutate({ email, password });
        } else {
            if (!name || !email || !password) return toast.error("Please fill in all fields");
            if (password.length < 6) return toast.error("Password must be at least 6 characters");
            registerMutation.mutate({ name, email, password });
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

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 text-base font-medium mt-6"
                                disabled={loginMutation.isPending || registerMutation.isPending}
                            >
                                {loginMutation.isPending || registerMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Please wait...
                                    </>
                                ) : isLogin ? "Sign In to Portal" : "Create Account"}
                            </Button>
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
