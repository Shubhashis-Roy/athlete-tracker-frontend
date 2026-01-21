import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AthleteProvider } from "@/context/AthleteContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Athletes from "@/pages/Athletes";
import AddAthlete from "@/pages/AddAthlete";
import EditAthlete from "@/pages/EditAthlete";
import AthleteDetails from "@/pages/AthleteDetails";
import TestScores from "@/pages/TestScores";
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/NotFound";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <AthleteProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/athletes" element={<Athletes />} />
              <Route path="/athletes/:id" element={<AthleteDetails />} />
              <Route
                path="/athletes/add"
                element={
                  <ProtectedRoute requireCoach>
                    <AddAthlete />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/athletes/edit/:id"
                element={
                  <ProtectedRoute requireCoach>
                    <EditAthlete />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tests"
                element={
                  <ProtectedRoute requireCoach>
                    <TestScores />
                  </ProtectedRoute>
                }
              />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AthleteProvider>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
