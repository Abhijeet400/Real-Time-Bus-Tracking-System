export const busSchedules = [
  {
    route: "215A",
    routeName: "Wipro - Howrah Station",
    buses: [
      {
        busId: "BUS001",
        driver: "Rajesh Kumar",
        schedule: [
          { departure: "06:00", arrival: "06:35", status: "Completed" },
          { departure: "07:30", arrival: "08:05", status: "Completed" },
          { departure: "09:00", arrival: "09:35", status: "In Progress" },
          { departure: "10:30", arrival: "11:05", status: "Scheduled" },
          { departure: "12:00", arrival: "12:35", status: "Scheduled" },
          { departure: "13:30", arrival: "14:05", status: "Scheduled" },
          { departure: "15:00", arrival: "15:35", status: "Scheduled" },
          { departure: "16:30", arrival: "17:05", status: "Scheduled" },
          { departure: "18:00", arrival: "18:35", status: "Scheduled" },
          { departure: "19:30", arrival: "20:05", status: "Scheduled" },
        ],
      },
      {
        busId: "BUS004",
        driver: "Arun Patel",
        schedule: [
          { departure: "06:30", arrival: "07:05", status: "Completed" },
          { departure: "08:00", arrival: "08:35", status: "Completed" },
          { departure: "09:30", arrival: "10:05", status: "Scheduled" },
          { departure: "11:00", arrival: "11:35", status: "Scheduled" },
          { departure: "12:30", arrival: "13:05", status: "Scheduled" },
          { departure: "14:00", arrival: "14:35", status: "Scheduled" },
          { departure: "15:30", arrival: "16:05", status: "Scheduled" },
          { departure: "17:00", arrival: "17:35", status: "Scheduled" },
          { departure: "18:30", arrival: "19:05", status: "Scheduled" },
          { departure: "20:00", arrival: "20:35", status: "Scheduled" },
        ],
      },
    ],
  },
  {
    route: "8B",
    routeName: "Salt Lake City Centre - Dum Dum Airport",
    buses: [
      {
        busId: "BUS002",
        driver: "Suresh Reddy",
        schedule: [
          { departure: "06:15", arrival: "06:43", status: "Completed" },
          { departure: "07:45", arrival: "08:13", status: "Completed" },
          { departure: "09:15", arrival: "09:43", status: "Delayed" },
          { departure: "10:45", arrival: "11:13", status: "Scheduled" },
          { departure: "12:15", arrival: "12:43", status: "Scheduled" },
          { departure: "13:45", arrival: "14:13", status: "Scheduled" },
          { departure: "15:15", arrival: "15:43", status: "Scheduled" },
          { departure: "16:45", arrival: "17:13", status: "Scheduled" },
          { departure: "18:15", arrival: "18:43", status: "Scheduled" },
          { departure: "19:45", arrival: "20:13", status: "Scheduled" },
        ],
      },
    ],
  },
  {
    route: "22C",
    routeName: "Biswa Bangla - Sealdah Station",
    buses: [
      {
        busId: "BUS003",
        driver: "Mohammed Ali",
        schedule: [
          { departure: "06:10", arrival: "06:52", status: "Completed" },
          { departure: "08:00", arrival: "08:42", status: "Completed" },
          { departure: "09:50", arrival: "10:32", status: "In Progress" },
          { departure: "11:40", arrival: "12:22", status: "Scheduled" },
          { departure: "13:30", arrival: "14:12", status: "Scheduled" },
          { departure: "15:20", arrival: "16:02", status: "Scheduled" },
          { departure: "17:10", arrival: "17:52", status: "Scheduled" },
          { departure: "19:00", arrival: "19:42", status: "Scheduled" },
        ],
      },
    ],
  },
]

export const getScheduleByRoute = (routeId) => {
  return busSchedules.find((schedule) => schedule.route === routeId)
}

export const getTodaysSchedule = () => {
  const today = new Date().toISOString().split("T")[0]
  return busSchedules.map((route) => ({
    ...route,
    buses: route.buses.map((bus) => ({
      ...bus,
      todayTrips: bus.schedule.length,
      completedTrips: bus.schedule.filter((trip) => trip.status === "Completed").length,
      upcomingTrips: bus.schedule.filter((trip) => trip.status === "Scheduled").length,
    })),
  }))
}
