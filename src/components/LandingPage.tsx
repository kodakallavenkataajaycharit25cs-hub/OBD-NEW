import React, { useEffect, useRef } from 'react';
import { 
  Car, 
  Shield, 
  TrendingUp, 
  Wrench, 
  Brain, 
  MapPin,
  ArrowRight,
  Star,
  Users,
  PhoneCall,
  LogIn
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
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Sukrutha Mobility Services</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/booking" className="text-gray-300 hover:text-white transition-colors">
                Book Now
              </Link>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <button
                onClick={user ? handleDashboardAccess : onLoginClick}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>{user ? 'Dashboard' : 'Login'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          ref={heroRef}
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900"
        >
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg')] bg-cover bg-center opacity-20" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-silver to-blue-400 bg-clip-text text-transparent leading-tight">
            Premium Fleet
            <br />
            <span className="text-blue-500">Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            OBD-powered telematics, AI-driven insights, and premium travel experiences
            <br />
            for India's most demanding fleet operators
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Book a Premium Ride</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleDashboardAccess}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Next-Generation Fleet Management
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Premium fleet management solutions for India's most demanding travel operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: 'OBD Telematics',
                description: 'Real-time engine diagnostics, fuel monitoring, and vehicle health tracking with instant alerts',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Shield,
                title: 'Safety & Emergency',
                description: 'Crash detection, SOS alerts, and automated emergency response protocols',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: TrendingUp,
                title: 'Trip Costing',
                description: 'Detailed profitability analysis per trip with fuel, driver, and operational cost breakdown',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Brain,
                title: 'AI Analytics',
                description: 'Machine learning for route optimization, demand forecasting, and predictive maintenance',
                color: 'from-purple-500 to-violet-500'
              },
              {
                icon: Wrench,
                title: 'Smart Maintenance',
                description: 'Predictive maintenance scheduling with vendor management and cost optimization',
                color: 'from-orange-500 to-yellow-500'
              },
              {
                icon: Users,
                title: 'Driver Management',
                description: 'Comprehensive driver scoring, incentive programs, and performance optimization',
                color: 'from-indigo-500 to-blue-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50+', label: 'Fleet Partners' },
              { number: '₹2.5Cr+', label: 'Cost Savings' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Arjun Patel',
                role: 'Fleet Owner, Mumbai',
                company: 'Golden Travels',
                text: 'Sukrutha transformed our operations. 35% cost reduction and zero safety incidents since implementation.'
              },
              {
                name: 'Priya Sharma',
                role: 'Operations Manager',
                company: 'Delhi Tours & Travels',
                text: 'The OBD analytics helped us identify ₹15 lakh in annual fuel wastage. ROI achieved in 3 months.'
              },
              {
                name: 'Vikram Singh',
                role: 'Fleet Director',
                company: 'Rajasthan Expeditions',
                text: 'Predictive maintenance reduced our downtime by 60%. Customer satisfaction is at an all-time high.'
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <div className="text-sm text-blue-400">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Fleet?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join India's premium fleet operators using Sukrutha for next-generation vehicle management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDashboardAccess}
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
            >
              View Dashboard
            </button>
            <Link
              to="/booking"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              Book Demo Ride
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Sukrutha</span>
              </div>
              <p className="text-gray-400 mb-4">
                Premium fleet management solutions for India's most demanding travel operators.
              </p>
              <div className="flex items-center space-x-2 text-gray-400">
                <PhoneCall className="w-4 h-4" />
                <span>+91 6363390074</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">OBD Telematics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fleet Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Driver Management</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sukrutha Mobility Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}