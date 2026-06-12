import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AboutUsSection from './ui/about-us-section';

interface AboutPageProps {
  onLoginClick: () => void;
}

export default function AboutPage({ onLoginClick }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={onLoginClick} />
      
      <main className="pt-16">
        <AboutUsSection />
      </main>

      <Footer />
    </div>
  );
}
