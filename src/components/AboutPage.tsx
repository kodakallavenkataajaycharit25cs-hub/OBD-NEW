import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AboutPageProps {
  onLoginClick: () => void;
}

export default function AboutPage({ onLoginClick }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar onLoginClick={onLoginClick} />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
              ABOUT <span className="text-blue-600">US</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
              We are building the neural edge of the Indian fleet landscape, providing diagnostics, AI safety, and extreme efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="/about-hero.jpg" 
                alt="Futuristic Fleet Management Dashboard" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            
            <div className="space-y-8">
              <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 transform origin-top transition-transform group-hover:scale-y-110"></div>
                <h2 className="text-2xl font-black mb-4 tracking-tight">OUR VISION</h2>
                <p className="text-gray-400 leading-relaxed">
                  To revolutionize fleet operations through advanced telemetry, AI-driven insights, and uncompromising reliability. We envision a world where every fleet operates at its maximum potential with zero downtime and perfect safety.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-400 transform origin-top transition-transform group-hover:scale-y-110"></div>
                <h2 className="text-2xl font-black mb-4 tracking-tight">OUR GOAL</h2>
                <p className="text-gray-400 leading-relaxed">
                  Provide fleet owners and drivers with an intuitive, powerful, and secure platform to track, analyze, and optimize their operations in real-time, delivering the ultimate OBD-powered neural edge.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight">WHY <span className="text-blue-600">TRUST US?</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Data Security', desc: 'Military-grade encryption for all your telemetry and operational data.'},
                { title: 'Proven Reliability', desc: '99.99% uptime with redundant systems ensuring you are always connected.'},
                { title: 'Expert Team', desc: 'Built by industry veterans with deep expertise in automotive tech and AI.' },
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-colors text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
