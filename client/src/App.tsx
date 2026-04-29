import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CoursesLive from "./pages/CoursesLive";
import CoursesRecorded from "./pages/CoursesRecorded";
import CoursePreview from "./pages/CoursePreview";
import ProgramDetails from "./pages/ProgramDetails";
import Programs from "./pages/Programs";
import Solutions from "./pages/Solutions";
import SolutionDetail from "./pages/SolutionDetail";
import IndustryLanding from "./pages/IndustryLanding";
import SchoolLanding from "./pages/SchoolLanding";
import AcademyHub from "./pages/AcademyHub";
import SchoolDeepDive from "./pages/SchoolDeepDive";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Careers from "./pages/Careers";
import CareerApply from "./pages/CareerApply";
import Verify from "./pages/Verify";
import Certificate from "./pages/Certificate";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import Consultation from "./pages/Consultation";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import LearningPortal from "./pages/LearningPortal";
import { useAuth } from "./_core/hooks/useAuth";


// 🔒 Protected route for admin
function ProtectedRoute({ component: Component }: { component: React.FC }) {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin-login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <Component />;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/solutions/:slug" component={SolutionDetail} />
      <Route path="/industries/:slug" component={IndustryLanding} />
      <Route path="/academy" component={AcademyHub} />
      <Route path="/academy/:school" component={SchoolDeepDive} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/live" component={CoursesLive} />
      <Route path="/courses/recorded" component={CoursesRecorded} />
      <Route path="/courses/recorded/:id/preview" component={CoursePreview} />

      {/* 🚀 FIXED: Added route for specific application IDs */}
      <Route path="/apply" component={Apply} />
      <Route path="/apply/:id" component={Apply} />

      {/* Legacy Programs routes (retained for backward compatibility) */}
      <Route path="/programs" component={Programs} />
      <Route path="/program/:id" component={ProgramDetails} />
      <Route path="/programs/:category" component={SchoolLanding} />

      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/careers" component={Careers} />
      <Route path="/careers/apply" component={CareerApply} />
      <Route path="/contact" component={Contact} />
      <Route path="/consultation" component={Consultation} />
      <Route path="/verify" component={Verify} />
      <Route path="/certificates/:certId" component={Certificate} />
      <Route path="/admin-login" component={AdminLogin} />

      {/* 🎓 Student Learning Portal */}
      <Route path="/login" component={StudentLogin} />
      <Route path="/dashboard" component={StudentDashboard} />
      <Route path="/learn/:courseId" component={LearningPortal} />

      {/* ✅ Protected admin route */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { LanguageProvider } from "./contexts/LanguageContext";
import FloatingControls from "./components/FloatingControls";

// ✅ App entry point
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />

            <FloatingControls />
            <ScrollToTop />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;