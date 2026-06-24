import React from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pt-[59px] pb-[34px] border-t border-slate-200 bg-[#F2F2F2] font-sans text-slate-800">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-6">
          
          {/* Left Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-4 mb-8 w-fit">
              <div className="w-11 h-11 bg-white rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-xl" style={{ color: '#000000' }}>
                S
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none text-slate-950">SUKRUTHA</span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm mb-6 max-w-sm leading-relaxed">
              Premium fleet management solutions for India's most demanding travel operators.
            </p>
            <a href="tel:+916363390074" className="flex items-center space-x-2 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer w-fit">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 6363390074</span>
            </a>
          </div>

          {/* Middle Column */}
          <div>
            <h3 className="text-slate-950 font-bold mb-6">Solutions</h3>
            <ul className="space-y-4">
              <li><span className="text-slate-600 text-sm">OBD Telematics</span></li>
              <li><span className="text-slate-600 text-sm">Fleet Analytics</span></li>
              <li><span className="text-slate-600 text-sm">Driver Management</span></li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-slate-950 font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-600 hover:text-slate-950 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-slate-950 transition-colors text-sm">Support</Link></li>
              <li><a href="/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-950 transition-colors text-sm">Privacy</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-4 border-t border-slate-300/60 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Sukrutha Mobility Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
