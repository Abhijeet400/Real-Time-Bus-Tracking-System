// Location service for getting user location and finding nearest bus stops
import { busStops } from '../data/mockData'

export class LocationService {
  constructor() {
    this.userLocation = null
    this.watchId = null
  }

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          }
          resolve(this.userLocation)
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to default location (Salt Lake Sector V)
          this.userLocation = {
            lat: 22.5726,
            lng: 88.3639,
            accuracy: 0,
            timestamp: new Date()
          }
          resolve(this.userLocation)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Find the nearest bus stop to user's location
  findNearestBusStop(userLat, userLng) {
    let nearestStop = null
    let minDistance = Infinity

    busStops.forEach(stop => {
      const distance = this.calculateDistance(
        userLat, userLng,
        stop.coordinates.lat, stop.coordinates.lng
      )
      
      if (distance < minDistance) {
        minDistance = distance
        nearestStop = {
          ...stop,
          distance: distance
        }
      }
    })

    return nearestStop
  }

  // Get upcoming buses for the nearest stop
  getUpcomingBusesForNearestStop(userLat, userLng) {
    const nearestStop = this.findNearestBusStop(userLat, userLng)
    
    if (!nearestStop) {
      return {
        stop: null,
        buses: [],
        error: 'No bus stops found'
      }
    }

    // Sort buses by ETA (convert to minutes for sorting)
    const buses = nearestStop.upcomingBuses.map(bus => ({
      ...bus,
      etaMinutes: this.parseETAToMinutes(bus.eta)
    })).sort((a, b) => a.etaMinutes - b.etaMinutes)

    return {
      stop: nearestStop,
      buses: buses,
      error: null
    }
  }

  // Parse ETA string to minutes for sorting
  parseETAToMinutes(eta) {
    const match = eta.match(/(\d+)\s*mins?/)
    return match ? parseInt(match[1]) : 999
  }

  // Watch user's location for real-time updates
  watchLocation(callback) {
    if (!navigator.geolocation) {
      callback(null, new Error('Geolocation not supported'))
      return
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        }
        callback(this.userLocation, null)
      },
      (error) => {
        console.error('Location watch error:', error)
        callback(null, error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000 // 30 seconds
      }
    )
  }

  // Stop watching location
  stopWatchingLocation() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  // Get formatted location string
  getLocationString(lat, lng) {
    // This would typically use reverse geocoding
    // For now, return a simple description based on coordinates
    if (lat >= 22.55 && lat <= 22.6 && lng >= 88.3 && lng <= 88.4) {
      return 'Salt Lake Area'
    } else if (lat >= 22.5 && lat <= 22.6 && lng >= 88.3 && lng <= 88.4) {
      return 'Central Kolkata'
    } else {
      return 'Kolkata'
    }
  }
}

// Export singleton instance
export const locationService = new LocationService()
