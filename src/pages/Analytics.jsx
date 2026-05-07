"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import SimpleChart from "../components/SimpleChart"
import { performanceMetrics, dailyStats, routePerformance, hourlyPassengerData } from "../data/analyticsData"
import { TrendingUp, TrendingDown, BarChart3, Users, Clock, Fuel, Wrench, Star } from "lucide-react"

const Analytics = () => {
  const chartData = dailyStats.map((stat) => ({
    label: new Date(stat.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: stat.passengers,
  }))

  const onTimeData = dailyStats.map((stat) => ({
    label: new Date(stat.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Math.round((stat.onTime / stat.trips) * 100),
  }))

  const hourlyData = hourlyPassengerData.slice(6, 22).map((data) => ({
    label: data.hour,
    value: data.passengers,
  }))

  const getEfficiencyColor = (efficiency) => {
    switch (efficiency) {
      case "High":
        return "success"
      case "Medium":
        return "warning"
      case "Low":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{performanceMetrics.onTimePerformance}%</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.3% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Delay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{performanceMetrics.averageDelay} min</div>
            <div className="flex items-center text-xs text-success">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.8 min from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{performanceMetrics.totalTrips}</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +156 from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{performanceMetrics.passengerSatisfaction}/5</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart title="Daily Passenger Count" data={chartData} color="bg-primary" />
        <SimpleChart title="On-Time Performance %" data={onTimeData} color="bg-success" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SimpleChart title="Hourly Passenger Distribution" data={hourlyData} color="bg-accent" />
      </div>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Route Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routePerformance.map((route) => (
              <div key={route.route} className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="font-semibold">{route.route}</p>
                    <p className="text-sm text-muted-foreground">Route</p>
                  </div>
                  <div>
                    <p className="font-semibold text-success">{route.onTimeRate}%</p>
                    <p className="text-sm text-muted-foreground">On-Time</p>
                  </div>
                  <div>
                    <p className="font-semibold">{route.avgPassengers}</p>
                    <p className="text-sm text-muted-foreground">Avg Passengers</p>
                  </div>
                  <div>
                    <p className="font-semibold">{route.totalTrips}</p>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{route.revenue}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <Badge variant={getEfficiencyColor(route.efficiency)}>{route.efficiency}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fuel className="w-5 h-5 mr-2 text-primary" />
              Operational Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Fuel className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Fuel Efficiency</span>
              </div>
              <span className="font-semibold">{performanceMetrics.fuelEfficiency} km/l</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Maintenance Score</span>
              </div>
              <span className="font-semibold text-success">{performanceMetrics.maintenanceScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Fleet Utilization</span>
              </div>
              <span className="font-semibold">94.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Distance Covered</span>
                <span className="font-medium">2,847 km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Passengers Served</span>
                <span className="font-medium">13,550</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Revenue Generated</span>
                <span className="font-medium text-primary">₹1,41,960</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Trip Duration</span>
                <span className="font-medium">42 mins</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
