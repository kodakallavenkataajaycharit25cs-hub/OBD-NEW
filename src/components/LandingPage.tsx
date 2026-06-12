import React from 'react';
import {
  Shield,
  ArrowRight,
  Star
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

      <Navbar onLoginClick={onLoginClick} />

      {/* Claymorphic Hero */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-8 z-10">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85] mb-10 clay-text-3d text-white font-display">
                TRACK<br />
                <span className="text-blue-500">ANALYZE</span> OPTIMIZE
              </h1>
              <BlurTextAnimation 
                text="The Indian fleet landscape is brutal. We give you the OBD-powered neural edge to master it. Diagnostics, AI safety, and extreme efficiency."
                className="justify-start min-h-0 bg-transparent !items-start text-left mb-12 m-0 p-0"
                textColor="text-gray-400"
                fontSize="text-xl md:text-2xl"
                animationDelay={60000}
              />

              <div className="flex flex-col sm:flex-row gap-8">
                <Link to="/features" className="clay-btn clay-btn-white flex items-center justify-between min-w-[280px]">
                  <span className="text-lg">EXPLORE FEATURES</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 relative mt-12 lg:mt-0">
              <div className="animate-float relative lg:top-[-40px]">
                <TiltedCard
                  imageSrc="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg"
                  altText="Sukrutha Fleet Vehicle"
                  containerHeight="400px"
                  containerWidth="100%"
                  imageHeight="350px"
                  imageWidth="350px"
                  rotateAmplitude={12}
                  scaleOnHover={1.08}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="absolute bottom-6 right-6 p-5 border-none bg-blue-600/80 backdrop-blur-md max-w-[200px] rounded-2xl glass-overlay-card">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-100 leading-none">Fleet Command</span>
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xl font-black tracking-tighter text-white">FULL CONTROL</div>
                      <div className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mt-0.5">On Your Fleet</div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clay Stats Ticker */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex space-x-24 animate-marquee whitespace-nowrap">
          {[
            { n: '50+', l: 'Strategic Partners' },
            { n: '₹2.5Cr', l: 'Fuel Cost Savings' },
            { n: '99.9%', l: 'System Uptime' },
            { n: '24/7', l: 'Elite Support' },
            { n: '15ms', l: 'Data Latency' },
            { n: '1.2M', l: 'Trips Tracked' }
          ].map((s, i) => (
            <div key={i} className="flex items-center space-x-8">
              <span className="text-7xl font-black text-white tracking-tighter clay-text-3d">{s.n}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 max-w-[120px] leading-tight whitespace-normal">{s.l}</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-12 opacity-30 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
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
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative py-20 px-8 md:px-16 overflow-hidden text-center bg-blue-600 border-[3px] border-white/10 rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            
            <h2 className="text-3x2 md:text-5xl font-black text-white mb-4 relative z-10 uppercase font-display tracking-wide">
              READY FOR THE LONG HAUL?
            </h2>
            
            <p className="text-base md:text-lg text-blue-100 mb-10 max-w-2xl mx-auto relative z-10 font-normal tracking-wide">
              Connect with our mobility experts to scale and optimize your fleet operations.
            </p>
            
            <div className="flex justify-center relative z-10">
              <Link to="/contact" className="px-8 py-3.5 bg-white text-black border border-gray-200 rounded-xl font-black hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">
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