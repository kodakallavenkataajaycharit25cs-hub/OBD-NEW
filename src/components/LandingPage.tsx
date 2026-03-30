import React, { useEffect, useRef } from 'react';
import { 
  Car, 
  Shield, 
  TrendingUp, 
  Wrench, 
  Brain, 
  ArrowRight,
  Star,
  Activity,
  ArrowUpRight,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        heroRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-zinc-900 text-white selection:bg-blue-500/30 font-['Space_Grotesk'] overflow-x-hidden">
      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Modern Navigation */}
      <nav className="glass-navbar border-b border-white/5 py-4">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="w-14 h-14 bg-white text-black rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl transition-all group-hover:rotate-6">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none clay-text-3d text-white">SUKRUTHA</span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-blue-400 mt-1">Intelligence</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-12">
              {['Booking', 'Features', 'Network', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors tracking-[0.2em]">
                  {item}
                </a>
              ))}
              <button
                onClick={user ? handleDashboardAccess : onLoginClick}
                className="clay-btn clay-btn-blue text-[10px] uppercase tracking-[0.2em]"
              >
                {user ? 'View Dashboard' : 'Member Login'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Claymorphic Hero */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Status Badge - Outside grid for safety */}
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-400/20 mb-12 shadow-inner">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-100 uppercase">Live V4.0 Active</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-8 z-10">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-10 italic clay-text-3d text-white">
                ENGINEERING<br />
                <span className="text-blue-500 underline decoration-white/20">TOTAL</span> CONTROL.
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light mb-12">
                The Indian fleet landscape is brutal. We give you the <span className="text-white font-bold italic">OBD-powered neural edge</span> to master it. Diagnostics, AI safety, and extreme efficiency.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8">
                <Link to="/booking" className="clay-btn clay-btn-white flex items-center justify-between min-w-[280px]">
                  <span className="text-lg">START BOOKING</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
                <button onClick={handleDashboardAccess} className="clay-btn bg-white/5 border border-white/10 text-lg flex items-center justify-between min-w-[280px] text-white">
                  <span>OPERATOR DEMO</span>
                  <ArrowUpRight className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 relative mt-12 lg:mt-0">
              <div ref={heroRef} className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600/10 rounded-[4rem] rotate-6 scale-95 border border-blue-500/20 shadow-2xl" />
                <div className="relative z-10 w-full h-full clay-card overflow-hidden group p-4 border-white/30">
                   <img 
                     src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg" 
                     alt="Fleet" 
                     className="w-full h-full object-cover rounded-[2.5rem] opacity-90 group-hover:scale-105 transition-all duration-1000"
                   />
                   <div className="absolute bottom-6 right-6 p-5 clay-card border-none bg-blue-600/80 backdrop-blur-md max-w-[200px]">
                     <div className="flex items-center justify-between mb-3">
                       <span className="text-[8px] font-black uppercase tracking-widest text-blue-100 leading-none">Live Data</span>
                       <Activity className="w-4 h-4 text-blue-100" />
                     </div>
                     <div className="text-2xl font-black tracking-tighter text-white">84,203 km</div>
                     <div className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mt-0.5">Fleet Mileage</div>
                   </div>
                </div>
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
                <span className="text-7xl font-black text-white italic tracking-tighter clay-text-3d">{s.n}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 max-w-[120px] leading-tight whitespace-normal">{s.l}</span>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-12 opacity-30 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
             </div>
           ))}
        </div>
      </section>

      {/* Clay Features Grid */}
      <section id="features" className="py-40 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
            <div className="order-2 lg:order-1">
              <div className="clay-card w-24 h-24 flex items-center justify-center mb-12 bg-blue-600 border-none shadow-blue-900/50">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.9] clay-text-3d text-white">
                LIVE ENGINE<br />TELEMATICS.
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
                We tap directly into the OBD-II port to stream millisecond engine diagnostics, fuel flow, and sensor health. No guesswork, just raw truth.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Activity, text: 'Fuel Monitoring' },
                  { icon: Zap, text: 'Fault Diagnostics' },
                  { icon: Shield, text: 'Behavior Analytics' },
                  { icon: Globe, text: 'Real-time Tracking' }
                ].map((f, i) => (
                  <div key={i} className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-white/50">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shadow-inner">
                      <f.icon className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="clay-card aspect-square max-w-[500px] mx-auto flex items-center justify-center p-12 bg-zinc-800 border-white/5">
                 <div className="w-full h-full rounded-[3rem] bg-blue-600/10 flex items-center justify-center relative shadow-inner">
                    <Activity className="w-32 h-32 text-blue-500 animate-pulse opacity-50" />
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 clay-card clay-card-hover p-16 group">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-10 group-hover:bg-purple-500/30 transition-colors shadow-inner">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-4xl font-black mb-8 tracking-tighter clay-text-3d uppercase text-white">AI Neural Mesh</h3>
              <p className="text-lg text-gray-400 font-light max-w-xl leading-relaxed">
                Our machine learning layer processes billions of data points to optimize routes, predict demand, and forecast vehicle maintenance before it's needed.
              </p>
            </div>
            
            <div className="clay-card clay-card-hover p-12 bg-emerald-500/10 group border-emerald-500/20">
              <Shield className="w-12 h-12 text-emerald-500 mb-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase clay-text-3d text-white">Safety SOS</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Autonomous crash detection and instant SOS alerts for drivers. Total protection for your human assets.
              </p>
            </div>

            <div className="clay-card clay-card-hover p-12 border-orange-500/20 group">
              <Wrench className="w-12 h-12 text-orange-500 mb-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase clay-text-3d text-white">Predictive Care</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Integrated service scheduling based on actual vehicle wear, not just distance based on fleet logs.
              </p>
            </div>

            <div className="md:col-span-2 clay-card clay-card-hover p-16 bg-blue-600/5 group border-blue-500/20">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-10 group-hover:bg-blue-500/30 transition-colors shadow-inner">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-4xl font-black mb-8 tracking-tighter uppercase clay-text-3d text-white">Peak Profitability</h3>
              <p className="text-lg text-gray-400 font-light max-w-xl leading-relaxed">
                Detailed trip costing simulations that account for fuel price volatility, driver incentives, and dynamic operational costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clay Testimonials */}
      <section className="py-40 bg-zinc-800/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
           <h2 className="text-[10px] uppercase font-black tracking-[0.5em] text-blue-400 mb-20 italic">Elite Fleet Leaders</h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
             {[
               { n: 'Arjun Patel', r: 'CEO, Golden Travels', t: 'Sukrutha isn\'t software; it\'s our edge. 35% cost reduction and zero safety incidents since implementation.' },
               { n: 'Priya Sharma', r: 'Operations Strategist', t: 'The OBD granularity identified ₹15 lakh in annual fuel wastage. ROI was achieved in just 3 months.' },
               { n: 'Vikram Singh', r: 'Fleet Director', t: 'Predictive maintenance reduced our downtime by 60%. Customer satisfaction is at an all-time high.' }
             ].map((tm, i) => (
               <div key={i} className="clay-card p-12 hover:bg-white/5 transition-all cursor-default group">
                  <div className="flex space-x-1 mb-10 text-yellow-500">
                    {[...Array(5)].map((_,k) => <Star key={k} className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />)}
                  </div>
                  <p className="text-xl font-light italic text-gray-300 leading-relaxed mb-12 flex-grow">"{tm.t}"</p>
                  <div className="flex items-center space-x-5 mt-auto pt-8 border-t border-white/5">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-blue-600 flex items-center justify-center font-black text-2xl text-white shadow-lg">{tm.n[0]}</div>
                    <div className="flex flex-col">
                      <span className="font-black text-white uppercase tracking-tighter text-lg leading-tight">{tm.n}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{tm.r}</span>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Puffy CTA */}
      <section className="py-40 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative clay-card p-24 md:p-40 overflow-hidden text-center bg-blue-600 border-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-16 italic leading-[0.85] text-white clay-text-3d">
              READY FOR THE<br />LONG HAUL?
            </h2>
            <div className="flex flex-col sm:flex-row gap-10 justify-center">
              <button 
                onClick={handleDashboardAccess}
                className="clay-btn clay-btn-white text-2xl"
              >
                JOIN THE NETWORK
              </button>
              <Link to="/booking" className="clay-btn bg-black text-white hover:bg-zinc-900 border border-white/10 text-2xl">
                 DEMO RIDE
              </Link>
            </div>
            <p className="mt-16 text-blue-200 text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Certified AIS-140 Intelligent Platform</p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer id="contact" className="py-24 border-t border-white/5 bg-black/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex items-center space-x-6">
               <div className="w-14 h-14 bg-white text-black rounded-[1.2rem] flex items-center justify-center font-black text-2xl shadow-xl">S</div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter leading-none text-white">SUKRUTHA</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Mobility</span>
               </div>
             </div>
             
             <div className="flex gap-16">
               {['Legal', 'Privacy', 'API', 'Portal'].map(item => (
                 <a key={item} href="#" className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-600 hover:text-white transition-colors">{item}</a>
               ))}
             </div>
             
             <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-800">© 2025 Sukrutha Mobility Services</p>
          </div>
        </div>
      </footer>
    </div>
  );
}