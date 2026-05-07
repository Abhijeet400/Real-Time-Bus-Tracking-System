export const routeOptions = [
  {
    id: "route-1",
    from: "Wipro",
    to: "Howrah Station",
    distance: "18.5 km",
    estimatedTime: "35 mins",
    // route fare shown as minimum across buses; kept for backward compatibility
    fare: "₹25",
    routes: ["215A"],
    availableBuses: [
      {
        busId: "215A",
        route: "215A",
        busType: "AC",
        fare: "₹40",
        departureTime: "09:15 AM",
        arrivalTime: "09:50 AM",
        status: "On Time",
        occupancy: 70,
        nextDeparture: "5 mins",
      },
      {
        busId: "215A",
        route: "215A",
        busType: "Non-AC",
        fare: "₹15",
        departureTime: "09:45 AM",
        arrivalTime: "10:20 AM",
        status: "On Time",
        occupancy: 45,
        nextDeparture: "35 mins",
      },
      { busId: "215", route: "215A", busType: "Non-AC", fare: "₹18", departureTime: "10:00 AM", arrivalTime: "10:35 AM", status: "On Time", occupancy: 52, nextDeparture: "50 mins" },
      { busId: "215A/1", route: "215A", busType: "AC", fare: "₹42", departureTime: "10:15 AM", arrivalTime: "10:48 AM", status: "Approaching", occupancy: 48, nextDeparture: "65 mins" },
      { busId: "12C", route: "215A", busType: "Non-AC", fare: "₹16", departureTime: "10:30 AM", arrivalTime: "11:05 AM", status: "On Time", occupancy: 44, nextDeparture: "80 mins" },
    ],
  },
  {
    id: "route-2",
    from: "Salt Lake City Centre",
    to: "Dum Dum Airport",
    distance: "15.3 km",
    estimatedTime: "28 mins",
    fare: "₹20",
    routes: ["8B"],
    availableBuses: [
      {
        busId: "8B",
        route: "8B",
        busType: "AC",
        fare: "₹45",
        departureTime: "09:20 AM",
        arrivalTime: "09:48 AM",
        status: "Delayed",
        occupancy: 85,
        nextDeparture: "8 mins",
      },
      {
        busId: "8B",
        route: "8B",
        busType: "Non-AC",
        fare: "₹20",
        departureTime: "09:50 AM",
        arrivalTime: "10:18 AM",
        status: "On Time",
        occupancy: 60,
        nextDeparture: "38 mins",
      },
      { busId: "8B/1", route: "8B", busType: "AC", fare: "₹48", departureTime: "10:05 AM", arrivalTime: "10:33 AM", status: "On Time", occupancy: 58, nextDeparture: "53 mins" },
      { busId: "DN47", route: "8B", busType: "Non-AC", fare: "₹22", departureTime: "10:20 AM", arrivalTime: "10:48 AM", status: "On Time", occupancy: 63, nextDeparture: "68 mins" },
      { busId: "ST6", route: "8B", busType: "AC", fare: "₹50", departureTime: "10:35 AM", arrivalTime: "11:03 AM", status: "On Time", occupancy: 49, nextDeparture: "83 mins" },
    ],
  },
  {
    id: "route-3",
    from: "Biswa Bangla",
    to: "Sealdah Station",
    distance: "22.2 km",
    estimatedTime: "42 mins",
    fare: "₹30",
    routes: ["22C"],
    availableBuses: [
      {
        busId: "22C",
        route: "22C",
        busType: "Non-AC",
        fare: "₹18",
        departureTime: "09:10 AM",
        arrivalTime: "09:52 AM",
        status: "Approaching",
        occupancy: 40,
        nextDeparture: "2 mins",
      },
      {
        busId: "22C",
        route: "22C",
        busType: "AC",
        fare: "₹40",
        departureTime: "09:40 AM",
        arrivalTime: "10:22 AM",
        status: "On Time",
        occupancy: 55,
        nextDeparture: "32 mins",
      },
      { busId: "22", route: "22C", busType: "Non-AC", fare: "₹20", departureTime: "10:00 AM", arrivalTime: "10:42 AM", status: "On Time", occupancy: 47, nextDeparture: "52 mins" },
      { busId: "22C/1", route: "22C", busType: "AC", fare: "₹44", departureTime: "10:25 AM", arrivalTime: "11:07 AM", status: "On Time", occupancy: 53, nextDeparture: "77 mins" },
      { busId: "S12D", route: "22C", busType: "Non-AC", fare: "₹18", departureTime: "10:45 AM", arrivalTime: "11:27 AM", status: "Delayed", occupancy: 39, nextDeparture: "97 mins" },
    ],
  },
]

export const popularDestinations = [
  "Wipro",
  "Howrah Station",
  "Salt Lake Sector V",
  "Park Street Museum",
  "Salt Lake City Centre",
  "Dum Dum Airport",
  "Biswa Bangla",
  "Sealdah Station",
  "Esplanade",
  "Salt Lake Stadium",
  "Science City",
  "Ballygunge",
  "Tollygunge",
  "Garia",
  "Rajarhat",
]

export const calculateRoute = (from, to) => {
  // Mock route calculation
  const route =
    routeOptions.find((r) => r.from === from && r.to === to) || routeOptions.find((r) => r.to === from && r.from === to)

  if (route) {
    // Ensure route-level fare reflects minimum available bus fare if present
    const busFares = (route.availableBuses || [])
      .map((b) => (typeof b.fare === "string" ? parseInt(b.fare.replace(/[^0-9]/g, ""), 10) : b.fare))
      .filter((n) => !isNaN(n))
    if (busFares.length > 0) {
      const minFare = Math.min(...busFares)
      return { ...route, fare: `₹${minFare}` }
    }
    return route
  }

  // Generate a mock route if not found
  const distance = Math.floor(Math.random() * 30) + 10
  const time = Math.floor(distance * 1.5) + Math.floor(Math.random() * 15)
  const baseFare = Math.floor(distance * 1.2) + 15

  return {
    id: `route-${Date.now()}`,
    from,
    to,
    distance: `${distance} km`,
    estimatedTime: `${time} mins`,
    fare: `₹${baseFare}`,
    routes: ["Multiple"],
    availableBuses: [
      {
        busId: "BUS007",
        route: "Express",
        busType: "AC",
        fare: `₹${baseFare + 5}`,
        departureTime: "09:25 AM",
        arrivalTime: `${Math.floor(9 + time / 60)}:${String((25 + (time % 60)) % 60).padStart(2, "0")} AM`,
        status: "On Time",
        occupancy: Math.floor(Math.random() * 40) + 30,
        nextDeparture: `${Math.floor(Math.random() * 20) + 5} mins`,
      },
      {
        busId: "BUS008",
        route: "Local",
        busType: "Non-AC",
        fare: `₹${baseFare}`,
        departureTime: "09:40 AM",
        arrivalTime: `${Math.floor(9 + (time + 10) / 60)}:${String((40 + ((time + 10) % 60)) % 60).padStart(2, "0")} AM`,
        status: "On Time",
        occupancy: Math.floor(Math.random() * 40) + 30,
        nextDeparture: `${Math.floor(Math.random() * 20) + 15} mins`,
      },
    ],
  }
}

// Find a single-transfer plan using busStops graph
import { busStops } from "./mockData"

export const findTransferPlan = (from, to) => {
  // Find candidate stops that best match from and to by name
  const fromStops = busStops.filter((s) => s.name.toLowerCase().includes((from || "").toLowerCase()))
  const toStops = busStops.filter((s) => s.name.toLowerCase().includes((to || "").toLowerCase()))
  if (fromStops.length === 0 || toStops.length === 0) return null

  // Collect routes reachable from 'from'
  const fromRoutes = new Set(fromStops.flatMap((s) => s.route.map((r) => r.toUpperCase())))
  const toRoutes = new Set(toStops.flatMap((s) => s.route.map((r) => r.toUpperCase())))

  // If any direct route overlaps
  const direct = [...fromRoutes].find((r) => toRoutes.has(r))
  if (direct) {
    return {
      type: "direct",
      steps: [{ via: null, take: direct, from, to }],
    }
  }

  // Find middle stop that has route from 'from' and route to 'to'
  for (const middle of busStops) {
    const middleRoutes = new Set(middle.route.map((r) => r.toUpperCase()))
    const firstLeg = [...fromRoutes].find((r) => middleRoutes.has(r))
    const secondLeg = [...toRoutes].find((r) => middleRoutes.has(r))
    if (firstLeg && secondLeg) {
      return {
        type: "transfer",
        middleStop: middle.name,
        steps: [
          { via: middle.name, take: firstLeg, from, to: middle.name },
          { via: middle.name, take: secondLeg, from: middle.name, to },
        ],
      }
    }
  }

  return null
}
