"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import ScheduleTable from "../components/ScheduleTable"
import { busSchedules, getTodaysSchedule } from "../data/scheduleData"
import { Calendar, Clock, Bus, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

const Schedules = () => {
  const [selectedRoute, setSelectedRoute] = useState(busSchedules[0]?.route || "")
  const todaysSchedule = getTodaysSchedule()
  const { t } = useLanguage()

  const selectedRouteData = busSchedules.find((schedule) => schedule.route === selectedRoute)

  const getTotalStats = () => {
    const allTrips = busSchedules.flatMap((route) => route.buses.flatMap((bus) => bus.schedule))
    return {
      total: allTrips.length,
      completed: allTrips.filter((trip) => trip.status === "Completed").length,
      inProgress: allTrips.filter((trip) => trip.status === "In Progress").length,
      delayed: allTrips.filter((trip) => trip.status === "Delayed").length,
      scheduled: allTrips.filter((trip) => trip.status === "Scheduled").length,
    }
  }

  const stats = getTotalStats()

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" }
    })
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
    >
      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[{
          title: t('totalTrips'),
          icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
          value: stats.total,
          description: t('todaysSchedule'),
          color: "text-primary"
        },{
          title: t('completed'),
          icon: <CheckCircle className="h-4 w-4 text-success" />,
          value: stats.completed,
          description: `${Math.round((stats.completed / stats.total) * 100)}% ${t('done')}`,
          color: "text-success"
        },{
          title: t('inProgress'),
          icon: <Clock className="h-4 w-4 text-warning" />,
          value: stats.inProgress,
          description: t('currentlyRunning'),
          color: "text-warning"
        },{
          title: t('delayed'),
          icon: <AlertCircle className="h-4 w-4 text-destructive" />,
          value: stats.delayed,
          description: t('needAttention'),
          color: "text-destructive"
        },{
          title: t('scheduled'),
          icon: <Bus className="h-4 w-4 text-muted-foreground" />,
          value: stats.scheduled,
          description: t('upcomingTrips'),
          color: "text-foreground"
        }].map((stat, i) => (
          <motion.div key={i} custom={i} variants={cardVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Route Selection */}
      <motion.div variants={cardVariants} custom={6}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bus className="w-5 h-5 mr-2 text-primary" />
              {t('scheduleManagement')}
            </CardTitle>
            <div className="w-full max-w-xs">
              <Select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
                {busSchedules.map((schedule) => (
                  <option key={schedule.route} value={schedule.route}>
                    {schedule.route} - {schedule.routeName}
                  </option>
                ))}
              </Select>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Schedule Details */}
      {selectedRouteData && (
        <motion.div variants={cardVariants} custom={7}>
          <ScheduleTable routeData={selectedRouteData} />
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={cardVariants} custom={8}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('scheduleManagementDescription')}
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span>• {t('realTimeStatusUpdates')}</span>
                <span>• {t('automatedDelayNotifications')}</span>
                <span>• {t('performanceAnalytics')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Schedules
