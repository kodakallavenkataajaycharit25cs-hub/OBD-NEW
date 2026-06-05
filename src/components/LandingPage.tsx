import React from 'react';
import {
  Shield,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import TiltedCard from './TiltedCard';
import Navbar from './Navbar';
import Footer from './Footer';

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
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light mb-12">
                The Indian fleet landscape is brutal. We give you the <span className="text-white font-bold">OBD-powered neural edge</span> to master it. Diagnostics, AI safety, and extreme efficiency.
              </p>

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
                    <div className="absolute bottom-6 right-6 p-5 border-none bg-blue-600/80 backdrop-blur-md max-w-[200px] rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-100 leading-none">Fleet Command</span>
                        <Shield className="w-4 h-4 text-blue-100" />
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

      {/* Clay Testimonials */}
      <section className="py-40 bg-zinc-800/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black tracking-wide text-blue-400 mb-20 uppercase font-display">Elite Fleet Leaders</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
            {[
              { n: 'Arjun Patel', r: 'CEO, Golden Travels', t: 'Sukrutha isn\'t software; it\'s our edge. 35% cost reduction and zero safety incidents since implementation.' },
              { n: 'Priya Sharma', r: 'Operations Strategist', t: 'The OBD granularity identified ₹15 lakh in annual fuel wastage. ROI was achieved in just 3 months.' },
              { n: 'Vikram Singh', r: 'Fleet Director', t: 'Predictive maintenance reduced our downtime by 60%. Customer satisfaction is at an all-time high.' }
            ].map((tm, i) => (
              <div key={i} className="clay-card-hover rounded-2xl p-12 group transition-all">
                <div className="flex space-x-1 mb-10 text-yellow-500">
                  {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />)}
                </div>
                <p className="text-xl font-light text-gray-300 leading-relaxed mb-12 flex-grow">"{tm.t}"</p>
                <div className="flex items-center space-x-5 mt-auto pt-8 border-t border-white/5">
                  <div className="w-16 h-16 rounded-[1.2rem] bg-blue-600 flex items-center justify-center font-black text-2xl text-white shadow-lg group-hover:rotate-6 transition-transform">{tm.n[0]}</div>
                  <div className="flex flex-col">
                    <span className="font-black text-white uppercase tracking-tighter text-lg leading-tight group-hover:text-blue-400 transition-colors">{tm.n}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{tm.r}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sukrutha - Company Features */}
      <section className="py-32 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black tracking-[0.3em] text-blue-200 uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase font-display leading-tight">
              THE SUKRUTHA<br />
              <span className="text-blue-500">ADVANTAGE</span>
            </h2>
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Built for Indian roads, powered by AI — we deliver what others only promise.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature 1 - OBD Intelligence */}
            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/20 hover:from-blue-500/60 hover:to-purple-500/40 transition-all duration-500">
              <div className="relative rounded-3xl bg-[#0f0c15] p-10 h-full overflow-hidden">
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Illustration */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-8 relative">
                  <img src="/obd-intelligence.png" alt="OBD-II Intelligence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c15] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  OBD-II Deep Intelligence
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm font-light mb-8">
                  Plug directly into your vehicle's brain. Our OBD-II readers capture 100+ data points per second — engine health, fuel injection rates, emission levels, and real-time diagnostics that prevent breakdowns before they happen.
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-6 pt-6 border-t border-white/5">
                  <div>
                    <div className="text-2xl font-black text-white tracking-tighter">100+</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Data Points/sec</div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <div className="text-2xl font-black text-white tracking-tighter">60%</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Less Downtime</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - AI Safety Shield */}
            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-transparent to-cyan-500/20 hover:from-emerald-500/60 hover:to-cyan-500/40 transition-all duration-500">
              <div className="relative rounded-3xl bg-[#0f0c15] p-10 h-full overflow-hidden">
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Illustration */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-8 relative">
                  <img src="/ai-safety.png" alt="AI Safety Scoring" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c15] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                  AI-Powered Safety Scoring
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm font-light mb-8">
                  Every trip gets a real-time safety score based on harsh braking, cornering, speeding patterns, and fatigue detection. Our neural models alert you before incidents happen — not after. Built for India's unpredictable roads.
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-6 pt-6 border-t border-white/5">
                  <div>
                    <div className="text-2xl font-black text-white tracking-tighter">Zero</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Incidents Avg</div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <div className="text-2xl font-black text-white tracking-tighter">24/7</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Live Monitoring</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Cost Optimization */}
            <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-amber-500/30 via-transparent to-orange-500/20 hover:from-amber-500/60 hover:to-orange-500/40 transition-all duration-500">
              <div className="relative rounded-3xl bg-[#0f0c15] p-10 h-full overflow-hidden">
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Illustration */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-8 relative">
                  <img src="/fleet-analytics.png" alt="Smart Cost Optimization" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: 'hue-rotate(30deg) saturate(1.3)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c15] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-amber-400 transition-colors duration-300">
                  Smart Cost Optimization
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm font-light mb-8">
                  Our ML engine analyzes fuel consumption patterns, route efficiency, and driver behavior to cut fleet operating costs by up to 35%. Auto-generated reports show exactly where rupees are leaking — and how to plug them.
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-6 pt-6 border-t border-white/5">
                  <div>
                    <div className="text-2xl font-black text-white tracking-tighter">35%</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Cost Reduction</div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <div className="text-2xl font-black text-white tracking-tighter">₹2.5Cr</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Saved Annually</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Puffy CTA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative py-20 px-8 md:px-16 overflow-hidden text-center bg-blue-600 border-none rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10 uppercase font-display tracking-wide">
              READY FOR THE LONG HAUL?
            </h2>
            
            <p className="text-base md:text-lg text-blue-100 mb-10 max-w-2xl mx-auto relative z-10 font-normal tracking-wide">
              Connect with our mobility experts to scale and optimize your fleet operations.
            </p>
            
            <div className="flex justify-center relative z-10">
              <Link to="/contact" className="px-8 py-3.5 bg-white text-black rounded-xl font-black hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs">
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