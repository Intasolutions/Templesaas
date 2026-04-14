import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout.jsx";
import { useAuth } from "../../context/AuthContext";

// Public Pages
import LandingPage from "../../modules/landing/LandingPage.jsx";
import LoginPage from "../../modules/auth/LoginPage.jsx";
import SignUpPage from "../../modules/auth/SignUpPage.jsx";

// Core Operations
// Premium Modules
import DashboardPage from "../../modules/dashboard/DashboardPage.jsx";
import IntegrationsPage from "../../modules/integrations/IntegrationsPage.jsx";
import TVDisplayPage from "../../modules/tv/TVDisplayPage.jsx";
import UsersPage from "../../modules/users/UsersPage.jsx";
import DevoteesPage from "../../modules/devotees/DevoteesPage.jsx";
import PoojaListPage from "../../modules/pooja/PoojaListPage.jsx";
import PoojaBookingPage from "../../modules/pooja/PoojaBookingPage.jsx";
import InventoryPage from "../../modules/inventory/InventoryPage.jsx";
import DonationsPage from "../../modules/donations/DonationsPage.jsx";
import EventsPage from "../../modules/events/EventsPage.jsx";
import ShipmentsPage from "../../modules/shipments/ShipmentsPage.jsx";
import BookingsPage from "../../modules/bookings/BookingsPage.jsx";
import HundiPage from "../../modules/hundi/HundiPage.jsx";
import AttendancePage from "../../modules/users/AttendancePage.jsx";
import AssetPage from "../../modules/assets/AssetPage.jsx";
import FinanceReportsPage from "../../modules/finance/FinanceReportsPage.jsx";
import SettingsPage from "../../modules/settings/TempleProfilePage.jsx";

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Auth Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />} />
      
      <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/tv-display" element={<TVDisplayPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/devotees" element={<DevoteesPage />} />
        <Route path="/pooja" element={<PoojaListPage />} />
        <Route path="/pooja/book" element={<PoojaBookingPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/hundi" element={<HundiPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
        <Route path="/staff" element={<AttendancePage />} />
        <Route path="/assets" element={<AssetPage />} />
        <Route path="/finance" element={<FinanceReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Default fallback to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
