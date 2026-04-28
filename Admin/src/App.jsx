import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import AdminHome from './components/AdminHome'
import UserHomeManager from './components/UserHomeManager'
import DesignLabManager from './components/DesignLabManager'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="user-home" element={<UserHomeManager />} />
          <Route path="design-lab" element={<DesignLabManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
