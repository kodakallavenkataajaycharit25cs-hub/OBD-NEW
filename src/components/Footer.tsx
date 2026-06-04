import React from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-16 border-t border-white/5 bg-black font-sans">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Left Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-4 mb-8 w-fit">
              <div className="w-11 h-11 bg-white text-black rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-xl">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none text-white">SUKRUTHA</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-sm leading-relaxed">
              Premium fleet management solutions for India's most demanding travel operators.
            </p>
            <a href="tel:+916363390074" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer w-fit">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 6363390074</span>
            </a>
          </div>

          {/* Middle Column */}
          <div>
            <h3 className="text-white font-semibold mb-6">Solutions</h3>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors text-sm">OBD Telematics</Link></li>
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors text-sm">Fleet Analytics</Link></li>
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors text-sm">Driver Management</Link></li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link></li>
              <li><a href="/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Sukrutha Mobility Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
