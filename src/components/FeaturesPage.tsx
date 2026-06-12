import React from 'react';
import { Zap, Truck, Shield, Route } from 'lucide-react';
import Navbar from './Navbar';
import { Casestudy5 } from '@/components/ui/casestudy-5';
import { BlurTextAnimation } from '@/components/ui/blur-text-animation';
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
          <div className="text-center mb-5">
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8 shadow-inner">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black tracking-[0.3em] text-blue-100 uppercase">Interactive Diagnostics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] clay-text-3d text-white uppercase font-display">
              NEXT-GEN<br />OPERATIONAL EDGE.
            </h1>
            <div className="flex justify-center mt-8">
              <BlurTextAnimation 
                text="Explore the advanced telemetry, machine learning cost optimization, and real-time safety controls designed for modern Indian fleets."
                className="justify-center text-center max-w-2xl mx-auto"
                textColor="text-gray-400"
                fontSize="text-xl"
                animationDelay={60000}
              />
            </div>
          </div>

          <div className="mt-4">
            <Casestudy5 
              featuredCasestudy={{
                logo: <Truck className="h-8 w-8 text-blue-500" />,
                company: "Sukrutha Logistics",
                tags: "SUPPLY CHAIN / AI AUTOMATION",
                title: "Slashing fuel costs by 15% with AI.",
                subtitle: "How Sukrutha Logistics transformed their fleet efficiency.",
                image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80",
                link: "#",
              }}
              casestudies={[
                {
                  logo: <Shield className="h-8 w-8 text-purple-500" />,
                  company: "Apex Transport",
                  tags: "SAFETY / TELEMATICS",
                  title: "Zero critical incidents in 2025.",
                  subtitle: "A safety-first approach using predictive behavior analytics.",
                  image: "",
                  link: "#",
                },
                {
                  logo: <Route className="h-8 w-8 text-green-500" />,
                  company: "Rapid Freight",
                  tags: "NEURAL ROUTING / LOGISTICS",
                  title: "Cutting delivery times by 30%.",
                  subtitle: "Mastering neural routing for more efficient dispatch operations.",
                  image: "",
                  link: "#",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
