"use client"

import { useState, useEffect } from "react"
import { mockBuses } from "../data/mockData"

export const useRealTimeData = () => {
  const [buses, setBuses] = useState(mockBuses)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          // Simulate real-time updates
          passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + Math.floor(Math.random() * 6) - 3)),
          speed: Math.max(0, Math.min(60, bus.speed + Math.floor(Math.random() * 10) - 5)),
          coordinates: {
            lat: bus.coordinates.lat + (Math.random() - 0.5) * 0.001,
            lng: bus.coordinates.lng + (Math.random() - 0.5) * 0.001,
          },
          lastUpdated: new Date(),
        })),
      )
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const activeBuses = buses.length
  const onTimeBuses = buses.filter((bus) => bus.status === "On Time").length
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.passengers, 0)
  const averageETA = Math.round(buses.reduce((sum, bus) => sum + Number.parseInt(bus.eta), 0) / buses.length)

  return {
    buses,
    activeBuses,
    onTimeBuses,
    totalPassengers,
    averageETA,
    lastUpdate,
  }
}
