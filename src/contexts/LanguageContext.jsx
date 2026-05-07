"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { languages } from '../data/languages'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode)
      localStorage.setItem('selectedLanguage', languageCode)
      // Don't reload page, let React handle the re-render
    }
  }

  const t = (key) => {
    return languages[currentLanguage]?.[key] || languages['english'][key] || key
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}