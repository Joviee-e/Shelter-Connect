import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Landing from "./pages/Landing";
import ShelterList from "./pages/ShelterList";
import ShelterDetail from "./pages/ShelterDetail";
import Emergency from "./pages/Emergency";
import Auth from "./pages/Auth";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AddShelter from "./pages/dashboard/AddShelter";
import ManageShelters from "./pages/dashboard/ManageShelters";
import Requests from "./pages/dashboard/Requests";
import Profile from "./pages/dashboard/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/shelters" element={<ShelterList />} />
            <Route path="/shelter/:id" element={<ShelterDetail />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="add-shelter" element={<AddShelter />} />
              <Route path="manage" element={<ManageShelters />} />
              <Route path="requests" element={<Requests />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
