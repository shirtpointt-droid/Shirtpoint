import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import DesignLab from './components/DesignLab'
import CategoryPage from './components/CategoryPage'
import UserHome from './components/UserHome'
import UserProfile from './components/UserProfile'
import Settings from './components/Settings'
import SellerPlace from './components/SellerPlace'
import DesignerDashboard from './components/DesignerDashboard'
import Membership from './components/Membership'
import ForgotPassword from './components/ForgotPassword'
import TwoFactorSetup from './components/TwoFactorSetup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/design-lab" element={<DesignLab />} />
        <Route path="/design-lab/:category" element={<CategoryPage />} />
        <Route path="/design-lab/:category/:product" element={<DesignLab />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/marketplace" element={<SellerPlace />} />
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/2fa-setup" element={<TwoFactorSetup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
