import React from 'react';
import { Zap } from 'lucide-react';
import Navbar from './Navbar';
import MagicBento from './MagicBento';
import Footer from './Footer';

interface FeaturesPageProps {
  onLoginClick: () => void;
}

export default function FeaturesPage({ onLoginClick }: FeaturesPageProps) {
  return (
    <div className="min-h-screen bg-[#120F17] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar onLoginClick={onLoginClick} />

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8 shadow-inner">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black tracking-[0.3em] text-blue-100 uppercase">Interactive Diagnostics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] clay-text-3d text-white uppercase font-display">
              NEXT-GEN<br />OPERATIONAL EDGE.
            </h1>
            <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Explore the advanced telemetry, machine learning cost optimization, and real-time safety controls designed for modern Indian fleets.
            </p>
          </div>

          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={15}
            glowColor="59, 130, 246"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
