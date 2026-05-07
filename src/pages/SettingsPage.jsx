"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Select } from "../components/ui/select"
import { Bell, Shield, Globe, Palette, Save, User, Mail, Phone, MapPin, Lock, Type } from "lucide-react"
import { useTheme } from "../components/theme-provider"
import { useLanguage } from "../contexts/LanguageContext"
import { languageOptions } from "../data/languages"

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()
  const { t, currentLanguage, changeLanguage } = useLanguage()
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: false,
    autoRefresh: true,
    locationAccess: true,
    lowBandwidth: false,
    refreshInterval: 30,
    defaultLocation: "",
    searchRadius: 2,
    textScale: "m",
  })

  const [userData, setUserData] = useState({
    email: "admin@gmail.com",
    phone: "+91 9876543210",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(prev => ({
          ...prev,
          ...parsedSettings
        }))

        if (parsedSettings.darkMode !== undefined) {
          setTheme(parsedSettings.darkMode ? "dark" : "light")
        }

        if (parsedSettings.lowBandwidth !== undefined) {
          if (parsedSettings.lowBandwidth) {
            document.body.classList.add("low-bandwidth")
          } else {
            document.body.classList.remove("low-bandwidth")
          }
        }

        if (parsedSettings.textScale) {
          applyTextScale(parsedSettings.textScale)
        }
      } catch (error) {
        console.error("Error parsing saved settings:", error)
      }
    } else {
      applyTextScale("m")
    }

    const savedUserData = localStorage.getItem("userData")
    if (savedUserData) {
      try {
        setUserData(prev => ({ ...prev, ...JSON.parse(savedUserData) }))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Update darkMode when theme changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: theme === "dark"
    }))
  }, [theme])

  const applyTextScale = (scale) => {
    const html = document.documentElement
    html.classList.remove("text-scale-s", "text-scale-m", "text-scale-l", "text-scale-xl")
    const map = { s: "text-scale-s", m: "text-scale-m", l: "text-scale-l", xl: "text-scale-xl" }
    html.classList.add(map[scale] || "text-scale-m")
  }

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    }
    setSettings(newSettings)

    if (key === "darkMode") {
      setTheme(value ? "dark" : "light")
    } else if (key === "lowBandwidth") {
      if (value) {
        document.body.classList.add("low-bandwidth")
      } else {
        document.body.classList.remove("low-bandwidth")
      }
    } else if (key === "textScale") {
      applyTextScale(value)
    }
  }

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode)
  }

  const handleUserDataChange = (key, value) => {
    setUserData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings))
      alert(t('settingsSaved'))
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    }
  }

  const handleSaveUserData = () => {
    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
      alert(t('passwordsDontMatch'))
      return
    }

    try {
      const dataToSave = { ...userData }
      delete dataToSave.currentPassword
      delete dataToSave.newPassword
      delete dataToSave.confirmPassword

      localStorage.setItem("userData", JSON.stringify(dataToSave))
      alert(t('profileUpdated'))
    } catch (error) {
      console.error("Error saving user data:", error)
      alert("Error saving profile")
    }
  }

  const handleChangePassword = () => {
    if (!userData.currentPassword) {
      alert(t('enterCurrentPassword'))
      return
    }

    if (userData.newPassword !== userData.confirmPassword) {
      alert(t('passwordsDontMatch'))
      return
    }

    if (userData.newPassword.length < 6) {
      alert(t('passwordMinLength'))
      return
    }

    alert(t('passwordChanged'))
    
    setUserData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }))
  }

  const resetToDefaults = () => {
    if (confirm(t('confirmReset'))) {
      const defaultSettings = {
        notifications: true,
        emailAlerts: false,
        darkMode: false,
        autoRefresh: true,
        locationAccess: true,
        lowBandwidth: false,
        refreshInterval: 30,
        defaultLocation: "",
        searchRadius: 2,
        textScale: "m",
      }
      
      // Reset settings state
      setSettings(defaultSettings)
      
      // Reset theme to light
      setTheme("light")
      
      // Remove low bandwidth mode
      document.body.classList.remove("low-bandwidth")

      // Reset text scale
      applyTextScale("m")
      
      // Reset language to English
      changeLanguage("english")
      
      // Save to localStorage
      try {
        localStorage.setItem("userSettings", JSON.stringify(defaultSettings))
        localStorage.setItem("selectedLanguage", "english")
        alert(t('settingsReset'))
      } catch (error) {
        console.error("Error resetting settings:", error)
        alert("Error resetting settings")
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">{t('settings')}</h1>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={resetToDefaults} variant="outline">
              {t('resetDefaults')}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSaveSettings} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {t('saveSettings')}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Notification Settings */}
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t('notifications')}
              </CardTitle>
              <CardDescription>{t('manageNotifications')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">{t('pushNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">{t('receiveAppNotifications')}</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailAlerts">{t('emailAlerts')}</Label>
                  <p className="text-xs text-muted-foreground">{t('getEmailAlerts')}</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => handleSettingChange("emailAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('appearance')}
              </CardTitle>
              <CardDescription>{t('customizeAppearance')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">{t('darkMode')}</Label>
                  <p className="text-xs text-muted-foreground">{t('switchTheme')}</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                />
              </div>

              {/* Text Size */}
              <div className="space-y-2">
                <Label htmlFor="textScale" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Text Size
                </Label>
                <div className="flex gap-2">
                  {[
                    { key: "s", label: "S" },
                    { key: "m", label: "M" },
                    { key: "l", label: "L" },
                    { key: "xl", label: "XL" },
                  ].map((opt) => (
                    <Button
                      key={opt.key}
                      variant={settings.textScale === opt.key ? "glow" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange("textScale", opt.key)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t('language')}</Label>
                <Select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('privacySecurity')}
              </CardTitle>
              <CardDescription>{t('managePrivacy')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="locationAccess">{t('locationAccess')}</Label>
                  <p className="text-xs text-muted-foreground">{t('allowLocation')}</p>
                </div>
                <Switch
                  id="locationAccess"
                  checked={settings.locationAccess}
                  onCheckedChange={(checked) => handleSettingChange("locationAccess", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lowBandwidth">{t('lowBandwidth')}</Label>
                  <p className="text-xs text-muted-foreground">{t('reduceDataUsage')}</p>
                </div>
                <Switch
                  id="lowBandwidth"
                  checked={settings.lowBandwidth}
                  onCheckedChange={(checked) => handleSettingChange("lowBandwidth", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Preferences */}
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('appPreferences')}
              </CardTitle>
              <CardDescription>{t('customizeBehavior')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRefresh">{t('autoRefresh')}</Label>
                  <p className="text-xs text-muted-foreground">{t('autoRefreshBusData')}</p>
                </div>
                <Switch
                  id="autoRefresh"
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => handleSettingChange("autoRefresh", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refreshInterval">{t('refreshInterval')}</Label>
                <Input
                  id="refreshInterval"
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange("refreshInterval", parseInt(e.target.value) || 30)}
                  min="5"
                  max="300"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('accountSettings')}
            </CardTitle>
            <CardDescription>{t('manageAccount')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleUserDataChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleUserDataChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('changePassword')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={userData.currentPassword}
                    onChange={(e) => handleUserDataChange("currentPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={userData.newPassword}
                    onChange={(e) => handleUserDataChange("newPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={userData.confirmPassword}
                    onChange={(e) => handleUserDataChange("confirmPassword", e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={handleChangePassword}>
                      {t('changePasswordBtn')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSaveUserData} className="mt-4">
                {t('saveProfile')}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Preferences */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t('locationPreferences')}
            </CardTitle>
            <CardDescription>{t('setLocationSettings')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultLocation">{t('defaultLocation')}</Label>
                <Input
                  id="defaultLocation"
                  placeholder={t('enterDefaultLocation')}
                  value={settings.defaultLocation}
                  onChange={(e) => handleSettingChange("defaultLocation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchRadius">{t('searchRadius')}</Label>
                <Select
                  value={settings.searchRadius}
                  onChange={(e) => handleSettingChange("searchRadius", parseInt(e.target.value))}
                >
                  <option value="1">1 km</option>
                  <option value="2">2 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPage