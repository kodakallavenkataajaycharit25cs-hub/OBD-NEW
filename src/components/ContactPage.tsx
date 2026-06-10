import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

interface ContactPageProps {
  onLoginClick: () => void;
}

export default function ContactPage({ onLoginClick }: ContactPageProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formState.phone && formState.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formState.email && !emailRegex.test(formState.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transmit message.');
      }

      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#120F17] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[5%] w-[45%] h-[45%] bg-blue-500/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[15%] left-[5%] w-[45%] h-[45%] bg-purple-500/10 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      <Navbar onLoginClick={onLoginClick} />

      <section className="py-20 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8 shadow-inner">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black tracking-[0.3em] text-blue-100 uppercase">Secure Channel</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] clay-text-3d text-white uppercase font-display">
              GET IN TOUCH
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto font-light">
              Connect with our mobility experts to scale and optimize your fleet operations across India.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="clay-card-hover bg-white/[0.02] border border-white/5 p-8 rounded-2xl transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Direct Call</div>
                      <a href="tel:+916363390074" className="text-lg font-black text-white hover:text-blue-400 transition-colors">
                        +91 6363390074
                      </a>
                    </div>
                  </div>
                </div>

                <div className="clay-card-hover bg-white/[0.02] border border-white/5 p-8 rounded-2xl transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Electronic Mail</div>
                      <a href="mailto:support@sukruthamobility.com" className="text-lg font-black text-white hover:text-blue-400 transition-colors">
                        support@sukrutha.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="clay-card-hover bg-white/[0.02] border border-white/5 p-8 rounded-2xl transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Headquarters</div>
                      <div className="text-base font-black text-white leading-tight">
                        Bangalore, Karnataka, India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Status / Operational info */}
              <div className="p-8 rounded-2xl bg-blue-600/10 border border-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Phone className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight">OPERATIONAL AVAILABILITY</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Our network operations center and support desks are active 24/7/365 to handle diagnostic alerts and dispatch emergencies.
                </p>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest">NOC ONLINE & SECURED</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md shadow-2xl h-full flex flex-col justify-between">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans placeholder-gray-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans placeholder-gray-600"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      maxLength={10}
                      className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans placeholder-gray-600"
                      placeholder="1234567890"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans placeholder-gray-600 resize-none"
                      placeholder="Tell us about your fleet..."
                    />
                  </div>

                  {error && <div className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</div>}
                  {submitted && (
                    <div className="text-green-500 text-xs font-bold uppercase tracking-wider bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
                      Thank you! Your message has been sent to our command team.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="clay-btn clay-btn-blue w-full py-4 flex items-center justify-center space-x-3 text-xs uppercase tracking-[0.2em] font-black"
                  >
                    <span>TRANSMIT MESSAGE</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
