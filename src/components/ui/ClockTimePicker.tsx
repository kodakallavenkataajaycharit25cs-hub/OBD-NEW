import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ClockTimePickerProps {
  value: string; // HH:mm format (24-hour)
  onChange: (value: string) => void;
}

export function ClockTimePicker({ value, onChange }: ClockTimePickerProps) {
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  
  // Parse initial value
  const initialParts = value ? value.split(':') : ['12', '00'];
  const parsedHour24 = parseInt(initialParts[0] || '12', 10);
  const parsedMin = parseInt(initialParts[1] || '0', 10);
  
  const [hour, setHour] = useState<number>(parsedHour24 % 12 || 12);
  const [minute, setMinute] = useState<number>(parsedMin);
  const [isAM, setIsAM] = useState<boolean>(parsedHour24 < 12);

  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Whenever internal state changes, call onChange
    let h24 = hour;
    if (isAM && h24 === 12) h24 = 0;
    if (!isAM && h24 !== 12) h24 += 12;

    const formattedH = h24.toString().padStart(2, '0');
    const formattedM = minute.toString().padStart(2, '0');
    onChange(`${formattedH}:${formattedM}`);
  }, [hour, minute, isAM]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!clockRef.current) return;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hours') {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      setHour(h);
    } else {
      let m = Math.round(angle / 6);
      if (m === 60) m = 0;
      setMinute(m);
    }
  };

  const handlePointerUp = () => {
    if (mode === 'hours') {
      setTimeout(() => setMode('minutes'), 300);
    }
  };

  // Rendering helpers
  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const currentAngle = mode === 'hours' 
    ? (hour === 12 ? 0 : hour * 30) 
    : (minute * 6);

  return (
    <div className="flex flex-col items-center select-none w-[240px] p-2">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <div className="flex gap-1 text-2xl font-light">
          <button 
            className={cn("px-2 py-1 rounded-lg transition-colors", mode === 'hours' ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:bg-white/5")}
            onClick={() => setMode('hours')}
          >
            {hour.toString().padStart(2, '0')}
          </button>
          <span className="py-1 text-gray-500">:</span>
          <button 
            className={cn("px-2 py-1 rounded-lg transition-colors", mode === 'minutes' ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:bg-white/5")}
            onClick={() => setMode('minutes')}
          >
            {minute.toString().padStart(2, '0')}
          </button>
        </div>
        
        <div className="flex flex-col text-sm border border-white/10 rounded-lg overflow-hidden">
          <button 
            className={cn("px-3 py-1 font-bold transition-colors", isAM ? "bg-blue-600 text-white" : "bg-transparent text-gray-400 hover:bg-white/5")}
            onClick={() => setIsAM(true)}
          >
            AM
          </button>
          <button 
            className={cn("px-3 py-1 font-bold transition-colors border-t border-white/10", !isAM ? "bg-blue-600 text-white" : "bg-transparent text-gray-400 hover:bg-white/5")}
            onClick={() => setIsAM(false)}
          >
            PM
          </button>
        </div>
      </div>

      {/* Clock Face */}
      <div 
        ref={clockRef}
        className="relative w-[200px] h-[200px] bg-white/5 border border-white/10 rounded-full cursor-pointer touch-none shadow-inner"
        onMouseDown={handleInteraction}
        onMouseMove={(e) => { if (e.buttons === 1) handleInteraction(e) }}
        onMouseUp={handlePointerUp}
        onTouchStart={handleInteraction}
        onTouchMove={handleInteraction}
        onTouchEnd={handlePointerUp}
      >
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

        {/* Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-[2px] bg-blue-500 origin-bottom z-10 rounded-full transition-transform duration-100 ease-out"
          style={{ 
            height: '38%', 
            transform: `translateX(-50%) rotate(${currentAngle}deg)` 
          }}
        >
          {/* Hand knob */}
          <div className="absolute -top-3 left-1/2 w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Numbers */}
        {(mode === 'hours' ? hours : minutes).map((num, i) => {
          const angle = i * 30;
          const radius = 80; // px distance from center
          const x = Math.sin(angle * (Math.PI / 180)) * radius;
          const y = -Math.cos(angle * (Math.PI / 180)) * radius;
          
          const isSelected = mode === 'hours' ? hour === num : minute === num;

          return (
            <div
              key={num}
              className={cn(
                "absolute top-1/2 left-1/2 w-8 h-8 flex items-center justify-center rounded-full transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium transition-colors z-0 pointer-events-none",
                isSelected ? "text-white" : "text-gray-300"
              )}
              style={{
                marginLeft: `${x}px`,
                marginTop: `${y}px`,
              }}
            >
              {num === 0 && mode === 'minutes' ? '00' : num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
