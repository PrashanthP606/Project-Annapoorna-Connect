import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonateFood from "./pages/DonateFood";
import NotFound from "./pages/NotFound";
import ViewFoods from "./components/ViewFoods";
import HowItWorksPage from "@/pages/HowItWorksPage";
import ProtectedRoute from "./components/ProtectedRoute"; 
import VerifyEmail from "./pages/VerifyEmail"; // <--- 1. Import the new page
import ResetPassword from './pages/ResetPassword'; // Import the new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          
          {/* password reset block */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* <--- 2. Add the Verification Route */}
          <Route path="/verify-email" element={<VerifyEmail />} /> 

          {/* Protected Route (Donor Only) */}
          <Route
            path="/donate"
            element={
              <ProtectedRoute >
                <DonateFood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foods"
            element={
              <ProtectedRoute >
                <ViewFoods />
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;