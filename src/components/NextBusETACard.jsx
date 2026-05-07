import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Bus, MapPin, Clock, RefreshCw, Navigation } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { locationService } from '../services/locationService'
import { useLanguage } from '../contexts/LanguageContext'

const NextBusETACard = ({ userLocation: propUserLocation }) => {
  const { t } = useLanguage()
  const [userLocation, setUserLocation] = useState(propUserLocation)
  const [nearestStop, setNearestStop] = useState(null)
  const [upcomingBuses, setUpcomingBuses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Get user location and find nearest stop
  const updateLocationAndBuses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      let location = userLocation
      
      // Use prop location if available, otherwise get current location
      if (!location || !location.lat || !location.lng) {
        location = await locationService.getCurrentLocation()
        setUserLocation(location)
      }
      
      const stopData = locationService.getUpcomingBusesForNearestStop(
        location.lat, 
        location.lng
      )
      
      if (stopData.error) {
        setError(stopData.error)
        return
      }
      
      setNearestStop(stopData.stop)
      setUpcomingBuses(stopData.buses)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error updating location:', err)
      setError('Unable to get your location')
    } finally {
      setIsLoading(false)
    }
  }

  // Update when prop location changes
  useEffect(() => {
    if (propUserLocation && propUserLocation.lat && propUserLocation.lng) {
      setUserLocation(propUserLocation)
      updateLocationAndBuses()
    }
  }, [propUserLocation])

  // Initial load
  useEffect(() => {
    updateLocationAndBuses()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateLocationAndBuses()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-800 border-green-200'
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-200'
      case 'Approaching': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bus className="h-5 w-5 text-primary" />
            Next Bus ETA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Finding your location...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bus className="h-5 w-5 text-primary" />
            Next Bus ETA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={updateLocationAndBuses}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bus className="h-5 w-5 text-primary" />
            Next Bus ETA
          </CardTitle>
          <Button 
            onClick={updateLocationAndBuses}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Nearest stop: {nearestStop?.name}</span>
          <Badge variant="outline" className="text-xs">
            {formatDistance(nearestStop?.distance || 0)}
          </Badge>
        </div>

        {/* Upcoming Buses */}
        <AnimatePresence mode="wait">
          {upcomingBuses.length > 0 ? (
            <div className="space-y-3">
              {upcomingBuses.slice(0, 3).map((bus, index) => (
                <motion.div
                  key={`${bus.busId}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Bus {bus.route}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(bus.status)}`}
                    >
                      {bus.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {bus.eta}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {bus.eta}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {upcomingBuses.length > 3 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    +{upcomingBuses.length - 3} more buses coming
                  </p>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Bus className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No buses scheduled</p>
              <p className="text-xs text-muted-foreground">Check back later</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Updated */}
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

export default NextBusETACard
