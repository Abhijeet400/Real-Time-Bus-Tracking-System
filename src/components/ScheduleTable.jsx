"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Bus, User, Clock } from "lucide-react"

const ScheduleTable = ({ routeData }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success"
      case "In Progress":
        return "warning"
      case "Delayed":
        return "destructive"
      case "Scheduled":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bus className="w-5 h-5 mr-2 text-primary" />
          {routeData.routeName} ({routeData.route})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {routeData.buses.map((bus) => (
            <div key={bus.busId} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{bus.busId}</span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    {bus.driver}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {bus.schedule.filter((trip) => trip.status === "Completed").length} / {bus.schedule.length} trips
                  completed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bus.schedule.map((trip, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{trip.departure}</span>
                        <span className="text-muted-foreground">→</span>
                        <span>{trip.arrival}</span>
                      </div>
                      <Badge variant={getStatusVariant(trip.status)} className="text-xs">
                        {trip.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleTable
