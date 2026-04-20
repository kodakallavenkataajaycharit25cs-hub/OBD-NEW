import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Curriculums from './pages/Curriculums'
import About from './pages/About'

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => setIsDark((prev) => !prev)

  return (
    <Router>
      <div className="bg-background dark:bg-slate-950 text-on-surface dark:text-slate-100 selection:bg-primary-container selection:text-on-primary-container transition-colors duration-300 min-h-screen">
        <Header toggleDarkMode={toggleDarkMode} isDark={isDark} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/curriculums" element={<Curriculums />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
