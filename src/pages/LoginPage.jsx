// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Card, CardContent } from "../components/ui/card"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Label } from "../components/ui/label"
// import { useTheme } from "../components/theme-provider"
// import { useLanguage } from "../contexts/LanguageContext"
// import { Eye, EyeOff, Mail, Lock, Bus, MapPin, Sun, Moon, Zap, Route } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// const LoginPage = () => {
//   const [credentials, setCredentials] = useState({
//     email: "",
//     password: "",
//     rememberMe: false
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const navigate = useNavigate()
//   const { theme, setTheme } = useTheme()
//   const { t } = useLanguage()

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setCredentials(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }))
//     setError("")
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     // Simulate authentication
//     setTimeout(() => {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
//       if (!emailRegex.test(credentials.email)) {
//         setError(t('validEmail'))
//         setIsLoading(false)
//         return
//       }

//       if (credentials.password.length < 6) {
//         setError(t('passwordLength'))
//         setIsLoading(false)
//         return
//       }

//       if (credentials.email === "admin@gmail.com" && credentials.password === "password") {
//         if (credentials.rememberMe) {
//           localStorage.setItem("isAuthenticated", "true")
//         } else {
//           sessionStorage.setItem("isAuthenticated", "true")
//         }
//         navigate("/")
//       } else {
//         setError(t('invalidCredentials'))
//       }
//       setIsLoading(false)
//     }, 1500)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 pointer-events-none">
//         {Array.from({ length: 20 }).map((_, i) => (
//           <div
//             key={`particle-${i}`}
//             className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 4}s`,
//               animationDuration: `${Math.random() * 3 + 4}s`,
//             }}
//           />
//         ))}
//         {Array.from({ length: 6 }).map((_, i) => (
//           <div
//             key={`orb-${i}`}
//             className="absolute rounded-full bg-gradient-to-r from-white/10 to-purple-300/20 animate-drift blur-xl"
//             style={{
//               width: `${Math.random() * 200 + 100}px`,
//               height: `${Math.random() * 200 + 100}px`,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 6}s`,
//               animationDuration: `${Math.random() * 8 + 10}s`,
//             }}
//           />
//         ))}
//       </div>

//       <motion.div
//         className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//       >
//         {/* Left Side - Bus Tracking Info */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1, duration: 0.4 }}
//         >
//           <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl">
//             <CardContent className="p-8">
//               {/* Animated Bus Route */}
//               <div className="mb-8">
//                 <div className="flex items-center justify-center mb-6">
//                   <div className="relative w-full max-w-xs">
//                     {/* Route Line */}
//                     <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/30 -translate-y-1/2"></div>
                    
//                     {/* Route Stops */}
//                     <div className="flex justify-between px-4 relative z-10">
//                       <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
//                       <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-lg"></div>
//                       <div className="w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow-lg"></div>
//                       <div className="w-3 h-3 bg-red-400 rounded-full border-2 border-white shadow-lg"></div>
//                     </div>
                    
//                     {/* Animated Bus */}
//                     <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-bus-ride">
//                       <div className="relative">
//                         {/* Bus Body */}
//                         <div className="w-10 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg relative overflow-hidden">
//                           {/* Bus Windows */}
//                           <div className="absolute top-1 left-1 w-2 h-2 bg-blue-200 rounded-sm"></div>
//                           <div className="absolute top-1 left-3.5 w-2 h-2 bg-blue-200 rounded-sm"></div>
//                           <div className="absolute top-1 right-3.5 w-2 h-2 bg-blue-200 rounded-sm"></div>
//                           <div className="absolute top-1 right-1 w-2 h-2 bg-blue-200 rounded-sm"></div>
                          
//                           {/* Bus Door */}
//                           <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-yellow-400 rounded-sm"></div>
                          
//                           {/* Headlight */}
//                           <div className="absolute top-1/2 -left-0.5 w-1 h-1 bg-yellow-300 rounded-full"></div>
                          
//                           {/* Bus Number */}
//                           <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
//                         </div>
                        
//                         {/* Bus Wheels */}
//                         <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600">
//                           <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-400 rounded-full"></div>
//                         </div>
//                         <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600">
//                           <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-400 rounded-full"></div>
//                         </div>
                        
//                         {/* Antenna */}
//                         <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-gray-600"></div>
//                         <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between text-sm px-2">
//                   <span className="text-white/90">{t('Start')}</span>
//                   <span className="text-white/90">{t('Destination')}</span>
//                 </div>
//               </div>

//               <h1 className="text-4xl font-bold mb-4 text-white">{t('busTracker')}</h1>
//               <p className="text-white/80 mb-8 text-lg leading-relaxed">
//                 {t('appDescription')}
//               </p>

//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
//                     <Zap className="w-4 h-4 text-blue-300" />
//                   </div>
//                   <span className="text-white/90">{t('liveGPSTracking')}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
//                     <Route className="w-4 h-4 text-green-300" />
//                   </div>
//                   <span className="text-white/90">{t('smartRoutePlanning')}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
//                     <MapPin className="w-4 h-4 text-purple-300" />
//                   </div>
//                   <span className="text-white/90">{t('realTimeUpdates')}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Right Side - Login Form */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.15, duration: 0.45 }}
//         >
//           <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
//             <CardContent className="p-8">
//               <div className="text-center mb-8">
//                 <motion.div
//                   className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3 flex items-center justify-center mx-auto mb-4"
//                   initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
//                   animate={{ scale: 1, rotate: 0, opacity: 1 }}
//                   transition={{ type: "spring", stiffness: 320, damping: 18 }}
//                 >
//                   <Bus className="w-8 h-8 text-white" />
//                 </motion.div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('welcomeBack')}</h2>
//                 <p className="text-gray-600">{t('signInToDashboard')}</p>
//               </div>

//               <AnimatePresence>
//                 {error && (
//                   <motion.div
//                     key="error"
//                     initial={{ opacity: 0, y: -6 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -6 }}
//                     transition={{ duration: 0.2 }}
//                     className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
//                   >
//                     <p className="text-sm text-red-600 text-center">{error}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('email')}</Label>
//                   <div className="relative">
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder={t('enterEmail')}
//                       value={credentials.email}
//                       onChange={handleInputChange}
//                       required
//                       className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
//                     />
//                     <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t('password')}</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder={t('enterPassword')}
//                       value={credentials.password}
//                       onChange={handleInputChange}
//                       required
//                       className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
//                     />
//                     <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-4 h-4 text-gray-400" />
//                       ) : (
//                         <Eye className="w-4 h-4 text-gray-400" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <input
//                     id="rememberMe"
//                     name="rememberMe"
//                     type="checkbox"
//                     checked={credentials.rememberMe}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <Label htmlFor="rememberMe" className="text-sm text-gray-600">
//                     {t('rememberMe')}
//                   </Label>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
//                   disabled={isLoading || !credentials.email || !credentials.password}
//                 >
//                   {isLoading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       {t('signingIn')}
//                     </>
//                   ) : (
//                     t('signIn')
//                   )}
//                 </Button>

//                 {/* Create Account Link */}
//                 <div className="text-center pt-4">
//                   <p className="text-sm text-gray-600">
//                     {t('dontHaveAccount')}{" "}
//                     <Button
//                       type="button"
//                       variant="link"
//                       className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
//                       onClick={() => navigate("/register")}
//                     >
//                       {t('createAccount')}
//                     </Button>
//                   </p>
//                 </div>
//               </form>

//               <motion.div
//                 className="mt-6 p-4 bg-gray-50 rounded-lg"
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.25, duration: 0.3 }}
//               >
//                 <p className="text-sm text-gray-600 text-center mb-2">{t('demoCredentials')}</p>
//                 <div className="text-xs text-gray-500 space-y-1">
//                   <p><strong>{t('email')}:</strong> admin@gmail.com</p>
//                   <p><strong>{t('password')}:</strong> password</p>
//                 </div>
//               </motion.div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </motion.div>

//       {/* Add CSS animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
//           50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
//         }
//         @keyframes drift {
//           0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
//           33% { transform: translateX(30px) translateY(-30px) rotate(120deg); }
//           66% { transform: translateX(-20px) translateY(20px) rotate(240deg); }
//           100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
//         }
//         @keyframes busRide {
//           0% { 
//             transform: translateX(-10px) translateY(-50%); 
//             opacity: 0.6;
//           }
//           10% { 
//             transform: translateX(0px) translateY(-50%); 
//             opacity: 1;
//           }
//           20% { 
//             transform: translateX(60px) translateY(-50%); 
//             opacity: 1;
//           }
//           30% { 
//             transform: translateX(120px) translateY(-50%); 
//             opacity: 1;
//           }
//           40% { 
//             transform: translateX(180px) translateY(-50%); 
//             opacity: 1;
//           }
//           50% { 
//             transform: translateX(240px) translateY(-50%); 
//             opacity: 1;
//           }
//           60% { 
//             transform: translateX(300px) translateY(-50%); 
//             opacity: 1;
//           }
//           70% { 
//             transform: translateX(320px) translateY(-50%); 
//             opacity: 0.8;
//           }
//           80% { 
//             transform: translateX(330px) translateY(-50%); 
//             opacity: 0.4;
//           }
//           90% { 
//             transform: translateX(340px) translateY(-50%); 
//             opacity: 0.2;
//           }
//           100% { 
//             transform: translateX(350px) translateY(-50%); 
//             opacity: 0;
//           }
//         }
//         .animate-float { animation: float ease-in-out infinite; }
//         .animate-drift { animation: drift ease-in-out infinite; }
//         .animate-bus-ride { 
//           animation: busRide 8s linear infinite; 
//         }
//       `}</style>
//     </div>
//   )
// }

// export default LoginPage



"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useTheme } from "../components/theme-provider"
import { useLanguage } from "../contexts/LanguageContext"
import { Eye, EyeOff, Mail, Lock, Bus, MapPin, Sun, Moon, Zap, Route } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      if (!emailRegex.test(credentials.email)) {
        setError(t('validEmail'))
        setIsLoading(false)
        return
      }

      if (credentials.password.length < 6) {
        setError(t('passwordLength'))
        setIsLoading(false)
        return
      }

      if (credentials.email === "admin@gmail.com" && credentials.password === "password") {
        if (credentials.rememberMe) {
          localStorage.setItem("isAuthenticated", "true")
        } else {
          sessionStorage.setItem("isAuthenticated", "true")
        }
        navigate("/")
      } else {
        setError(t('invalidCredentials'))
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-white/10 to-purple-300/20 animate-drift blur-xl"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 8 + 10}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Left Side - Bus Tracking Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-center"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl w-full max-w-md">
            <CardContent className="p-8 text-center">
              {/* Animated Bus Route */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-full max-w-xs">
                    {/* Route Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/30 -translate-y-1/2"></div>
                    
                    {/* Route Stops */}
                    <div className="flex justify-between px-4 relative z-10">
                      <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                    
                    {/* Animated Bus */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-bus-ride">
                      <div className="relative">
                        {/* Bus Body */}
                        <div className="w-10 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg relative overflow-hidden">
                          {/* Bus Windows */}
                          <div className="absolute top-1 left-1 w-2 h-2 bg-blue-200 rounded-sm"></div>
                          <div className="absolute top-1 left-3.5 w-2 h-2 bg-blue-200 rounded-sm"></div>
                          <div className="absolute top-1 right-3.5 w-2 h-2 bg-blue-200 rounded-sm"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-200 rounded-sm"></div>
                          
                          {/* Bus Door */}
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-yellow-400 rounded-sm"></div>
                          
                          {/* Headlight */}
                          <div className="absolute top-1/2 -left-0.5 w-1 h-1 bg-yellow-300 rounded-full"></div>
                          
                          {/* Bus Number */}
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        
                        {/* Bus Wheels */}
                        <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600">
                          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600">
                          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                        
                        {/* Antenna */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-gray-600"></div>
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm px-2">
                  <span className="text-white/90">{t('start')}</span>
                  <span className="text-white/90">{t('destination')}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-white text-center">{t('busTracker')}</h1>
              <p className="text-white/80 mb-8 text-lg leading-relaxed text-center">
                {t('appDescription')}
              </p>

              <div className="space-y-3 flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-white/90">{t('liveGPSTracking')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Route className="w-4 h-4 text-green-300" />
                  </div>
                  <span className="text-white/90">{t('smartRoutePlanning')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-white/90">{t('realTimeUpdates')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3 flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <Bus className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('welcomeBack')}</h2>
                <p className="text-gray-600">{t('signInToDashboard')}</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
                  >
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('email')}</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('enterEmail')}
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('enterPassword')}
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={credentials.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    {t('rememberMe')}
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  disabled={isLoading || !credentials.email || !credentials.password}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('signingIn')}
                    </>
                  ) : (
                    t('signIn')
                  )}
                </Button>

                {/* Create Account Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    {t('dontHaveAccount')}{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
                      onClick={() => navigate("/register")}
                    >
                      {t('createAccount')}
                    </Button>
                  </p>
                </div>
              </form>

              <motion.div
                className="mt-6 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <p className="text-sm text-gray-600 text-center mb-2">{t('demoCredentials')}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>{t('email')}:</strong> admin@gmail.com</p>
                  <p><strong>{t('password')}:</strong> password</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          33% { transform: translateX(30px) translateY(-30px) rotate(120deg); }
          66% { transform: translateX(-20px) translateY(20px) rotate(240deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
        }
        @keyframes busRide {
          0% { 
            transform: translateX(-10px) translateY(-50%); 
            opacity: 0.6;
          }
          10% { 
            transform: translateX(0px) translateY(-50%); 
            opacity: 1;
          }
          20% { 
            transform: translateX(60px) translateY(-50%); 
            opacity: 1;
          }
          30% { 
            transform: translateX(120px) translateY(-50%); 
            opacity: 1;
          }
          40% { 
            transform: translateX(180px) translateY(-50%); 
            opacity: 1;
          }
          50% { 
            transform: translateX(240px) translateY(-50%); 
            opacity: 1;
          }
          60% { 
            transform: translateX(300px) translateY(-50%); 
            opacity: 1;
          }
          70% { 
            transform: translateX(320px) translateY(-50%); 
            opacity: 0.8;
          }
          80% { 
            transform: translateX(330px) translateY(-50%); 
            opacity: 0.4;
          }
          90% { 
            transform: translateX(340px) translateY(-50%); 
            opacity: 0.2;
          }
          100% { 
            transform: translateX(350px) translateY(-50%); 
            opacity: 0;
          }
        }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-drift { animation: drift ease-in-out infinite; }
        .animate-bus-ride { 
          animation: busRide 8s linear infinite; 
        }
      `}</style>
    </div>
  )
}

export default LoginPage
