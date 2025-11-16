import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, Rocket } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white px-4">
      <div className="max-w-lg text-center space-y-8">
        {/* Icon Section */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative bg-blue-700/20 p-6 rounded-full border border-blue-500/30 shadow-lg">
            <Rocket className="w-16 h-16 text-blue-300 animate-bounce" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-blue-100">
          Oops! Page Not Found
        </h2>

        {/* Message */}
        <p className="text-blue-200 leading-relaxed max-w-md mx-auto">
          The page you’re looking for might have been moved, renamed, or never existed.
          <br />
          Let’s get you back on track to explore the universe of knowledge at{" "}
          <span className="font-semibold text-blue-400">InfinityX</span>.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-xl transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-blue-300/80 mt-8">
          © {new Date().getFullYear()} InfinityX — Innovating the Future of AI Education
        </p>
      </div>
    </div>
  );
}
