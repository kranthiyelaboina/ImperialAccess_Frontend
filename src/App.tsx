import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

/* ---------- Public / Landing ---------- */
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import RequirementsSection from './components/RequirementsSection'
import Footer from './components/Footer'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

/* ---------- Guest ---------- */
import GuestLayout from './components/guest/GuestLayout'
import GuestOverview from './components/guest/GuestOverview'
import FaceRegister from './components/guest/FaceRegister'
import LoungeRegister from './components/guest/LoungeRegister'
import CreditCheck from './components/guest/CreditCheck'
import Payment from './components/guest/Payment'
import Confirmation from './components/guest/Confirmation'
import LoungeAccess from './components/guest/LoungeAccess'
import DiningTokens from './components/guest/DiningTokens'
import BoardingPass from './components/guest/BoardingPass'
import VisitHistory from './components/guest/VisitHistory'

/* ---------- Admin ---------- */
import AdminLayout from './components/admin/AdminLayout'
import AdminOverview from './components/admin/AdminOverview'
import LiveCamera from './components/admin/LiveCamera'
import ModeControl from './components/admin/ModeControl'
import Attendance from './components/admin/Attendance'
import Analytics from './components/admin/Analytics'
import GuestManagement from './components/admin/GuestManagement'
import Permits from './components/admin/Permits'
import DiningTokenMgmt from './components/admin/DiningTokenMgmt'
import EventLog from './components/admin/EventLog'
import Settings from './components/admin/Settings'

/* ---------- Landing Page ---------- */
const LandingPage: React.FC = () => (
  <div className="ea-landing">
    <Navbar />
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <RequirementsSection />
    <Footer />
  </div>
)

/* ---------- App ---------- */
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Guest Dashboard */}
        <Route path="/guest" element={<GuestLayout />}>
          <Route index element={<GuestOverview />} />
          <Route path="face-register" element={<FaceRegister />} />
          <Route path="lounge-register" element={<LoungeRegister />} />
          <Route path="credit-check" element={<CreditCheck />} />
          <Route path="payment" element={<Payment />} />
          <Route path="confirmation" element={<Confirmation />} />
          <Route path="lounge-access" element={<LoungeAccess />} />
          <Route path="dining" element={<DiningTokens />} />
          <Route path="boarding" element={<BoardingPass />} />
          <Route path="history" element={<VisitHistory />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="camera" element={<LiveCamera />} />
          <Route path="modes" element={<ModeControl />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="guests" element={<GuestManagement />} />
          <Route path="permits" element={<Permits />} />
          <Route path="dining" element={<DiningTokenMgmt />} />
          <Route path="events" element={<EventLog />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
)

export default App
