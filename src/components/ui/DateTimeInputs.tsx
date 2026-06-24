import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from './calendar';
import { ClockTimePicker } from './ClockTimePicker';
import { Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';

interface CustomDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export function CustomDateInput({ value, className, onChange, ...props }: CustomDateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayValue = value 
    ? value.split('-').reverse().join('/') // turns YYYY-MM-DD to DD/MM/YYYY
    : '';

  const selectedDate = value ? parseISO(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      // Create a fake event object to maintain compatibility with existing handlers
      onChange({ target: { value: formattedDate } } as any);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full focus:outline-none ${className || ''} ${!displayValue ? 'text-gray-400' : ''}`}
        disabled={props.disabled}
      >
        {displayValue || 'dd/mm/yyyy'}
        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-[#120F17] border border-white/10 shadow-2xl rounded-xl p-2 top-full left-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            className="text-white"
            disabled={{ before: new Date(new Date().setHours(0,0,0,0)) }}
          />
        </div>
      )}
    </div>
  );
}

export function CustomTimeInput({ value, className, onChange, ...props }: CustomDateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close clock if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (newTime: string) => {
    if (onChange) {
      onChange({ target: { value: newTime } } as any);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full focus:outline-none ${className || ''} ${!value ? 'text-gray-400' : ''}`}
        disabled={props.disabled}
      >
        {value || '--:--'}
        <ClockIcon className="w-4 h-4 ml-auto opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-[#120F17] border border-white/10 shadow-2xl rounded-xl top-full right-0 origin-top-right">
          <ClockTimePicker
            value={value}
            onChange={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
