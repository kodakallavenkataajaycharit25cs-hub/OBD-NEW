import React, { useState, useEffect } from 'react';
import {
  Shield,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import TiltedCard from './TiltedCard';
import Navbar from './Navbar';
import Footer from './Footer';
import { BlurTextAnimation } from '@/components/ui/blur-text-animation';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { motion } from 'motion/react';

const testimonialsData = [
  {
    text: "Sukrutha isn't software; it's our edge. 35% cost reduction and zero safety incidents since implementation.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Arjun Patel",
    role: "CEO, Golden Travels",
  },
  {
    text: "The OBD granularity identified ₹15 lakh in annual fuel wastage. ROI was achieved in just 3 months.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Priya Sharma",
    role: "Operations Strategist",
  },
  {
    text: "Predictive maintenance reduced our downtime by 60%. Customer satisfaction is at an all-time high.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Vikram Singh",
    role: "Fleet Director",
  },
  {
    text: "The automated billing and fast invoicing has improved our cash flow significantly. Incredible system.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Anjali Desai",
    role: "Finance Head",
  },
  {
    text: "Spot bookings and direct route allocations are incredibly smooth now. We don't miss any opportunities.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Rahul Verma",
    role: "Dispatch Manager",
  },
  {
    text: "Live tracking combined with passenger SOS features gives our enterprise clients complete peace of mind.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Sneha Kapoor",
    role: "Client Relations",
  },
  {
    text: "Integrating with our existing vehicles was plug-and-play. The insights we get now are simply game-changing.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Karan Malhotra",
    role: "Technical Lead",
  },
  {
    text: "We've managed to scale our fleet by 40% without adding administrative overhead, thanks to this platform.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Roshni Iyer",
    role: "Managing Director",
  },
  {
    text: "Driver behavior monitoring has significantly reduced our insurance premiums and improved overall safety.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&q=80",
    name: "Amit Joshi",
    role: "Safety Officer",
  },
];

const firstColumn = testimonialsData.slice(0, 3);
const secondColumn = testimonialsData.slice(3, 6);
const thirdColumn = testimonialsData.slice(6, 9);

function AnimateNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
}

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user?.role === 'owner') {
      navigate('/owner');
    } else if (user?.role === 'driver') {
      navigate('/driver');
    } else {
      onLoginClick();
    }
  };

  return (
    <div className="min-h-screen bg-[#120F17] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Light-Themed Header + Hero wrapper */}
      <div className="bg-white text-slate-900 relative overflow-hidden">
        {/* Soft Background Blob */}
        <div className="absolute top-0 right-0 w-[45%] h-[60%] bg-blue-50/50 blur-[80px] rounded-full pointer-events-none" />

        <header className="py-6 px-6 lg:px-12 max-w-7xl mx-auto flex justify-between items-center relative z-20">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-11 h-11 bg-white text-black rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-xl transition-all group-hover:rotate-6">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">SUKRUTHA</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative pb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300">
              Home
            </Link>
            <Link to="/about" className="relative pb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300">
              About Us
            </Link>
            <Link to="/features" className="relative pb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300">
              Features
            </Link>
            <Link to="/contact" className="relative pb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300">
              Contact
            </Link>
          </div>
          <div>
            <button
              onClick={handleDashboardAccess}
              className="inline-flex items-center justify-center bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all hover:bg-[#DBEAFE] active:scale-95"
            >
              {user ? 'View Dashboard' : 'Member Login'}
            </button>
          </div>
        </header>

        {/* Separator line between Navbar and Hero */}
        <div className="border-b border-slate-300 w-full relative z-20" />

        {/* Custom Light Hero */}
        <section className="relative pt-12 pb-24 px-6 lg:px-12 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-8">
                <div className="inline-flex items-center space-x-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>AI - Powered Fleet Intelligence</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.05]">
                  Master Your<br />
                  <span className="text-[#1E293B]">Fleet Horizon.</span>
                </h1>

                <BlurTextAnimation
                  text="Empowering Indian fleet operators with real-time OBD analytics, AI-driven safety protocols, and automated expense classification to drive maximum profitability."
                  fontSize="text-lg md:text-xl"
                  textColor="text-slate-600 font-medium"
                  className="leading-relaxed"
                  animationDelay={60000}
                />

                <div>
                  <Link
                    to="/features"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-md shadow-slate-100 hover:shadow-lg active:scale-95"
                  >
                    Explore Features
                  </Link>
                </div>

                {/* Stats Ticker Row */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                  <div>
                    <div className="text-3xl font-black text-slate-950"><AnimateNumber value={18} />%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Fuel Savings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-950"><AnimateNumber value={40} />%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Safety Score Increase</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-950">Live</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">OBD Telemetry</div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-6 relative mt-12 lg:mt-0 flex justify-center items-center">
                
                {/* Fleet Uptime Badge */}
                <div className="absolute top-[-20px] left-[10%] bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center space-x-3 z-30 animate-bounce" style={{ animationDuration: '6s' }}>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fleet Uptime</div>
                    <div className="text-lg font-black text-slate-950">99.7%</div>
                  </div>
                </div>

                {/* Perspective Dashboard Mockup */}
                <div className="relative w-full max-w-lg rounded-3xl overflow-hidden group border border-slate-100 shadow-2xl bg-slate-50">
                  <img
                    src="/dashboard_flat.png"
                    alt="Sukrutha Dashboard"
                    className="w-full h-full object-contain rounded-3xl transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Decorative Wavy Terrain overlay at the bottom, like in the 2nd attachment */}
                  <div className="absolute bottom-0 left-0 w-full pointer-events-none translate-y-2 z-10">
                    <svg viewBox="0 0 1440 320" className="w-full h-auto text-emerald-600/90 fill-current">
                      <path d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,165.3C672,181,768,235,864,245.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full pointer-events-none translate-y-3 opacity-60">
                    <svg viewBox="0 0 1440 320" className="w-full h-auto text-emerald-500/80 fill-current">
                      <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                  </div>
                </div>
                  
                  {/* AI Driver Safety Notification Badge */}
                  <div className="absolute bottom-[10%] left-[-5%] bg-[#111827] border border-white/5 text-white p-5 rounded-2xl shadow-2xl max-w-[280px] z-30 transition-all duration-500 hover:scale-105">
                    <div className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">AI Driver Safety</div>
                    <p className="text-xs font-bold leading-normal text-slate-200">
                      Real-time alert: Fatigue detected in Route #402. Rerouting to nearest hub.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      {/* Clay Stats Ticker */}
      <section className="py-[29px] border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex space-x-16 animate-marquee whitespace-nowrap">
          {[
            { n: '50+', l: 'Strategic Partners' },
            { n: '₹2.5Cr', l: 'Fuel Cost Savings' },
            { n: '99.9%', l: 'System Uptime' },
            { n: '24/7', l: 'Elite Support' },
            { n: '15ms', l: 'Data Latency' },
            { n: '1.2M', l: 'Trips Tracked' }
          ].map((s, i) => (
            <div key={i} className="flex items-center space-x-6">
              <span className="text-[35px] font-black text-white tracking-tighter clay-text-3d">{s.n}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 max-w-[120px] leading-tight whitespace-normal">{s.l}</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-8 opacity-30 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          ))}
        </div>
      </section>

      {/* Animated Testimonials */}
      <section className="bg-transparent my-20 relative z-10">
        <div className="container z-10 mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
          >
            <div className="flex justify-center">
              <div className="border border-blue-500/30 text-blue-400 py-1 px-4 rounded-lg uppercase tracking-widest text-xs font-bold bg-blue-500/10">Proven Results</div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mt-5 uppercase clay-text-3d text-white">
              ELITE FLEET LEADERS
            </h2>
            <p className="text-center mt-5 opacity-75 text-gray-400 font-bold uppercase tracking-widest text-xs">
              See how top fleets are transforming their operations with our platform.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>



      {/* Puffy CTA */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative py-[52px] px-10 md:px-16 overflow-hidden text-center bg-blue-600 border-[3px] border-white/10 rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 relative z-10 uppercase font-display tracking-wide">
              READY FOR THE LONG HAUL?
            </h2>
            
            <p className="text-sm md:text-base text-blue-100 mb-8 max-w-xl mx-auto relative z-10 font-normal tracking-wide">
              Connect with our mobility experts to scale and optimize your fleet operations.
            </p>
            
            <div className="flex justify-center relative z-10">
              <Link to="/contact" className="px-8 py-3 bg-white text-black border border-gray-200 rounded-xl font-black hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">
                GET IN TOUCH
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}