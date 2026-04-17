import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout.jsx";
import { useAuth } from "../../context/AuthContext";

// Public Pages
import LandingPage from "../../modules/landing/LandingPage.jsx";
import PricingPage from "../../modules/landing/PricingPage.jsx";
import LoginPage from "../../modules/auth/LoginPage.jsx";
import SignUpPage from "../../modules/auth/SignUpPage.jsx";

// Landing Content Pages
import VazhipaduGateway from "../../modules/landing/VazhipaduGateway.jsx";
import AnalyticsPage from "../../modules/landing/AnalyticsPage.jsx";
import PanchangamPage from "../../modules/landing/PanchangamPage.jsx";
import DocsPage from "../../modules/landing/DocsPage.jsx";
import SupportPage from "../../modules/landing/SupportPage.jsx";
import ManagementPage from "../../modules/landing/ManagementPage.jsx";
import CrmPage from "../../modules/landing/CrmPage.jsx";
import StaffPage from "../../modules/landing/StaffPage.jsx";
import SignageLandingPage from "../../modules/landing/SignageLandingPage.jsx";
import SecurityPage from "../../modules/landing/SecurityPage.jsx";
import TermsPage from "../../modules/landing/TermsPage.jsx";
import PrivacyPage from "../../modules/landing/PrivacyPage.jsx";
import RefundPolicyPage from "../../modules/landing/RefundPolicyPage.jsx";
import CookiePolicyPage from "../../modules/landing/CookiePolicyPage.jsx";
import SaasAgreementPage from "../../modules/landing/SaasAgreementPage.jsx";
import PartnerPage from "../../modules/landing/PartnerPage.jsx";
import BillingPage from "../../modules/billing/BillingPage.jsx";

// Core Operations
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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Auth Loading...</div>;

  return (
    <Routes>
      {/* ── Public Landing Routes ────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/products/vazhipadu" element={<VazhipaduGateway />} />
      <Route path="/products/analytics" element={<AnalyticsPage />} />
      <Route path="/products/panchangam" element={<PanchangamPage />} />
      <Route path="/products/signage" element={<SignageLandingPage />} />
      <Route path="/solutions/management" element={<ManagementPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/solutions/staff" element={<StaffPage />} />
      <Route path="/products/crm" element={<CrmPage />} />
      <Route path="/solutions/security" element={<SecurityPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/saas-agreement" element={<SaasAgreementPage />} />
      <Route path="/partner" element={<PartnerPage />} />

      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />} />
      
      {/* ── Protected App Routes ─────────────────────────── */}
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
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Default fallback to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
