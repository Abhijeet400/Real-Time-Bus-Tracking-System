"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MessageCircle, X, Send, MapPin, Route, Calendar, Info, MessageSquare, Mic, Volume2, VolumeX } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { useNavigate, useLocation } from "react-router-dom"
import { useLanguage } from "../../contexts/LanguageContext"
import { Select } from "../ui/select"
import { languageOptions } from "../../data/languages"
import { AnimatePresence, motion } from "framer-motion"
import { mockBuses, busStops } from "../../data/mockData"
import { routeOptions, calculateRoute } from "../../data/routeData"
import { nlp } from "../../utils/nlp"

// Lightweight text helpers for fuzzy/tolerant matching
const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/(.)\1{2,}/g, "$1$1")
    .replace(/\s+/g, " ")
    .trim()

const containsAny = (text, terms) => terms.some((t) => text.includes(t))
const singleWord = (text) => text.split(" ").length === 1

const GREETINGS = ["hi", "hii", "hello", "hey", "hlo", "hola", "namaste", "namaskar", "yo"]
const ROUTE_TERMS = ["route", "rout", "root", "direction", "plan"]
const ETA_TERMS = ["eta", "arrive", "reach", "time"]
const FARE_TERMS = ["fare", "price", "ticket", "cost"]
const STOP_TERMS = ["stop", "station", "stand", "nearest", "near me"]
const LIVE_TERMS = ["live", "track", "tracking", "location"]
const SCHEDULE_TERMS = ["schedule", "timing", "timetable"]
const ALERT_TERMS = ["alert", "disruption", "delay"]
const HELP_TERMS = ["help", "support"]

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", text: "" },
  ])
  const [input, setInput] = useState("")
  const [pendingFlow, setPendingFlow] = useState(null)
  const [voiceIn, setVoiceIn] = useState(false)
  const [voiceOut, setVoiceOut] = useState(false)
  const [ttsVoices, setTtsVoices] = useState([])
  const [showHelpfulness, setShowHelpfulness] = useState(false)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { t, currentLanguage, changeLanguage } = useLanguage()
  const recognitionRef = useRef(null)

  // Load TTS voices
  useEffect(() => {
    if (!window.speechSynthesis) return
    const load = () => setTtsVoices(window.speechSynthesis.getVoices())
    load()
    try { window.speechSynthesis.onvoiceschanged = load } catch {}
    return () => {
      try { window.speechSynthesis.onvoiceschanged = null } catch {}
    }
  }, [])

  // Initialize greeting when language changes or widget mounts
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "bot") {
        return [{ role: "bot", text: t('chatbot_greeting') }]
      }
      return prev
    })
  }, [t])

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Speak bot messages if voiceOut enabled
  useEffect(() => {
    if (!voiceOut) return
    const last = messages[messages.length - 1]
    if (last && last.role === "bot" && window.speechSynthesis) {
      const utter = new SpeechSynthesisUtterance(last.text)
      const langMap = {
        english: "en-IN",
        hindi: "hi-IN",
        tamil: "ta-IN",
        punjabi: "pa-IN",
      }
      // Punjabi fallback → Hindi if not found
      const desiredLang = langMap[currentLanguage] || langMap.english
      const voices = ttsVoices.length ? ttsVoices : window.speechSynthesis.getVoices()
      let pick = voices.find(v => v.lang?.toLowerCase() === desiredLang.toLowerCase())
      if (!pick && currentLanguage === 'punjabi') {
        pick = voices.find(v => v.lang?.toLowerCase() === 'hi-in')
        utter.lang = 'hi-IN'
      } else {
        utter.lang = desiredLang
      }
      if (pick) utter.voice = pick
      try { window.speechSynthesis.cancel() } catch {}
      window.speechSynthesis.speak(utter)
    }
  }, [messages, voiceOut, currentLanguage, ttsVoices])

  // Cache last few queries for personalization and offline
  useEffect(() => {
    try { localStorage.setItem("chat_recent_messages", JSON.stringify(messages.slice(-20))) } catch {}
  }, [messages])

  const suggestions = useMemo(() => {
    let recents = []
    try {
      const raw = localStorage.getItem("chat_recent_routes")
      if (raw) recents = JSON.parse(raw)
    } catch {}

    const base = [
      { label: t('chatbot_suggest_planRoute'), icon: Route, value: "route" },
      { label: t('chatbot_suggest_help'), icon: Info, value: "help" },
      { label: t('chatbot_suggest_feedback'), icon: MessageSquare, value: "feedback" },
      { label: t('chatbot_suggest_support'), icon: Info, value: "support" },
    ]

    const path = location.pathname
    let prioritized = base
    if (path.includes("live-tracking")) prioritized = [base[1], base[0], base[2], base[3]]
    else if (path.includes("schedules")) prioritized = [base[0], base[1], base[2], base[3]]
    else if (path.includes("route-planner")) prioritized = [base[1], base[0], base[2], base[3]]

    const recentButtons = (recents || []).slice(0, 1).map((r) => ({ label: `${r.from} → ${r.to}`, icon: Route, value: `route:${r.from}:${r.to}` }))
    return [...recentButtons, ...prioritized]
  }, [location.pathname, t])

  const addBot = (text, showHelpfulnessButtons = true) => {
    setMessages((prev) => [...prev, { role: "bot", text, showHelpfulness: showHelpfulnessButtons }])
    if (showHelpfulnessButtons) {
      setShowHelpfulness(true)
    }
  }

  const handleSend = (text) => {
    const content = (text ?? input).trim()
    if (!content) return

    if (pendingFlow === 'feedback') {
      setMessages((prev) => [...prev, { role: "user", text: content }])
      addBot(t('chatbot_feedback_thanks'))
      setPendingFlow(null)
      setInput("")
      return
    }
    if (pendingFlow === 'support') {
      setMessages((prev) => [...prev, { role: "user", text: content }])
      addBot(t('chatbot_support_ack'))
      setPendingFlow(null)
      setInput("")
      return
    }

    setMessages((prev) => [...prev, { role: "user", text: content }])
    setInput("")
    respond(content)
  }

  const quickAction = (value) => {
    if (value.startsWith("route:")) {
      const [, from, to] = value.split(":")
      const res = calculateRoute(from, to)
      addBot(`${from} → ${to}\nTime: ${res.estimatedTime} • Distance: ${res.distance} • Fare: ${res.fare}`)
      try {
        const raw = localStorage.getItem("chat_recent_routes")
        const list = raw ? JSON.parse(raw) : []
        const updated = [{ from, to }, ...list.filter((r) => !(r.from === from && r.to === to))].slice(0, 5)
        localStorage.setItem("chat_recent_routes", JSON.stringify(updated))
      } catch {}
      return
    }
    switch (value) {
      case "route":
        addBot(t('chatbot_opening_route'))
        navigate("/route-planner")
        break
      case "schedules":
        addBot(t('chatbot_showing_schedules'))
        navigate("/schedules")
        break
      case "tracking":
        addBot(t('chatbot_opening_live'))
        navigate("/live-tracking")
        break
      case "help":
        addBot(t('chatbot_help_text'))
        break
      case "feedback":
        setPendingFlow('feedback')
        addBot(t('chatbot_feedback_prompt'))
        break
      case "support":
        setPendingFlow('support')
        addBot(t('chatbot_support_prompt'))
        break
      default:
        break
    }
  }

  const parseStopFromText = (text) => {
    const allStops = busStops.map((s) => s.name.toLowerCase())
    return allStops.find((s) => text.includes(s))
  }

  const parseBusId = (text) => {
    const match = text.match(/bus\s*(no\.?|number)?\s*(\d+)/i)
    if (match) {
      const idNum = match[2]
      const bus = mockBuses.find((b) => b.id.replace(/\D/g, "") === idNum)
      return bus?.id
    }
    const direct = mockBuses.find((b) => text.includes(b.id.toLowerCase()))
    return direct?.id
  }

  const respond = (raw) => {
    // Use NLP processing for better understanding
    const processed = nlp.processInput(raw)
    const text = processed.normalizedText

    // Handle greetings with NLP
    if (processed.intent === 'greeting') {
      addBot("Hi! Ask me about routes, ETA, fares, or say 'voice on'.")
      return
    }

    if (text === "voice on") { setVoiceOut(true); addBot(t('chatbot_voice_enabled') || "Voice output enabled."); return }
    if (text === "voice off") { setVoiceOut(false); addBot(t('chatbot_voice_disabled') || "Voice output disabled."); return }

    if (processed.intent === 'help' || containsAny(text, HELP_TERMS)) { quickAction('support'); return }

    if (singleWord(text)) {
      if (containsAny(text, ROUTE_TERMS)) { addBot(t('chatbot_hint_route')); return }
      if (containsAny(text, ETA_TERMS)) { addBot(t('chatbot_hint_eta')); return }
      if (containsAny(text, FARE_TERMS)) { addBot(t('chatbot_hint_fare')); return }
      if (containsAny(text, STOP_TERMS)) { addBot(t('chatbot_hint_stop')); return }
      if (containsAny(text, LIVE_TERMS)) { quickAction('tracking'); return }
      if (containsAny(text, SCHEDULE_TERMS)) { quickAction('schedules'); return }
      if (containsAny(text, ALERT_TERMS)) { addBot(t('chatbot_no_disruptions')); return }
    }

    if (text.includes("where is my bus") || text.includes("where bus")) {
      const busId = parseBusId(text) || mockBuses[0]?.id
      const bus = mockBuses.find((b) => b.id === busId)
      if (bus) {
        addBot(`${bus.id} (${bus.route}) is near ${bus.nextStop}, speed ${bus.speed} km/h. ETA ${bus.eta}.`)
        return
      }
    }

    if (processed.intent === 'eta' || containsAny(text, ETA_TERMS) || text.includes("next")) {
      const stop = parseStopFromText(text)
      if (stop) {
        const stopObj = busStops.find((s) => s.name.toLowerCase() === stop)
        if (stopObj && stopObj.upcomingBuses?.length) {
          const lines = stopObj.upcomingBuses.map((u) => `${u.route}: ${u.eta} (${u.status})`).join("\n")
          addBot(`Upcoming at ${stopObj.name}:\n${lines}`)
          return
        }
      }
    }

    if (text.includes("next bus") || text.includes("availability")) {
      const routeMatch = text.match(/(\d+[a-z]?)/i)
      const routeCode = routeMatch?.[1]?.toUpperCase()
      if (routeCode) {
        const foundStop = busStops.find((s) => s.upcomingBuses?.some((u) => u.route.toUpperCase() === routeCode))
        const next = foundStop?.upcomingBuses?.find((u) => u.route.toUpperCase() === routeCode)
        if (next) { addBot(`Next on ${routeCode}: ${next.eta} at ${foundStop.name} (${next.status}).`); return }
      }
    }

    // Handle route requests with NLP
    if (processed.intent === 'route' || containsAny(text, ROUTE_TERMS) || text.includes("direction")) {
      let routeInfo = processed.route
      
      // Fallback to old parsing if NLP didn't extract route
      if (!routeInfo) {
        const parts = text.split(" to ")
        if (parts.length === 2) {
          routeInfo = {
            from: parts[0].replace(/.*from\s*/i, "").trim(),
            to: parts[1].trim()
          }
        }
      }
      
      if (routeInfo && routeInfo.from && routeInfo.to) {
        const res = calculateRoute(routeInfo.from, routeInfo.to)
        addBot(`${routeInfo.from} → ${routeInfo.to}\nBest route: ${res.routes.join(", ")} • Time: ${res.estimatedTime} • Distance: ${res.distance} • Fare: ${res.fare}`)
        try {
          const raw = localStorage.getItem("chat_recent_routes")
          const list = raw ? JSON.parse(raw) : []
          const updated = [{ from: routeInfo.from, to: routeInfo.to }, ...list.filter((r) => !(r.from === routeInfo.from && r.to === routeInfo.to))].slice(0, 5)
          localStorage.setItem("chat_recent_routes", JSON.stringify(updated))
        } catch {}
        return
      }
    }

    if (processed.intent === 'fare' || containsAny(text, FARE_TERMS)) {
      const routeMatch = text.match(/(\d+[a-z]?)/i)
      if (routeMatch) {
        const routeCode = routeMatch[1].toUpperCase()
        const r = routeOptions.find((opt) => opt.routes?.some((rc) => rc.toUpperCase() === routeCode))
        if (r) { addBot(`Typical fare on ${routeCode}: ${r.fare}. AC/Non-AC may vary.`); return }
      }
      addBot("Fares vary by distance and bus type. AC costs more than Non-AC. Typical city fares: ₹15–₹45.")
      return
    }

    if (processed.intent === 'stop' || containsAny(text, STOP_TERMS)) {
      const first = busStops[0]
      addBot(`${t('chatbot_nearest_prefix')} ${first.name}. Next arrivals: ${first.upcomingBuses.map(u => `${u.route} in ${u.eta}`).join(", ")}.`)
      return
    }

    if (processed.intent === 'alert' || containsAny(text, ALERT_TERMS)) {
      addBot(t('chatbot_no_disruptions'))
      return
    }

    if (processed.intent === 'live' || containsAny(text, LIVE_TERMS)) { quickAction("tracking"); return }
    if (processed.intent === 'schedule' || containsAny(text, SCHEDULE_TERMS)) { quickAction("schedules"); return }

    addBot(t('chatbot_fallback_generic'))
  }

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addBot(t('chatbot_voice_not_supported') || "Voice input not supported in this browser.")
      return
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recog = new Recognition()
    recog.lang = "en-IN"
    recog.interimResults = false
    recog.maxAlternatives = 1
    recog.continuous = true
    recog.onresult = (e) => {
      const last = e.results?.[e.results.length - 1]
      const phrase = last?.[0]?.transcript
      if (phrase) handleSend(phrase)
    }
    recog.onerror = () => {
      setVoiceIn(false)
    }
    recog.onend = () => {
      if (voiceIn) {
        try { recog.start() } catch {}
      }
    }
    recognitionRef.current = recog
    setVoiceIn(true)
    try { recog.start() } catch {}
  }

  const stopVoiceInput = () => {
    setVoiceIn(false)
    try { recognitionRef.current?.stop() } catch {}
  }

  const handleHelpfulness = (isHelpful) => {
    setShowHelpfulness(false)
    // Store feedback for analytics
    try {
      const feedback = JSON.parse(localStorage.getItem("chatbot_feedback") || "[]")
      feedback.push({
        timestamp: new Date().toISOString(),
        helpful: isHelpful,
        message: messages[messages.length - 1]?.text
      })
      localStorage.setItem("chatbot_feedback", JSON.stringify(feedback.slice(-50))) // Keep last 50
    } catch {}
    
    addBot(isHelpful ? "Thank you! 😊" : "I'll try to improve! 💪", false)
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[2000]">
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="chat-card"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ transformOrigin: "bottom right" }}
          >
            <Card className="w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-h-[90vh] h-[75vh] flex flex-col shadow-2xl border-2 border-border">
              <CardHeader className="py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t('chatbot_title')}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant={voiceIn ? "glow" : "ghost"} onClick={() => (voiceIn ? stopVoiceInput() : startVoiceInput())} aria-label="Toggle voice input">
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant={voiceOut ? "glow" : "ghost"} onClick={() => setVoiceOut((v) => !v)} aria-label="Toggle voice output">
                      {voiceOut ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    <Select
                      value={currentLanguage}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="h-8 px-2 py-1 text-xs w-[120px]"
                      aria-label="Select language"
                    >
                      {languageOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label={t('chatbot_close_aria')}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Messages */}
                <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 max-h-[45vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <AnimatePresence initial={false}>
                    {messages.map((m, idx) => (
                      <motion.div
                        key={`${m.role}-${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex flex-col">
                          <div
                            className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                              m.role === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                            }`}
                          >
                            {m.text}
                          </div>
                          {m.role === "bot" && m.showHelpfulness && showHelpfulness && idx === messages.length - 1 && (
                            <div className="flex items-center gap-2 mt-2 ml-1">
                              <span className="text-xs text-muted-foreground">Was this helpful?</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleHelpfulness(true)}
                                className="h-6 w-6 p-0 hover:bg-green-100"
                              >
                                👍
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleHelpfulness(false)}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                👎
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Suggestions */}
                <div className="px-3 pb-2 flex flex-wrap gap-2 flex-shrink-0 max-h-[15vh] overflow-y-auto">
                  {suggestions.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <motion.div
                        key={`${s.value}-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.02 * i, duration: 0.15 }}
                      >
                        <Button size="sm" variant="outline" onClick={() => quickAction(s.value)}>
                          <Icon className="w-3 h-3 mr-1" /> {s.label}
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Input */}
                <div className="flex items-center border-t border-border p-2 space-x-2 flex-shrink-0">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('chatbot_input_placeholder')}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend()
                    }}
                  />
                  <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                    <Button size="icon" onClick={() => handleSend()} aria-label={t('chatbot_send_aria')}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="chat-toggle"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            style={{ transformOrigin: "bottom right" }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-12 h-12 shadow-lg"
              aria-label={t('chatbot_open_aria')}
              variant="gradient"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatbotWidget


