"use client"

import { useState, useEffect } from "react"
import { generateLiveTrackingData } from "../data/mockData"
import { busStops } from "../data/mockData"

export const useLiveTracking = () => {
  const [buses, setBuses] = useState(generateLiveTrackingData())
  const [selectedStop, setSelectedStop] = useState(busStops[0]?.name || "")
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(generateLiveTrackingData())
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const selectedStopData = busStops.find((stop) => stop.name === selectedStop)

  return {
    buses,
    busStops,
    selectedStop,
    setSelectedStop,
    selectedStopData,
    lastUpdate,
  }
}
