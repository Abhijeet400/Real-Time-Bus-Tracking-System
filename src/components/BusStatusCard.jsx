import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Bus, MapPin, Users, Gauge, Clock } from "lucide-react"

const BusStatusCard = ({ bus }) => {
  const getOccupancyColor = (passengers, capacity) => {
    const percentage = (passengers / capacity) * 100
    if (percentage < 60) return "bg-success"
    if (percentage < 80) return "bg-warning"
    return "bg-destructive"
  }

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

  const occupancyPercentage = (bus.passengers / bus.capacity) * 100

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Bus className="w-5 h-5 mr-2 text-primary" />
            {bus.registration}
          </CardTitle>
          <Badge variant={getStatusVariant(bus.status)}>{bus.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{bus.route}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Next Stop:</span>
            </div>
            <p className="text-sm text-foreground ml-6">{bus.nextStop}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium">ETA:</span>
            </div>
            <p className="text-sm text-foreground ml-6">{bus.eta}</p>
          </div>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Gauge className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>Speed:</span>
          </div>
          <span className="text-sm font-medium">{bus.speed} km/h</span>
        </div>

        {/* Passenger Occupancy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Occupancy:</span>
            </div>
            <span className="font-medium">
              {bus.passengers}/{bus.capacity}
            </span>
          </div>
          <div className="relative">
            <Progress value={occupancyPercentage} />
            <div
              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getOccupancyColor(bus.passengers, bus.capacity)}`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{Math.round(occupancyPercentage)}% capacity</span>
            <span
              className={`font-medium ${
                occupancyPercentage < 60
                  ? "text-success"
                  : occupancyPercentage < 80
                    ? "text-warning"
                    : "text-destructive"
              }`}
            >
              {occupancyPercentage < 60 ? "Low" : occupancyPercentage < 80 ? "Medium" : "High"}
            </span>
          </div>
        </div>

        {/* Route Info */}
        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">From:</span> {bus.startPoint}
            </div>
            <div>
              <span className="font-medium">To:</span> {bus.destination}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">Updated:</span> {bus.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BusStatusCard
