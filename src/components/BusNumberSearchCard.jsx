import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Bus, Search, MapPin, RefreshCw, Clock } from "lucide-react"
import { locationService } from "../services/locationService"

const toMinutes = (eta) => {
  const m = String(eta || "").match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 999
}

const BusNumberSearchCard = ({ userLocation: propUserLocation }) => {
  const [userLocation, setUserLocation] = useState(propUserLocation)
  const [nearestStop, setNearestStop] = useState(null)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [lastTwo, setLastTwo] = useState([])
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    let loc = userLocation
    if (!loc || !loc.lat || !loc.lng) {
      loc = await locationService.getCurrentLocation()
      setUserLocation(loc)
    }

    const data = locationService.getUpcomingBusesForNearestStop(loc.lat, loc.lng)
    setNearestStop(data.stop)
    const sorted = (data.buses || []).slice().sort((a, b) => toMinutes(a.eta) - toMinutes(b.eta))
    setLastTwo(sorted.slice(0, 2))
    setLastUpdate(new Date())
    setLoading(false)
  }

  // initial + prop change
  useEffect(() => { refresh() }, [])
  useEffect(() => { if (propUserLocation) { setUserLocation(propUserLocation); refresh() } }, [propUserLocation])

  // search by bus number (route like 215A)
  useEffect(() => {
    if (!nearestStop) { setResults([]); return }
    const q = search.trim().toUpperCase()
    if (q.length === 0) { setResults([]); return }
    const all = nearestStop.upcomingBuses || []
    const filtered = all.filter(b => String(b.route).toUpperCase().includes(q))
      .sort((a, b) => toMinutes(a.eta) - toMinutes(b.eta))
    setResults(filtered)
  }, [search, nearestStop])

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bus className="h-5 w-5 text-primary" />
            Search by Bus Number
          </CardTitle>
          <Button onClick={refresh} size="sm" variant="ghost" className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nearest stop */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Nearest stop: {nearestStop?.name || "Locating..."}</span>
          {nearestStop && (
            <Badge variant="outline" className="text-xs">
              {nearestStop.distance ? `${nearestStop.distance.toFixed(1)} km` : ""}
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter bus number (e.g., 215A, 8B, ST6)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Results */}
        {search.trim().length > 0 && (
          <div className="space-y-2">
            {results.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upcoming buses matching "{search}"</p>
            ) : (
              results.slice(0, 5).map((b, i) => (
                <div key={`${b.busId}-${i}`} className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{b.route}</span>
                    <Badge variant="outline" className="text-xs">{b.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>ETA: {b.eta}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Last two arriving */}
        <div className="pt-1">
          <p className="text-xs font-medium text-muted-foreground mb-2">Next arrivals at this stop</p>
          <div className="space-y-2">
            {(lastTwo || []).map((b, i) => (
              <div key={`${b.busId}-last-${i}`} className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{b.route}</span>
                  <Badge variant="outline" className="text-xs">{b.status}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>ETA: {b.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BusNumberSearchCard


