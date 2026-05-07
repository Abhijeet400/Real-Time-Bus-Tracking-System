// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useNavigate } from "react-router-dom"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
// import { Button } from "../components/ui/button"
// import { Badge } from "../components/ui/badge"
// import { useRealTimeData } from "../hooks/useRealTimeData"
// import { useLanguage } from "../contexts/LanguageContext"
// import {
//   Bus,
//   Users,
//   Clock,
//   TrendingUp,
//   MapPin,
//   Navigation,
//   Compass,
//   Route,
//   LogOut
// } from "lucide-react"

// const Dashboard = () => {
//   const { buses, activeBuses, onTimeBuses, totalPassengers, averageETA, lastUpdate } = useRealTimeData()
//   const { t } = useLanguage()
//   const [userLocation, setUserLocation] = useState({ lat: 22.5726, lng: 88.3639 })
//   const [nearbyBuses, setNearbyBuses] = useState([])
//   const mapRef = useRef(null)
//   const markersRef = useRef([])
//   const navigate = useNavigate()

  

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setUserLocation({
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           })
//         },
//         (err) => {
//           console.error("Geolocation error:", err)
//         },
//         { enableHighAccuracy: true }
//       )
//     }
//   }, [])

//   useEffect(() => {
//     const findNearbyBuses = () => {
//       const nearby = buses.filter(bus => {
//         const distance = calculateDistance(
//           userLocation.lat, userLocation.lng,
//           bus.coordinates.lat, bus.coordinates.lng
//         )
//         return distance <= 2
//       })
//       setNearbyBuses(nearby)
//     }
//     findNearbyBuses()
//   }, [buses, userLocation])

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371
//     const dLat = (lat2 - lat1) * Math.PI / 180
//     const dLon = (lon2 - lon1) * Math.PI / 180
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon/2) * Math.sin(dLon/2)
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
//     return R * c
//   }

//   useEffect(() => {
//     if (!window.L) return

//     if (!mapRef.current) {
//       mapRef.current = window.L.map("dashboard-map", { zoomControl: true, attributionControl: false })
//         .setView([userLocation.lat, userLocation.lng], 14)

//       window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//       }).addTo(mapRef.current)
//     }

//     markersRef.current.forEach((m) => m.remove())
//     markersRef.current = []

//     const userMarker = window.L.marker([userLocation.lat, userLocation.lng], {
//       icon: window.L.divIcon({
//         className: 'user-location-marker',
//         html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
//         iconSize: [16, 16],
//         iconAnchor: [8, 8]
//       })
//     }).addTo(mapRef.current)
//     userMarker.bindPopup(`<b>${t('yourLocation')}</b><br/>Salt Lake Sector V`)
//     markersRef.current.push(userMarker)

//     nearbyBuses.forEach(bus => {
//       const busMarker = window.L.marker([bus.coordinates.lat, bus.coordinates.lng], {
//         icon: window.L.divIcon({
//           className: 'bus-marker',
//           html: '<div class="w-3 h-3 bg-red-500 rounded-full border border-white"></div>',
//           iconSize: [12, 12],
//           iconAnchor: [6, 6]
//         })
//       }).addTo(mapRef.current)

//       const distance = calculateDistance(
//         userLocation.lat, userLocation.lng,
//         bus.coordinates.lat, bus.coordinates.lng
//       )

//       busMarker.bindPopup(`
//         <div style="min-width:180px">
//           <strong>${bus.registration}</strong><br/>
//           ${t('route')}: ${bus.route}<br/>
//           ${t('nextStop')}: ${bus.nextStop}<br/>
//           ${t('eta')}: ${bus.eta}<br/>
//           ${t('distance')}: ${distance.toFixed(1)} km
//         </div>
//       `)
//       markersRef.current.push(busMarker)
//     })

//     if (markersRef.current.length > 0) {
//       const group = window.L.featureGroup(markersRef.current)
//       try {
//         mapRef.current.fitBounds(group.getBounds().pad(0.1))
//       } catch {}
//     }
//   }, [userLocation, nearbyBuses])

//   const getStatusVariant = (status) => {
//     switch (status) {
//       case "On Time":
//         return "success"
//       case "Delayed":
//         return "destructive"
//       case "Approaching":
//         return "warning"
//       default:
//         return "default"
//     }
//   }

//   const popularDestinations = [
//     { name: "Howrah Station", distance: "18.5 km", route: "215A", eta: "35 mins" },
//     { name: "Dum Dum Airport", distance: "15.3 km", route: "8B", eta: "28 mins" },
//     { name: "Sealdah Station", distance: "22.2 km", route: "22C", eta: "42 mins" },
//     { name: "Park Street Museum", distance: "8.2 km", route: "8B", eta: "15 mins" },
//     { name: "Esplanade", distance: "12.1 km", route: "22C", eta: "25 mins" },
//     { name: "Biswa Bangla", distance: "5.8 km", route: "22C", eta: "12 mins" },
//   ]

//   return (
//     <div className="space-y-6">
      

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">{t('activeBuses')}</CardTitle>
//             <Bus className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary">{activeBuses}</div>
//             <div className="flex items-center text-xs text-success">
//               <TrendingUp className="h-3 w-3 mr-1" />
//               +2 {t('fromYesterday')}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">{t('onTimeBuses')}</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-success">{onTimeBuses}</div>
//             <div className="text-xs text-muted-foreground">
//               {Math.round((onTimeBuses / activeBuses) * 100)}% {t('onSchedule')}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">{t('averageETA')}</CardTitle>
//             <MapPin className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold  text-black dark:text-white">{averageETA} {t('mins')}</div>
//             <div className="text-xs text-muted-foreground">{t('acrossAllRoutes')}</div>
//           </CardContent>
//         </Card>

        
//     </div>

//     {/* Main Content */}
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Left Section */}
//       <div className="lg:col-span-2 space-y-6">
//         {/* Map Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Navigation className="h-5 w-5 text-primary" />
//               {t('yourCurrentLocation')}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Compass className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">Salt Lake Sector V</span>
//                 </div>
//                 <Badge variant="outline" className="text-xs">
//                   {t('gpsActive')}
//                 </Badge>
//               </div>
//               <div id="dashboard-map" className="w-full h-[300px] rounded-md border border-border"></div>
//               <div className="flex items-center justify-between text-xs text-muted-foreground">
//                 <span>📍 {t('yourLocation')}</span>
//                 <span>🚌 {nearbyBuses.length} {t('busesNearby')}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Where Can I Go */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Route className="h-5 w-5 text-primary" />
//               {t('whereCanIGo')}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {popularDestinations.map((destination, index) => (
//                 <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-semibold text-sm">{destination.name}</h4>
//                     <Badge variant="outline" className="text-xs">{destination.route}</Badge>
//                   </div>
//                   <div className="space-y-1 text-xs text-muted-foreground">
//                     <div className="flex justify-between">
//                       <span>{t('distance')}:</span>
//                       <span>{destination.distance}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>{t('eta')}:</span>
//                       <span className="font-medium">{destination.eta}</span>
//                     </div>
//                   </div>
//                   <Button
//                     size="sm"
//                     className="w-full mt-3"
//                     variant="outline"
//                     onClick={() => navigate('/route-planner', { state: { from: 'Salt Lake Sector V', to: destination.name } })}
//                   >
//                     {t('planRoute')}
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Section (Sidebar) */}
//       <div className="space-y-6">
//         {/* Nearby Buses */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bus className="h-5 w-5 text-primary" />
//               {t('nearbyBuses')}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {nearbyBuses.length > 0 ? (
//                 nearbyBuses.map((bus) => {
//                   const distance = calculateDistance(
//                     userLocation.lat, userLocation.lng,
//                     bus.coordinates.lat, bus.coordinates.lng
//                   )
//                   return (
//                     <div key={bus.id} className="p-3 border rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-semibold text-sm">{bus.registration}</span>
//                         <Badge variant={getStatusVariant(bus.status)} className="text-xs">
//                           {t(bus.status)}
//                         </Badge>
//                       </div>
//                       <div className="space-y-1 text-xs text-muted-foreground">
//                         <div className="flex justify-between">
//                           <span>{t('route')}:</span>
//                           <span>{bus.route}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>{t('nextStop')}:</span>
//                           <span>{bus.nextStop}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>{t('eta')}:</span>
//                           <span className="font-medium">{bus.eta}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>{t('distance')}:</span>
//                           <span>{distance.toFixed(1)} km</span>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })
//               ) : (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <Bus className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">{t('noBusesNearby')}</p>
//                   <p className="text-xs">{t('tryExpandingRadius')}</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

        
//       </div>
//     </div>

//     {/* Footer: System Status */}
//     <Card>
//       <CardContent className="pt-6">
//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <span>{t('lastUpdated')}: {lastUpdate.toLocaleTimeString()}</span>
//           <span>{t('updatesEvery')} </span>
//         </div>
//       </CardContent>
//     </Card>
//   </div>
// )
// }

// export default Dashboard



"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useRealTimeData } from "../hooks/useRealTimeData"
import { useLanguage } from "../contexts/LanguageContext"
import { motion } from "framer-motion"
import {
  Bus,
  Clock,
  TrendingUp,
  MapPin,
  Navigation,
  Compass,
  Route,
  Flame,
} from "lucide-react"
import BusNumberSearchCard from "../components/BusNumberSearchCard"

const Dashboard = () => {
  const { buses, activeBuses, onTimeBuses, averageETA, lastUpdate } = useRealTimeData()
  const { t } = useLanguage()
  const [userLocation, setUserLocation] = useState({ lat: 22.5726, lng: 88.3639 })
  const [busiestRouteData, setBusiestRouteData] = useState({ route: null, count: 0, lastUpdate: new Date() })
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const navigate = useNavigate()

  // User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // Update busiest route when buses data or user location changes
  useEffect(() => {
    updateBusiestRoute()
  }, [buses, userLocation])

  // Auto-update busiest route every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateBusiestRoute()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Map for user location only
  useEffect(() => {
    if (!window.L) return

    if (!mapRef.current) {
      mapRef.current = window.L.map("dashboard-map", { zoomControl: true, attributionControl: false })
        .setView([userLocation.lat, userLocation.lng], 15)

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    // Add only user location marker
    const userMarker = window.L.marker([userLocation.lat, userLocation.lng], {
      icon: window.L.divIcon({
        className: 'user-location-marker',
        html: '<div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(mapRef.current)
    
    userMarker.bindPopup(`
      <div style="min-width:200px; text-align: center;">
        <strong>📍 Your Location</strong><br/>
        <div style="margin: 8px 0; font-size: 12px; color: #666;">
          ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}
        </div>
        <div style="font-size: 11px; color: #888;">
          GPS Active • Live Tracking
        </div>
      </div>
    `)
    markersRef.current.push(userMarker)

    // Center map on user location
    mapRef.current.setView([userLocation.lat, userLocation.lng], 15)
  }, [userLocation])


  const getStatusVariant = (status) => {
    switch (status) {
      case "On Time": return "success"
      case "Delayed": return "destructive"
      case "Approaching": return "warning"
      default: return "default"
    }
  }

  // Calculate busiest route and update state
  const updateBusiestRoute = () => {
    const routeCounts = {}
    const routeWeights = {} // Weight routes based on proximity to user location
    
    buses.forEach(bus => {
      const route = bus.route
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        bus.coordinates.lat, bus.coordinates.lng
      )
      
      // Weight closer buses more heavily (inverse distance weighting)
      const weight = distance > 0 ? 1 / (1 + distance) : 1
      
      routeCounts[route] = (routeCounts[route] || 0) + 1
      routeWeights[route] = (routeWeights[route] || 0) + weight
    })
    
    let busiestRoute = null
    let maxWeight = 0
    
    // Find route with highest weighted score (considering both count and proximity)
    Object.entries(routeWeights).forEach(([route, weight]) => {
      if (weight > maxWeight) {
        maxWeight = weight
        busiestRoute = route
      }
    })
    
    setBusiestRouteData({
      route: busiestRoute,
      count: routeCounts[busiestRoute] || 0,
      lastUpdate: new Date()
    })
  }

  // Get current busiest route data
  const getBusiestRoute = () => {
    return busiestRouteData
  }

  const popularDestinations = [
    { name: "Howrah Station", distance: "18.5 km", route: "215A", eta: "35 mins" },
    { name: "Dum Dum Airport", distance: "15.3 km", route: "8B", eta: "28 mins" },
    { name: "Sealdah Station", distance: "22.2 km", route: "22C", eta: "42 mins" },
    { name: "Park Street Museum", distance: "8.2 km", route: "8B", eta: "15 mins" },
    { name: "Esplanade", distance: "12.1 km", route: "22C", eta: "25 mins" },
    { name: "Biswa Bangla", distance: "5.8 km", route: "22C", eta: "12 mins" },
  ]

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      
      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {(() => {
          const busiestRoute = getBusiestRoute()
          return [
            { title: t('activeBuses'), value: activeBuses, icon: <Bus className="h-4 w-4 text-muted-foreground" />, extra: <div className="flex items-center text-xs text-success"><TrendingUp className="h-3 w-3 mr-1" />+2 {t('fromYesterday')}</div> },
            { title: t('onTimeBuses'), value: onTimeBuses, icon: <Clock className="h-4 w-4 text-muted-foreground" />, extra: <div className="text-xs text-muted-foreground">{Math.round((onTimeBuses / activeBuses) * 100)}% {t('onSchedule')}</div> },
            { title: "Busiest Route", value: busiestRoute.route || "N/A", icon: <Flame className="h-4 w-4 text-orange-500" />, extra: <div className="text-xs text-muted-foreground">{busiestRoute.count} buses active • Updated {busiestRoute.lastUpdate.toLocaleTimeString()}</div> }
          ]
        })().map((card, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.extra}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Live Location Map */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Your Live Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Live GPS Tracking</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      GPS Active
                    </Badge>
                  </div>
                  
                  <div id="dashboard-map" className="w-full h-[300px] rounded-md border border-border"></div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>📍 Your current location on map</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Destinations */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-primary" />
                  {t('whereCanIGo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularDestinations.map((destination, index) => (
                    <motion.div 
                      key={index} 
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{destination.name}</h4>
                        <Badge variant="outline" className="text-xs">{destination.route}</Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>{t('distance')}:</span>
                          <span>{destination.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('eta')}:</span>
                          <span className="font-medium">{destination.eta}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        variant="outline"
                        onClick={() => navigate('/route-planner', { state: { from: 'Salt Lake Sector V', to: destination.name } })}
                      >
                        {t('planRoute')}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Section */}
        <motion.div className="space-y-6" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
          {/* Bus number search + last two arrivals (replaces Next Bus ETA) */}
          <BusNumberSearchCard userLocation={userLocation} />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t('lastUpdated')}: {lastUpdate.toLocaleTimeString()}</span>
              <span>{t('updatesEvery')}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
