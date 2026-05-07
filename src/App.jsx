import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { LanguageProvider } from "./contexts/LanguageContext"
import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import LiveTracking from "./pages/LiveTracking"
import RoutePlanner from "./pages/RoutePlanner"
import Schedules from "./pages/Schedules"
import SettingsPage from "./pages/SettingsPage"
import Favorites from "./pages/Favorites"

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") || sessionStorage.getItem("isAuthenticated")
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bus-tracking-theme">
      <LanguageProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/live-tracking" element={<LiveTracking />} />
                  <Route path="/route-planner" element={<RoutePlanner />} />
                  <Route path="/schedules" element={<Schedules />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App