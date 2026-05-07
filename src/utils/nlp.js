// Simple NLP utilities for better text processing
// Using basic JavaScript string processing and regex patterns

export class SimpleNLP {
  constructor() {
    this.intentPatterns = {
      greeting: /\b(hi|hello|hey|hlo|hola|namaste|namaskar|yo|good morning|good afternoon|good evening)\b/i,
      route: /\b(route|rout|root|direction|plan|from.*to|go to|travel to)\b/i,
      eta: /\b(eta|arrive|reach|time|when|next|coming|due)\b/i,
      fare: /\b(fare|price|ticket|cost|money|rupee|₹)\b/i,
      stop: /\b(stop|station|stand|nearest|near me|where|location)\b/i,
      live: /\b(live|track|tracking|location|where is|current)\b/i,
      schedule: /\b(schedule|timing|timetable|when|time|departure|arrival)\b/i,
      alert: /\b(alert|disruption|delay|problem|issue|down|broken)\b/i,
      help: /\b(help|support|assist|how|what|can you|do you)\b/i,
      feedback: /\b(feedback|suggest|improve|complaint|report)\b/i
    }

    this.entityPatterns = {
      busNumber: /bus\s*(no\.?|number)?\s*(\d+[a-z]?)/i,
      routeNumber: /route\s*(no\.?|number)?\s*(\d+[a-z]?)/i,
      time: /\b(\d{1,2}):(\d{2})\b|\b(\d{1,2})\s*(am|pm)\b/i,
      location: /\b(from|to|at|near)\s+([a-zA-Z\s]+?)(?:\s+to|\s+at|\s+near|$)/i
    }
  }

  // Extract intent from text
  extractIntent(text) {
    const normalized = this.normalize(text)
    
    for (const [intent, pattern] of Object.entries(this.intentPatterns)) {
      if (pattern.test(normalized)) {
        return intent
      }
    }
    return 'unknown'
  }

  // Extract entities from text
  extractEntities(text) {
    const entities = {}
    
    // Extract bus number
    const busMatch = text.match(this.entityPatterns.busNumber)
    if (busMatch) {
      entities.busNumber = busMatch[2]
    }

    // Extract route number
    const routeMatch = text.match(this.entityPatterns.routeNumber)
    if (routeMatch) {
      entities.routeNumber = routeMatch[2]
    }

    // Extract time
    const timeMatch = text.match(this.entityPatterns.time)
    if (timeMatch) {
      entities.time = timeMatch[0]
    }

    // Extract locations
    const locationMatch = text.match(this.entityPatterns.location)
    if (locationMatch) {
      entities.location = locationMatch[2].trim()
    }

    return entities
  }

  // Normalize text for better matching
  normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  // Extract route information (from X to Y)
  extractRoute(text) {
    const routePattern = /(?:from|go\s+from)\s+([^to]+?)\s+to\s+(.+)/i
    const match = text.match(routePattern)
    
    if (match) {
      return {
        from: match[1].trim(),
        to: match[2].trim()
      }
    }
    return null
  }

  // Check if text contains any of the given terms
  containsAny(text, terms) {
    const normalized = this.normalize(text)
    return terms.some(term => normalized.includes(term.toLowerCase()))
  }

  // Get sentiment (basic positive/negative detection)
  getSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'like', 'thanks', 'thank you']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'wrong', 'error', 'problem', 'issue', 'broken']
    
    const normalized = this.normalize(text)
    const positiveCount = positiveWords.filter(word => normalized.includes(word)).length
    const negativeCount = negativeWords.filter(word => normalized.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  // Process user input and return structured data
  processInput(text) {
    const intent = this.extractIntent(text)
    const entities = this.extractEntities(text)
    const route = this.extractRoute(text)
    const sentiment = this.getSentiment(text)
    
    return {
      originalText: text,
      normalizedText: this.normalize(text),
      intent,
      entities,
      route,
      sentiment,
      confidence: this.calculateConfidence(text, intent)
    }
  }

  // Calculate confidence score for intent detection
  calculateConfidence(text, intent) {
    const normalized = this.normalize(text)
    const pattern = this.intentPatterns[intent]
    
    if (!pattern) return 0
    
    const matches = normalized.match(pattern)
    if (!matches) return 0
    
    // Simple confidence based on match length and text length
    const matchLength = matches[0].length
    const textLength = normalized.length
    
    return Math.min(1, matchLength / textLength + 0.3)
  }
}

// Export singleton instance
export const nlp = new SimpleNLP()
