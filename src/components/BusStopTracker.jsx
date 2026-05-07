"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select } from "./ui/select"
import { Badge } from "./ui/badge"
import { MapPin, Clock, Bus } from "lucide-react"

const BusStopTracker = ({ busStops, selectedStop, setSelectedStop, selectedStopData }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Bus Stop Tracker
        </CardTitle>
        <div className="w-full max-w-xs">
          <Select value={selectedStop} onChange={(e) => setSelectedStop(e.target.value)}>
            {busStops.map((stop) => (
              <option key={stop.name} value={stop.name}>
                {stop.name}
              </option>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedStopData && (
          <div className="space-y-4">
            {/* Stop Info */}
            <div className="pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">{selectedStopData.name}</h4>
              <p className="text-sm text-muted-foreground">Routes: {selectedStopData.route.join(", ")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Lat: {selectedStopData.coordinates.lat.toFixed(4)}, Lng: {selectedStopData.coordinates.lng.toFixed(4)}
              </p>
            </div>

            {/* Upcoming Buses */}
            <div>
              <h5 className="font-medium text-sm text-muted-foreground mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Upcoming Buses
              </h5>
              <div className="space-y-3">
                {selectedStopData.upcomingBuses.map((bus, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bus className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{bus.busId}</p>
                        <p className="text-xs text-muted-foreground">{bus.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{bus.eta}</span>
                      <Badge variant={getStatusVariant(bus.status)} className="text-xs">
                        {bus.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{selectedStopData.upcomingBuses.length}</p>
                  <p className="text-xs text-muted-foreground">Buses Coming</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    {selectedStopData.upcomingBuses.filter((bus) => bus.status === "On Time").length}
                  </p>
                  <p className="text-xs text-muted-foreground">On Time</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BusStopTracker
