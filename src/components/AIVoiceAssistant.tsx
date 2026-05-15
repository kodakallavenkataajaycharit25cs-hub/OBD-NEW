import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Bot,
  Volume2,
  VolumeX,
  Sparkles,
  TrendingUp,
  Users,
  Car,
  DollarSign,
  X,
  Brain,
  Zap,
  Activity
} from 'lucide-react';

interface AIVoiceAssistantProps {
  onHighlightSection?: (section: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  highlightSection?: string;
}

export default function AIVoiceAssistant({ onHighlightSection }: AIVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Mission Control AI active. I can assist with fleet logistics, pilot performance, and yield analytics. What are your parameters?',
      timestamp: new Date()
    }
  ]);
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockResponses: Record<string, { response: string; highlight?: string }> = {
    'best driver': {
      response: 'Pilot Vikram Patel is currently lead operative. 9.5 mission score, 203 successful trips, 16.8 km/l efficiency yield. He represents our top structural performer.',
      highlight: 'drivers'
    },
    'driver performance': {
      response: 'Current pilot rankings: 1) Vikram Patel (9.5), 2) Suresh Singh (9.2), 3) Ramesh Sharma (8.9). Fleet safety aggregate at 8.7 protocol level.',
      highlight: 'drivers'
    },
    'mumbai pune route': {
      response: 'Mumbai-Pune sector operational: 47 missions, ₹1,42,800 gross yield, 23.4% margin. Fuel consumption at 31% of mission overhead.',
      highlight: 'costing'
    },
    'route profitability': {
      response: 'High-yield sectors: 1) Mumbai-Goa (28.7%), 2) Mumbai-Pune (23.4%), 3) Delhi-Agra (21.8%). Corporate sector remains the primary revenue driver.',
      highlight: 'costing'
    },
    'maintenance costs': {
      response: 'Quarterly maintenance overhead: ₹1,48,600. Predictive analysis prevented 5 structural failures, saving ₹45,000 in emergency repairs.',
      highlight: 'maintenance'
    },
    'fuel efficiency': {
      response: 'Fleet efficiency at 14.2 km/l nominal. Fuel overhead represents 42.5% of gross operational budget. efficiency revision suggested for 3 nodes.',
      highlight: 'health'
    },
    'safety status': {
      response: 'Safety protocol status: 98.7% nominal. 1 SOS alert successfully resolved. Mean response time for mission incidents: 4.2 minutes.',
      highlight: 'safety'
    },
    'monthly revenue': {
      response: 'Current revenue stream: ₹28,47,600 (+15.2% delta). Corporate authority accounts for 68% of total fleet bookings.',
      highlight: 'billing'
    },
    'vehicle health': {
      response: 'Fleet structural health: 28 units Excellent, 6 Units Alert, 3 Revision Due, 1 Critical Failure recorded. MH 02 AB 1234 leads in health index.',
      highlight: 'health'
    }
  };

  const getAIResponse = (query: string): { response: string; highlight?: string } => {
    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerQuery.includes(key)) return value;
    }
    return {
      response: 'Awaiting valid query sequence. I can analyze pilot stats, route margins, or structural health. Please specify mission parameters.',
      highlight: undefined
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMessage: ChatMessage = { id: Date.now().toString(), type: 'user', content: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText);
      const assistantMessage: ChatMessage = { id: (Date.now() + 1).toString(), type: 'assistant', content: aiResponse.response, timestamp: new Date(), highlightSection: aiResponse.highlight };
      setMessages(prev => [...prev, assistantMessage]);
      if (aiResponse.highlight && onHighlightSection) onHighlightSection(aiResponse.highlight);
    }, 800);
  };

  if (isMinimized) {
    return (
      <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[100]">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex flex-col items-center justify-center py-6 px-3 bg-blue-600 border-none rounded-r-none rounded-l-2xl shadow-[-10px_0_30px_rgba(37,99,235,0.3)] transition-all hover:pr-5 group"
        >
          <div className="relative mb-4">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-blue-600 animate-pulse" />
          </div>
          <span 
            className="text-white text-[10px] font-black uppercase tracking-[0.3em] transform rotate-180" 
            style={{ writingMode: 'vertical-rl' }}
          >
            AI Bubby
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[360px] h-[550px] bg-[#120F17] border-white/10 shadow-3xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/40 border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 border-none flex items-center justify-center shadow-blue-900/40 rounded-2xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter clay-text-3d">AI Bubby</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Intelligence Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-bold leading-relaxed shadow-sm ${message.type === 'user'
                  ? 'clay-card bg-blue-600 text-white border-none shadow-blue-900/20'
                  : 'clay-card bg-black/40 text-gray-300 border-white/5 shadow-inner'
                }`}
            >
              <p className={message.type === 'assistant' ? 'italic' : ''}>{message.content}</p>
              <div className="flex items-center justify-between mt-3 opacity-30 text-[8px] uppercase tracking-widest font-black">
                <span>{message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                {message.type === 'assistant' && (
                  <button className="hover:text-blue-400 transition-colors">
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Terminal */}
      <div className="p-6 bg-black/20 border-t border-white/5 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Awaiting Command..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-[10px] font-black uppercase tracking-widest text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
            <Zap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500/30 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-14 h-14 clay-btn clay-btn-blue p-0 flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Pilot Intel', 'Sector ROI', 'Alert Status'].map((q, i) => (
            <button
              key={i}
              onClick={() => setInputText(q)}
              className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-500 hover:bg-white/10 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}