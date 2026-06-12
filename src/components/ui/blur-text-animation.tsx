"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

interface BlurTextAnimationProps {
  text?: string;
  words?: WordData[];
  className?: string;
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  animationDelay?: number;
}

export function BlurTextAnimation({
  text = "Elegant blur animation that brings your words to life with cinematic transitions.",
  words,
  className = "",
  fontSize = "text-4xl md:text-5xl lg:text-6xl",
  fontFamily = "font-['Avenir_Next',_'Avenir',_system-ui,_sans-serif]",
  textColor = "text-black", // Changed to light mode
  animationDelay = 4000
}: BlurTextAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const resetTimeoutRef = useRef<NodeJS.Timeout>();

  const textWords = useMemo(() => {
    if (words) return words;
    
    const splitWords = text.split(" ");
    const totalWords = splitWords.length;
    
    return splitWords.map((word, index) => {
      const progress = index / totalWords;
      
      const exponentialDelay = Math.pow(progress, 0.8) * 0.5;
      
      const baseDelay = index * 0.03;
      
      const microVariation = (Math.random() - 0.5) * 0.02;
      
      return {
        text: word,
        duration: 0.5,
        delay: baseDelay + exponentialDelay + microVariation,
        blur: 12 + Math.floor(Math.random() * 8),
        scale: 0.9 + Math.sin(index * 0.2) * 0.05
      };
    });
  }, [text, words]);

  useEffect(() => {
    const startAnimation = () => {
      setTimeout(() => {
        setIsAnimating(true);
      }, 50);
      
      let maxTime = 0;
      textWords.forEach(word => {
        const totalTime = word.delay + word.duration;
        maxTime = Math.max(maxTime, totalTime);
      });
      
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        
        resetTimeoutRef.current = setTimeout(() => {
          startAnimation();
        }, 1000); // Wait 1 second after disappearing before starting the next loop
      }, animationDelay);
    };

    startAnimation();

    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [textWords, animationDelay]);

  return (
    <div className={`flex bg-transparent ${className}`}>
      <p className={`${textColor} ${fontSize} ${fontFamily} font-light leading-relaxed tracking-wide drop-shadow-sm`}>
          {textWords.map((word, index) => (
            <span
              key={index}
              className={`inline-block transition-all ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
              style={{
                transitionDuration: `${word.duration}s`,
                transitionDelay: `${word.delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                filter: isAnimating 
                  ? 'blur(0px) brightness(1)' 
                  : `blur(${word.blur}px) brightness(1.2)`, // Changed brightness for light mode
                transform: isAnimating 
                  ? 'translateY(0) scale(1) rotateX(0deg)' 
                  : `translateY(20px) scale(${word.scale || 1}) rotateX(-15deg)`,
                marginRight: '0.35em',
                willChange: 'filter, transform, opacity',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                textShadow: isAnimating 
                  ? '0 2px 4px rgba(0,0,0,0.05)' // Light shadow
                  : '0 0 20px rgba(0,0,0,0.1)' // Light blur shadow
              }}
            >
              {word.text}
            </span>
          ))}
        </p>
    </div>
  );
}

export function Component() {
  return <BlurTextAnimation />;
}
