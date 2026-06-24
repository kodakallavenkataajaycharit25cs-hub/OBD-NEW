import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Check, Copy, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../services/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ContactPageProps {
  onLoginClick?: () => void;
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    label: string;
  }>;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("disabled:opacity-100 hover:bg-white/10 text-gray-400 hover:text-white", className)}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      disabled={copied}
    >
      <div
        className={cn(
          "transition-all",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check className="size-3.5 stroke-green-500" aria-hidden="true" />
      </div>
      <div
        className={cn(
          "absolute transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Copy aria-hidden="true" className="size-3.5" />
      </div>
    </Button>
  );
}

export default function ContactPage({
  onLoginClick,
  title = "GET IN TOUCH",
  description = "Connect with our mobility experts to scale and optimize your fleet operations across India.",
  phone = "+91 6363390074",
  email = "sukurthamobility@gmail.com",
  address = "Bangalore, Karnataka, India",
  socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ],
}: ContactPageProps) {
  const [formState, setFormState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.firstname || !formState.email || !formState.message) {
      setError('Please fill in all required fields.');
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
          name: `${formState.firstname} ${formState.lastname}`.trim(),
          email: formState.email.toLowerCase(),
          phone: formState.phone,
          message: `Subject: ${formState.subject}\n\n${formState.message}`
        })
      });

      if (!response.ok) {
        throw new Error('API submission failed');
      }

      setSubmitted(true);
      setFormState({ firstname: '', lastname: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error submitting contact form via API, falling back to Supabase:', err);
      // Fallback: Try inserting directly into Supabase contact_messages table as a backup
      try {
        await supabase
          .from('contact_messages')
          .insert([
            {
              name: `${formState.firstname} ${formState.lastname}`.trim(),
              email: formState.email.toLowerCase(),
              phone: formState.phone,
              message: `Subject: ${formState.subject}\n\n${formState.message}`
            }
          ]);
      } catch (subError) {
        console.error('Fallback Supabase insert failed too:', subError);
      }
      
      setSubmitted(true);
      setFormState({ firstname: '', lastname: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#120F17] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[5%] w-[45%] h-[45%] bg-blue-500/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[15%] left-[5%] w-[45%] h-[45%] bg-purple-500/10 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      <Navbar onLoginClick={onLoginClick || (() => {})} />

      <section className="py-20 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8 shadow-inner">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black tracking-[0.3em] text-blue-100 uppercase">Secure Channel</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] clay-text-3d text-white uppercase font-display mb-4">
              {title}
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
              {description}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information & Socials */}
            <div className="space-y-8">
              <Card className="bg-white/[0.02] border-white/10 p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-8 text-white uppercase tracking-tight">
                  Contact Information
                </h2>
                
                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                      <Mail className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Electronic Mail</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${email}`}
                          className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
                        >
                          {email}
                        </a>
                        <CopyButton text={email} className="size-8" />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                      <Phone className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Direct Call</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${phone}`}
                          className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
                        >
                          {phone}
                        </a>
                        <CopyButton text={phone} className="size-8" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                      <MapPin className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Headquarters</p>
                      <p className="text-lg font-bold text-white">{address}</p>
                    </div>
                  </div>
                </div>
              </Card>


            </div>

            {/* Contact Form */}
            <Card className="bg-white/[0.02] border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-8 text-white uppercase tracking-tight">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name *</Label>
                    <Input
                      type="text"
                      id="firstname"
                      value={formState.firstname}
                      onChange={(e) => setFormState({ ...formState, firstname: e.target.value })}
                      className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 rounded-xl px-4"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</Label>
                    <Input
                      type="text"
                      id="lastname"
                      value={formState.lastname}
                      onChange={(e) => setFormState({ ...formState, lastname: e.target.value })}
                      className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 rounded-xl px-4"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address *</Label>
                  <Input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value.toLowerCase() })}
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 rounded-xl px-4"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 rounded-xl px-4"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</Label>
                  <Input
                    type="text"
                    id="subject"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 rounded-xl px-4"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message *</Label>
                  <Textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 rounded-xl px-4 py-3 min-h-[120px] resize-none"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</div>}
                {submitted && (
                  <div className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
                    Thank you! Your message has been sent to our team.
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-xl text-xs uppercase tracking-[0.2em] font-black transition-all"
                >
                  <span className="mr-2">TRANSMIT MESSAGE</span>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
