"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "./theme-provider"
import { useLanguage } from "../contexts/LanguageContext"
import { Button } from "./ui/button"
import { ChatbotWidget } from "./chatbot"
import {
  LayoutDashboard,
  MapPin,
  Route,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Zap,
  ZapOff,
  User,
  Star,
} from "lucide-react"

const Layout = ({ children }) => {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lowBandwidth, setLowBandwidth] = useState(false)

  // Add logout function
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated")
    sessionStorage.removeItem("isAuthenticated")
    
    // Redirect to login page
    navigate("/login")
  }

  // Add settings function
  const handleSettings = () => {
    navigate("/settings")
  }

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const navigation = [
    { name: t('dashboard'), href: "/", icon: LayoutDashboard },
    { name: t('liveTracking'), href: "/live-tracking", icon: MapPin },
    { name: t('routePlanner'), href: "/route-planner", icon: Route },
    { name: t('schedules'), href: "/schedules", icon: Calendar },
    { name: "Favorites", href: "/favorites", icon: Star },
  ]

  const getPageTitle = () => {
    const currentNav = navigation.find((nav) => nav.href === location.pathname)
    return currentNav ? currentNav.name : t('dashboard')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">{t('busTracker')}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Profile Section */}
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@gmail.com</p>
              </div>
            </div>
            <div className="space-y-2">
              {/* Settings button with onClick handler */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleSettings}
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('settings')}
              </Button>
              
              {/* Logout button with onClick handler */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>

            <div className="flex items-center space-x-4">
              {/* System Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-destructive">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                )}
              </div>

              {/* Low Bandwidth Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLowBandwidth(!lowBandwidth)}
                className={lowBandwidth ? "text-warning" : "text-muted-foreground"}
              >
                {lowBandwidth ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                <span className="ml-1 text-sm">{lowBandwidth ? "Low Bandwidth" : "Normal"}</span>
              </Button>

              {/* Dark Mode Toggle */}
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 pb-28">{children}</main>
        {/* Floating Chatbot */}
        <ChatbotWidget />
      </div>
    </div>
  )
}

export default Layout