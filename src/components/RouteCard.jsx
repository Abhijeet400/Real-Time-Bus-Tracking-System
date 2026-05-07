"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, Clock, IndianRupee, Bus, ArrowRight } from "lucide-react"

const RouteCard = ({ route, onSelectRoute }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "On Time":
        return "success"
      case "Delayed":
        return "destructive"
      case "Approaching":
        return "warning"
      default:
        return "default"
    }
  }

  const getOccupancyColor = (occupancy) => {
    if (occupancy < 60) return "bg-success"
    if (occupancy < 80) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            {route.from} <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" /> {route.to}
          </CardTitle>
          <Badge variant="outline">{route.routes.join(", ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Info */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
            </div>
            <p className="text-sm font-medium">{route.distance}</p>
            <p className="text-xs text-muted-foreground">Distance</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
            </div>
            <p className="text-sm font-medium">{route.estimatedTime}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center text-muted-foreground">
              <IndianRupee className="w-4 h-4 mr-1" />
            </div>
            <p className="text-sm font-medium">{route.fare}</p>
            <p className="text-xs text-muted-foreground">Fare (from)</p>
          </div>
        </div>

        {/* Available Buses */}
        <div className="space-y-3">
          <h5 className="font-medium text-sm text-muted-foreground flex items-center">
            <Bus className="w-4 h-4 mr-2" />
            Available Buses
          </h5>
          {route.availableBuses.map((bus, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{bus.busId}</span>
                  <Badge variant={getStatusVariant(bus.status)} className="text-xs">
                    {bus.status}
                  </Badge>
                </div>
                <span className="text-sm font-medium text-primary">Departs in {bus.nextDeparture}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Type:</span> {bus.busType || "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Fare:</span> {bus.fare || route.fare}
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Route:</span> {bus.route}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Departure:</span> {bus.departureTime}
                </div>
                <div>
                  <span className="text-muted-foreground">Arrival:</span> {bus.arrivalTime}
                </div>
              </div>

              {/* Occupancy removed as requested */}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button onClick={() => onSelectRoute(route)} className="w-full" variant="outline">
          Select This Route
        </Button>
      </CardContent>
    </Card>
  )
}

export default RouteCard
