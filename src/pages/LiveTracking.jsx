// "use client"

// import { useLiveTracking } from "../hooks/useLiveTracking"
// import BusStopTracker from "../components/BusStopTracker"
// import { Card, CardContent } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
// import { RefreshCw, Wifi, WifiOff } from "lucide-react"
// import { useState, useEffect, useRef } from "react"
// import { useLanguage } from "../contexts/LanguageContext"
// import { motion } from "framer-motion"

// const LiveTracking = () => {
//   const { buses, busStops, selectedStop, setSelectedStop, selectedStopData, lastUpdate } = useLiveTracking()
//   const [isOnline, setIsOnline] = useState(navigator.onLine)
//   const mapRef = useRef(null)
//   const markersRef = useRef([])
//   const { t } = useLanguage()

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)

//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)

//     return () => {
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])

//   useEffect(() => {
//     if (!window.L) return

//     if (!mapRef.current) {
//       const initialCenter = [buses[0]?.coordinates.lat || 22.5726, buses[0]?.coordinates.lng || 88.3639]
//       mapRef.current = window.L.map("live-map", { zoomControl: true, attributionControl: false }).setView(initialCenter, 12)

//       window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//       }).addTo(mapRef.current)
//     }

//     markersRef.current.forEach((m) => m.remove())
//     markersRef.current = []

//     const newMarkers = buses.map((bus) => {
//       const marker = window.L.marker([bus.coordinates.lat, bus.coordinates.lng]).addTo(mapRef.current)
//       marker.bindPopup(
//         `<div style="min-width:180px">
//           <strong>${bus.registration}</strong><br/>
//           ${bus.route}<br/>
//           ${t('nextStop')}: ${bus.nextStop} • ${t('eta')} ${bus.eta}<br/>
//           ${t('speed')}: ${bus.speed} km/h
//         </div>`
//       )
//       return marker
//     })
//     markersRef.current = newMarkers

//     if (newMarkers.length > 0) {
//       const group = window.L.featureGroup(newMarkers)
//       try {
//         mapRef.current.fitBounds(group.getBounds().pad(0.2))
//       } catch {}
//     }
//   }, [buses, t])

//   const activeBuses = buses.filter((bus) => bus.status !== "Offline").length
//   const onTimeBuses = buses.filter((bus) => bus.status === "On Time").length
//   const delayedBuses = buses.filter((bus) => bus.status === "Delayed").length

//   return (
//     <div className="space-y-6">

//       {/* Live Status Header */}
//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-4 gap-4"
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {[
//           {
//             value: activeBuses,
//             label: t('activeBuses'),
//             icon: <RefreshCw className="w-8 h-8 text-muted-foreground" />,
//             color: "text-primary"
//           },
//           {
//             value: onTimeBuses,
//             label: t('onTime'),
//             badge: <Badge variant="success" className="text-xs">{t('live')}</Badge>,
//             color: "text-success"
//           },
//           {
//             value: delayedBuses,
//             label: t('delayed'),
//             badge: <Badge variant="destructive" className="text-xs">{t('alert')}</Badge>,
//             color: "text-destructive"
//           },
//           {
//             value: isOnline ? t('online') : t('offline'),
//             label: isOnline ? t('realTimeData') : t('cachedData'),
//             icon: isOnline
//               ? <Wifi className="w-5 h-5 text-success" />
//               : <WifiOff className="w-5 h-5 text-destructive" />,
//             isStatus: true
//           }
//         ].map((card, i) => (
//           <motion.div
//             key={i}
//             whileHover={{ scale: 1.03 }}
//             transition={{ type: "spring", stiffness: 200 }}
//           >
//             <Card>
//               <CardContent className="pt-5">
//                 <div className="flex items-center justify-between">
//                   {!card.isStatus ? (
//                     <>
//                       <div>
//                         <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
//                         <p className="text-sm text-muted-foreground">{card.label}</p>
//                       </div>
//                       {card.icon || card.badge}
//                     </>
//                   ) : (
//                     <div className="flex items-center space-x-2">
//                       {card.icon}
//                       <div>
//                         <p className="text-sm font-medium">{card.value}</p>
//                         <p className="text-xs text-muted-foreground">{card.label}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Main Content Grid */}
//       <motion.div
//         className="grid grid-cols-1 xl:grid-cols-3 gap-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//       >
//         {/* Bus Stop Tracker */}
//         <motion.div
//           className="xl:col-span-1"
//           initial={{ x: -40, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <BusStopTracker
//             busStops={busStops}
//             selectedStop={selectedStop}
//             setSelectedStop={setSelectedStop}
//             selectedStopData={selectedStopData}
//           />
//         </motion.div>

//         {/* Bus Status + Map */}
//         <motion.div
//           className="xl:col-span-2"
//           initial={{ x: 40, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="space-y-4">
//             <motion.div
//               className="flex items-center justify-between"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.7 }}
//             >
//               <h3 className="text-lg font-semibold">{t('liveBusStatus')}</h3>
//               <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                 <RefreshCw className="w-4 h-4" />
//                 <span>{t('updatesEvery30s')}</span>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.7 }}
//             >
//               <Card>
//                 <CardContent className="pt-4">
//                   <div id="live-map" className="w-full h-[500px] rounded-md border border-border"></div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* System Status Footer */}
//       <motion.div
//         initial={{ y: 30, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.7 }}
//       >
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between text-sm">
//               <div className="flex items-center space-x-4">
//                 <span className="text-muted-foreground">
//                   {t('lastUpdated')}: {lastUpdate.toLocaleTimeString()}
//                 </span>
//                 <Badge variant="outline" className="text-xs">
//                   {t('autoRefresh')}: ON
//                 </Badge>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
//                 <span className="text-muted-foreground">{t('liveTrackingActive')}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }

// export default LiveTracking

"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import BusStopTracker from "../components/BusStopTracker";
import { useLiveTracking } from "../hooks/useLiveTracking";

const LiveTracking = () => {
  const { busStops, selectedStop, setSelectedStop, selectedStopData } =
    useLiveTracking();
  const [buses, setBuses] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const { t } = useLanguage();

  // ✅ Firebase listener
  useEffect(() => {
    const busRef = ref(db, "Bus track");
    const unsubscribe = onValue(busRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = [
          {
            id: "Bus-1",
            coordinates: { lat: data.latitude, lng: data.longitude },
            speed: data.speed,
            time: new Date(data.time || Date.now()),
          },
        ];
        setBuses(formatted);
        setLastUpdate(new Date());
      } else {
        setBuses([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // (Removed online/offline header cards)

  // ✅ Map + Markers
  useEffect(() => {
    if (!window.L) return;

    if (!mapRef.current) {
      const initialCenter = [
        buses[0]?.coordinates.lat || 22.5726,
        buses[0]?.coordinates.lng || 88.3639,
      ];
      mapRef.current = window.L.map("live-map", {
        zoomControl: true,
        attributionControl: false,
      }).setView(initialCenter, 12);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const busIcon = window.L.icon({
      iconUrl: "/bus.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    });

    const newMarkers = buses.map((bus) => {
      const marker = window.L.marker(
        [bus.coordinates.lat, bus.coordinates.lng],
        { icon: busIcon }
      ).addTo(mapRef.current);
      marker.bindPopup(
        `<div style="min-width:200px">
          <strong>${bus.id}</strong><br/>
          📍 Lat: ${bus.coordinates.lat.toFixed(
            4
          )}, Lng: ${bus.coordinates.lng.toFixed(4)}<br/>
          🕒 Last Tracked: ${bus.time.toLocaleString()}<br/>
          🚍 Speed: ${bus.speed} km/h
        </div>`
      );
      return marker;
    });
    markersRef.current = newMarkers;

    if (newMarkers.length > 0) {
      const group = window.L.featureGroup(newMarkers);
      try {
        mapRef.current.fitBounds(group.getBounds().pad(0.2));
      } catch {}
    }
  }, [buses]);

  return (
    <div className="space-y-6">
      {/* Main Grid - aligned tracker and map */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Bus Stop Tracker */}
        <motion.div
          className="xl:col-span-1 h-full"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <BusStopTracker
            busStops={busStops}
            selectedStop={selectedStop}
            setSelectedStop={setSelectedStop}
            selectedStopData={selectedStopData}
          />
        </motion.div>

        {/* Map */}
        <motion.div
          className="xl:col-span-2 h-full"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-lg font-semibold">{t("liveBusStatus")}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4" />
                <span>{t("updatesEvery30s")}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <Card>
                <CardContent className="pt-4">
                  <div id="live-map" className="w-full h-[520px] rounded-md border border-border"></div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  {t("lastUpdated")}: {lastUpdate.toLocaleTimeString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {t("autoRefresh")}: ON
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">
                  {t("liveTrackingActive")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LiveTracking;
