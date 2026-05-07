"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Badge } from "../components/ui/badge"
import RouteCard from "../components/RouteCard"
import { popularDestinations, calculateRoute, findTransferPlan } from "../data/routeData"
import { busStops } from "../data/mockData"
import { MapPin, Search, Bell, BellOff, RouteIcon, ArrowRight, BellRing, X } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

const RoutePlanner = () => {
  const location = useLocation()
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [plannedRoute, setPlannedRoute] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [transferPlan, setTransferPlan] = useState(null)
  const [subscribedRoutes, setSubscribedRoutes] = useState([])
  const [alertBanner, setAlertBanner] = useState(null)
  const pollRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (location.state && (location.state.from || location.state.to)) {
      const from = location.state.from || ""
      const to = location.state.to || ""
      setFromLocation(from)
      setToLocation(to)
      if (from && to && from !== to) {
        const route = calculateRoute(from, to)
        setPlannedRoute(route)
        const plan = findTransferPlan(from, to)
        setTransferPlan(plan)
      }
    }
  }, [location.state])

  // Load subscriptions
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("subscribed_routes") || "[]")
      setSubscribedRoutes(saved)
    } catch {}
  }, [])

  // Save subscriptions
  useEffect(() => {
    try { localStorage.setItem("subscribed_routes", JSON.stringify(subscribedRoutes)) } catch {}
  }, [subscribedRoutes])

  const handlePlanRoute = async () => {
    if (!fromLocation || !toLocation || fromLocation === toLocation) return

    setIsSearching(true)
    try {
      const route = calculateRoute(fromLocation, toLocation)
      setPlannedRoute(route)
      const plan = findTransferPlan(fromLocation, toLocation)
      setTransferPlan(plan)
    } catch (error) {
      console.error("Error planning route:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectRoute = (route) => {
    console.log("Selected route:", route)
  }

  const swapLocations = () => {
    const temp = fromLocation
    setFromLocation(toLocation)
    setToLocation(temp)
    // Clear planned route when swapping
    setPlannedRoute(null)
    setTransferPlan(null)
  }

  const toggleSubscribe = (routeCode) => {
    setSubscribedRoutes((prev) =>
      prev.includes(routeCode) ? prev.filter((r) => r !== routeCode) : [...prev, routeCode]
    )
  }

  // Notifications polling: every 30s check for any subscribed or planned route with ETA <= 5 mins at any stop
  useEffect(() => {
    if (!notificationsEnabled) {
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = null
      setAlertBanner(null)
      return
    }
    
    const poll = () => {
      try {
        const watchRoutes = new Set([...(plannedRoute?.routes || []), ...subscribedRoutes].map((r) => r.toUpperCase()))
        if (watchRoutes.size === 0) {
          setAlertBanner(null)
          return
        }
        
        for (const stop of busStops) {
          for (const up of stop.upcomingBuses || []) {
            const rc = up.route.toUpperCase()
            if (watchRoutes.has(rc)) {
              const mins = parseInt(String(up.eta).replace(/[^0-9]/g, ''), 10)
              if (!isNaN(mins) && mins <= 5) {
                setAlertBanner({ route: up.route, eta: up.eta, stop: stop.name })
                return
              }
            }
          }
        }
        setAlertBanner(null)
      } catch (error) {
        console.error("Error in notification polling:", error)
      }
    }
    
    poll()
    pollRef.current = setInterval(poll, 30000)
    return () => { 
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [notificationsEnabled, plannedRoute, subscribedRoutes])

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.6 }}
    >
      {/* Alert Banner */}
      {alertBanner && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-amber-100 border border-amber-200 rounded-lg flex items-center justify-between">
          <div className="text-sm">
            <strong>{alertBanner.route}</strong> is {alertBanner.eta} away at {alertBanner.stop}
          </div>
          <Button size="icon" variant="ghost" onClick={() => setAlertBanner(null)}>
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Route Planning Form */}
      <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RouteIcon className="w-5 h-5 mr-2 text-primary" />
              {t("planYourJourney")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From */}
              <motion.div variants={fadeIn} transition={{ delay: 0.15 }} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("from")}</label>
                <Select value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="w-full">
                  <option value="">{t("selectStartingPoint")}</option>
                  {popularDestinations.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </Select>
              </motion.div>

              {/* To */}
              <motion.div variants={fadeIn} transition={{ delay: 0.2 }} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t("to")}</label>
                <Select value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="w-full">
                  <option value="">{t("selectDestination")}</option>
                  {popularDestinations.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </Select>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div variants={fadeIn} transition={{ delay: 0.25 }} className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={swapLocations} disabled={!fromLocation && !toLocation}>
                <ArrowRight className="w-4 h-4 mr-2 rotate-90" />
                {t("swap")}
              </Button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
                  <div className="flex items-center space-x-1">
                    {notificationsEnabled ? (
                      <Bell className="w-4 h-4 text-primary" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{t("notifications")}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlanRoute}
                  disabled={!fromLocation || !toLocation || fromLocation === toLocation || isSearching}
                  className="min-w-[120px]"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t("searching")}...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      {t("planRoute")}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Current Selection */}
            {fromLocation && toLocation && fromLocation !== toLocation && (
              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{fromLocation}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{toLocation}</span>
                </div>
                {notificationsEnabled && (
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    Notifications enabled - you'll be alerted when buses are 5 minutes away
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Route Results */}
      {plannedRoute && (
        <motion.div variants={fadeIn} transition={{ delay: 0.35 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("recommendedRoute")}</h3>
            <Badge variant="success" className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              {t("liveData")}
            </Badge>
          </div>

          <RouteCard route={plannedRoute} onSelectRoute={handleSelectRoute} />

          {/* Preferred Bus Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BellRing className="w-5 h-5 text-primary" />
                Preferred Bus Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {plannedRoute.routes?.map((r) => (
                  <Button key={r} size="sm" variant={subscribedRoutes.includes(r) ? "glow" : "outline"} onClick={() => toggleSubscribe(r)}>
                    {subscribedRoutes.includes(r) ? `Unsubscribe ${r}` : `Subscribe ${r}`}
                  </Button>
                ))}
                {(plannedRoute.availableBuses || []).map((b) => (
                  <Button key={b.busId} size="sm" variant={subscribedRoutes.includes(b.route) ? "glow" : "outline"} onClick={() => toggleSubscribe(b.route)}>
                    {subscribedRoutes.includes(b.route) ? `Unsubscribe ${b.route}` : `Subscribe ${b.route}`}
                  </Button>
                ))}
              </div>

              {subscribedRoutes.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Subscribed Routes</p>
                  <div className="flex flex-wrap gap-2">
                    {subscribedRoutes.map((r) => (
                      <Badge key={`sub-${r}`} variant="outline" className="flex items-center gap-2">
                        {r}
                        <button onClick={() => toggleSubscribe(r)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Smart Transfer Suggestions */}
      {transferPlan && transferPlan.type === "transfer" && (
        <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-primary" />
                Smart Transfer Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No direct route found. Try this transfer option:
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-sm font-medium">
                  <span className="px-2 py-1 bg-blue-100 rounded">{transferPlan.steps[0].take}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="px-2 py-1 bg-blue-100 rounded">{transferPlan.middleStop}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="px-2 py-1 bg-blue-100 rounded">{transferPlan.steps[1].take}</span>
                </div>
                <p className="text-xs text-center mt-2 text-blue-700">
                  Change at {transferPlan.middleStop} to reach {toLocation}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setFromLocation(transferPlan.steps[0].from)
                  setToLocation(transferPlan.middleStop)
                  setPlannedRoute(null)
                  setTransferPlan(null)
                }}>
                  Plan: {transferPlan.steps[0].from} → {transferPlan.middleStop}
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setFromLocation(transferPlan.middleStop)
                  setToLocation(transferPlan.steps[1].to)
                  setPlannedRoute(null)
                  setTransferPlan(null)
                }}>
                  Plan: {transferPlan.middleStop} → {transferPlan.steps[1].to}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("popularRoutes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { from: "Howrah Station", to: "Salt Lake Sector V" },
                { from: "Park Street Museum", to: "Science City" },
                { from: "Sealdah Station", to: "Esplanade" },
              ].map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFromLocation(route.from)
                    setToLocation(route.to)
                  }}
                  className="justify-start"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {route.from} → {route.to}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Help Section */}
      <motion.div variants={fadeIn} transition={{ delay: 0.45 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t("routePlannerHelp")}</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span>• {t("realTimeUpdates")}</span>
                <span>• {t("liveOccupancyData")}</span>
                <span>• {t("smartNotifications")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default RoutePlanner
