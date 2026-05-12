import React, { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <div 
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out border border-blue-500/40 bg-blue-500/5 mix-blend-screen"
        style={{ 
          transform: `translate(${position.x - 18}px, ${position.y - 18}px) scale(${isPointer ? 1.8 : isMouseDown ? 0.8 : 1})`,
          backdropFilter: 'blur(1px)'
        }}
      />
      {/* Inner Dot */}
      <div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] transition-transform duration-75 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{ 
          transform: `translate(${position.x - 3}px, ${position.y - 3}px) scale(${isPointer ? 0.5 : 1})`
        }}
      />
    </>
  );
}
