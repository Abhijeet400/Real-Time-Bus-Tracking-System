// Mock data for the bus tracking system - Kolkata, West Bengal
export const mockBuses = [
  {
    id: "215A",
    registration: "WB-01-AB-1234",
    route: "215A",
    driver: {
      name: "Rajesh Kumar",
      id: "D001",
      phone: "+91-9876543210",
      avatar: "/indian-male-driver.jpg",
    },
    conductor: {
      name: "Priya Sharma",
      id: "C001",
      phone: "+91-9876543211",
      avatar: "/indian-female-conductor.jpg",
    },
    coordinates: { lat: 22.5726, lng: 88.3639 },
    speed: 35,
    passengers: 42,
    capacity: 60,
    status: "On Time",
    eta: "5 mins",
    nextStop: "Salt Lake Sector V",
    startPoint: "Wipro",
    destination: "Howrah Station",
    lastUpdated: new Date(),
  },
  {
    id: "8B",
    registration: "WB-01-CD-5678",
    route: "8B",
    driver: {
      name: "Suresh Reddy",
      id: "D002",
      phone: "+91-9876543212",
      avatar: "/indian-male-driver-2.jpg",
    },
    conductor: {
      name: "Lakshmi Devi",
      id: "C002",
      phone: "+91-9876543213",
      avatar: "/indian-female-conductor-2.jpg",
    },
    coordinates: { lat: 22.5352, lng: 88.3245 },
    speed: 28,
    passengers: 55,
    capacity: 60,
    status: "Delayed",
    eta: "12 mins",
    nextStop: "Park Street Museum",
    startPoint: "Salt Lake City Centre",
    destination: "Dum Dum Airport",
    lastUpdated: new Date(),
  },
  {
    id: "22C",
    registration: "WB-01-EF-9012",
    route: "22C",
    driver: {
      name: "Mohammed Ali",
      id: "D003",
      phone: "+91-9876543214",
      avatar: "/indian-male-driver-3.jpg",
    },
    conductor: {
      name: "Sunita Rao",
      id: "C003",
      phone: "+91-9876543215",
      avatar: "/indian-female-conductor-3.jpg",
    },
    coordinates: { lat: 22.5827, lng: 88.3707 },
    speed: 42,
    passengers: 18,
    capacity: 45,
    status: "Approaching",
    eta: "2 mins",
    nextStop: "Esplanade",
    startPoint: "Biswa Bangla",
    destination: "Sealdah Station",
    lastUpdated: new Date(),
  },
]

export const busStops = [
  {
    name: "Wipro ",
    route: ["215A", "8B"],
    coordinates: { lat: 22.5726, lng: 88.3639 },
    upcomingBuses: [
      { busId: "215A", route: "215A", eta: "5 mins", status: "On Time" },
      { busId: "8B", route: "8B", eta: "12 mins", status: "Delayed" },
    ],
  },
  {
    name: "Salt Lake Sector V",
    route: ["215A", "22C"],
    coordinates: { lat: 22.5826, lng: 88.4139 },
    upcomingBuses: [
      { busId: "215A", route: "215A", eta: "2 mins", status: "Approaching" },
      { busId: "22C", route: "22C", eta: "8 mins", status: "On Time" },
    ],
  },
  {
    name: "Park Street Museum",
    route: ["8B", "22C"],
    coordinates: { lat: 22.5452, lng: 88.3645 },
    upcomingBuses: [
      { busId: "8B", route: "8B", eta: "3 mins", status: "On Time" },
      { busId: "22C", route: "22C", eta: "15 mins", status: "Delayed" },
    ],
  },
  {
    name: "Howrah Station",
    route: ["215A"],
    coordinates: { lat: 22.5798, lng: 88.3450 },
    upcomingBuses: [{ busId: "215A", route: "215A", eta: "25 mins", status: "On Time" }],
  },
  {
    name: "Dum Dum Airport",
    route: ["8B"],
    coordinates: { lat: 22.6419, lng: 88.4412 },
    upcomingBuses: [{ busId: "8B", route: "8B", eta: "18 mins", status: "On Time" }],
  },
  {
    name: "Esplanade",
    route: ["22C"],
    coordinates: { lat: 22.5579, lng: 88.3619 },
    upcomingBuses: [{ busId: "22C", route: "22C", eta: "7 mins", status: "Approaching" }],
  },
  {
    name: "Salt Lake City Centre",
    route: ["8B", "215A"],
    coordinates: { lat: 22.5926, lng: 88.4039 },
    upcomingBuses: [
      { busId: "8B", route: "8B", eta: "8 mins", status: "On Time" },
      { busId: "215A", route: "215A", eta: "15 mins", status: "On Time" },
    ],
  },
  {
    name: "Biswa Bangla",
    route: ["22C"],
    coordinates: { lat: 22.6127, lng: 88.4507 },
    upcomingBuses: [{ busId: "22C", route: "22C", eta: "12 mins", status: "On Time" }],
  },
  {
    name: "Sealdah Station",
    route: ["22C"],
    coordinates: { lat: 22.5679, lng: 88.3719 },
    upcomingBuses: [{ busId: "22C", route: "22C", eta: "20 mins", status: "On Time" }],
  },
]

export const generateLiveTrackingData = () => {
  return mockBuses.map((bus) => ({
    ...bus,
    // Simulate real-time position changes
    coordinates: {
      lat: bus.coordinates.lat + (Math.random() - 0.5) * 0.002,
      lng: bus.coordinates.lng + (Math.random() - 0.5) * 0.002,
    },
    // Simulate dynamic passenger count
    passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + Math.floor(Math.random() * 8) - 4)),
    // Simulate speed variations
    speed: Math.max(0, Math.min(60, bus.speed + Math.floor(Math.random() * 12) - 6)),
    // Update timestamp
    lastUpdated: new Date(),
  }))
}
