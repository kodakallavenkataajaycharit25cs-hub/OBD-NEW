"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Activity,
  Map,
  Wrench,
  ShieldAlert,
  LayoutDashboard,
  Cpu,
  Award,
  Users,
  Calendar,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Star
} from "lucide-react"
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion"
import { BlurTextAnimation } from "./blur-text-animation"

export default function AboutUsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const services = [
    {
      icon: <Activity className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-blue-400" />,
      title: "Telemetry",
      description:
        "Real-time vehicle tracking, fuel monitoring, and live performance metrics straight from the OBD port.",
      position: "left",
    },
    {
      icon: <Map className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-blue-400" />,
      title: "Neural Routing",
      description:
        "AI-optimized dispatching and routing that slashes delivery times and minimizes fuel expenditure.",
      position: "left",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-blue-400" />,
      title: "Predictive Care",
      description:
        "Proactive maintenance alerts that catch engine faults before they lead to expensive breakdowns.",
      position: "left",
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-blue-400" />,
      title: "Safety Score",
      description:
        "Comprehensive driver behavior tracking that drastically reduces critical on-road incidents.",
      position: "right",
    },
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-blue-400" />,
      title: "Fleet Dashboard",
      description:
        "A unified control center for total operational visibility across all your logistics assets.",
      position: "right",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-blue-400" />,
      title: "Automation",
      description:
        "Seamless workflow automation that eliminates manual data entry and optimizes dispatch logic.",
      position: "right",
    },
  ]

  const stats = [
    { icon: <Award />, value: 5000, label: "Vehicles Tracked", suffix: "+" },
    { icon: <Users />, value: 300, label: "Fleet Operators", suffix: "+" },
    { icon: <Calendar />, value: 24, label: "Hours Active Support", suffix: "/7" },
    { icon: <TrendingUp />, value: 30, label: "Efficiency Boost", suffix: "%" },
  ]

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="w-full py-24 px-4 bg-white text-[#120F17] overflow-hidden relative"
    >
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-blue-500/20"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-purple-500/20"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="container mx-auto max-w-7xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <motion.span
            className="text-blue-600 font-bold mb-2 flex items-center gap-2 tracking-widest text-sm uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="w-4 h-4" />
            SUKRUTHA MOBILITY
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-center tracking-tighter uppercase">About Us</h2>
          <motion.div
            className="w-24 h-1.5 bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
        </motion.div>

        <motion.div className="flex justify-center mb-16" variants={itemVariants}>
          <BlurTextAnimation 
            text="We are redefining the Indian fleet landscape. Our OBD-powered neural edge technology provides unmatched diagnostics, AI safety, and extreme operational efficiency for modern logistics networks."
            className="justify-center text-center max-w-3xl mx-auto"
            textColor="text-gray-600"
            fontSize="text-lg"
            animationDelay={60000}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-center">
          {/* Left Column */}
          <div className="space-y-12 lg:space-y-16">
            {services
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="left"
                />
              ))}
          </div>

          {/* Center Logo 'S' */}
          <div className="flex justify-center items-center order-first lg:order-none mb-12 lg:mb-0 relative">
            <motion.div className="relative w-full max-w-sm aspect-square" variants={itemVariants}>
              <motion.div
                className="rounded-3xl overflow-hidden shadow-2xl w-full h-full flex items-center justify-center bg-white border border-gray-100"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <span className="text-[12rem] font-black text-black drop-shadow-md leading-none font-display">S</span>
              </motion.div>
              <motion.div
                className="absolute inset-0 border-4 border-blue-200 rounded-3xl -m-4 z-[-1]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              ></motion.div>

              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-4 -right-8 w-16 h-16 rounded-full bg-blue-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={{ y: y1 }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-6 -left-10 w-20 h-20 rounded-full bg-blue-600/15"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                style={{ y: y2 }}
              ></motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-12 lg:space-y-16">
            {services
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="right"
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>


      </motion.div>
    </section>
  )
}

interface ServiceItemProps {
  icon: React.ReactNode
  secondaryIcon?: React.ReactNode
  title: string
  description: string
  variants: {
    hidden: { opacity: number; y?: number }
    visible: { opacity: number; y?: number; transition: { duration: number; ease: string } }
  }
  delay: number
  direction: "left" | "right"
}

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction }: ServiceItemProps) {
  return (
    <motion.div
      className="flex flex-col group"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className={`flex items-center gap-4 mb-3 ${direction === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''}`}
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="text-blue-600 bg-blue-50 p-4 rounded-xl border border-blue-100 transition-colors duration-300 group-hover:border-blue-600 relative shadow-sm"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold text-[#120F17] group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className={`text-base text-gray-600 leading-relaxed ${direction === 'right' ? 'lg:pr-[4.5rem] lg:text-right' : 'pl-[4.5rem]'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

interface StatCounterProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix: string
  delay: number
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: false })
  const [hasAnimated, setHasAnimated] = useState(false)

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    } else if (!isInView && hasAnimated) {
      springValue.set(0)
      setHasAnimated(false)
    }
  }, [isInView, value, springValue, hasAnimated])

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  return (
    <motion.div
      className="bg-white border border-gray-100 p-8 rounded-2xl flex flex-col items-center text-center group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="text-4xl font-black text-[#120F17] flex items-center font-display tracking-tight">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">{label}</p>
      <motion.div className="w-10 h-1 bg-blue-600 rounded-full mt-4 group-hover:w-16 transition-all duration-300" />
    </motion.div>
  )
}
