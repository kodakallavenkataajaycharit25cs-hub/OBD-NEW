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
  DollarSign
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
      content: 'Hello! I\'m your AI Fleet Assistant. Ask me about driver performance, route profitability, maintenance costs, or any fleet analytics.',
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
      response: 'Based on this month\'s performance, Vikram Patel has the highest score at 9.5/10 with excellent safety ratings and fuel efficiency. He\'s completed 203 trips with zero violations. His fuel efficiency is 16.8 km/l, significantly above fleet average.',
      highlight: 'drivers'
    },
    'driver performance': {
      response: 'This month\'s top drivers: 1) Vikram Patel (9.5/10), 2) Suresh Singh (9.2/10), 3) Ramesh Sharma (8.9/10). Overall fleet average is 8.7/10. Performance factors include safety, fuel efficiency, customer ratings, and punctuality.',
      highlight: 'drivers'
    },
    'mumbai pune route': {
      response: 'Mumbai-Pune route shows excellent profitability: 47 trips completed, ₹1,42,800 profit with 23.4% margin. Average trip cost: ₹2,840 with fuel being 31% of costs. It\'s our most profitable route this month with high demand.',
      highlight: 'costing'
    },
    'route profitability': {
      response: 'Top profitable routes: 1) Mumbai-Goa (28.7% margin), 2) Mumbai-Pune (23.4%), 3) Delhi-Agra (21.8%). Total route revenue is ₹28.5L this month. Mumbai-Goa has highest margin due to premium pricing.',
      highlight: 'costing'
    },
    'maintenance costs': {
      response: 'Last quarter maintenance spending: ₹1,48,600 total. Breakdown: Labor (57%), Parts (29%), Consumables (10%), External services (4%). 8.5% reduction vs previous quarter. Predictive maintenance saved ₹45,000.',
      highlight: 'maintenance'
    },
    'fuel efficiency': {
      response: 'Fleet average fuel efficiency is 14.2 km/l. Best performer: Vikram Patel (16.8 km/l). 3 vehicles showing below-average efficiency need attention. Fuel costs represent 42.5% of total operational expenses.',
      highlight: 'health'
    },
    'safety status': {
      response: 'Current safety status: 3 active alerts, 98.7% safety score. Recent incidents: 1 SOS alert (resolved), 2 speed violations (warnings issued). Average response time: 4.2 minutes.',
      highlight: 'safety'
    },
    'monthly revenue': {
      response: 'Monthly revenue: ₹28,47,600 (+15.2% vs last month). Net profit: ₹11,51,200 (40.4% margin). Outstanding payments: ₹4,56,800. Top revenue source: Corporate bookings (68%).',
      highlight: 'billing'
    },
    'vehicle health': {
      response: 'Fleet health overview: 28 vehicles excellent, 6 need attention, 3 maintenance due, 1 critical. Average vehicle utilization: 89.5%. MH 02 AB 1234 has highest performance score.',
      highlight: 'health'
    },
    'driver violations': {
      response: 'This month: 15 total violations across fleet. Speed violations: 8, Geofence: 4, Extended idling: 3. Suresh Singh has 2 violations, Ramesh Sharma has 4. Training scheduled for repeat offenders.',
      highlight: 'drivers'
    },
    'expense summary': {
      response: 'Monthly expenses: Fuel ₹1,45,680 (42.5%), Driver pay ₹98,450 (28.7%), Maintenance ₹28,500 (8.3%), Tolls ₹34,200 (10%). Total operational cost: ₹3,43,000.',
      highlight: 'expenses'
    },
    'trip analytics': {
      response: 'This month: 234 total trips, average distance 167 km, average duration 3.2 hours. Peak booking hours: 9-11 AM and 6-8 PM. Weekend bookings up 22% vs weekdays.',
      highlight: 'analytics'
    }
  };

  const getAIResponse = (query: string): { response: string; highlight?: string } => {
    const lowerQuery = query.toLowerCase();
    
    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    
    return {
      response: 'I can help you with driver performance, route profitability, maintenance costs, fuel efficiency, safety alerts, and revenue analytics. Try asking about specific metrics or comparisons.',
      highlight: undefined
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputText);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.response,
        timestamp: new Date(),
        highlightSection: aiResponse.highlight
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Highlight relevant section if specified
      if (aiResponse.highlight && onHighlightSection) {
        onHighlightSection(aiResponse.highlight);
      }
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      // Mock voice recognition result
      setTimeout(() => {
        setInputText('Which driver had the best score this month?');
      }, 500);
    } else {
      setIsListening(true);
      // Mock listening for 3 seconds
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const quickQuestions = [
    'Which driver had the best score this month?',
    'Show me route profitability for Mumbai-Pune',
    'How much did we spend on maintenance last quarter?',
    'What\'s our current fuel efficiency?',
    'Any safety alerts I should know about?',
    'What\'s our monthly revenue breakdown?',
    'Show me vehicle health status',
    'How many driver violations this month?',
    'Give me expense summary',
    'Show trip analytics for this month'
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
        >
          <Bot className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Fleet Assistant</h3>
            <p className="text-xs text-gray-400">Powered by Sukrutha AI</p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {message.type === 'assistant' && (
                  <button
                    onClick={() => speakResponse(message.content)}
                    className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-t border-white/20">
        <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-1">
          {quickQuestions.slice(0, 3).map((question, index) => (
            <button
              key={index}
              onClick={() => setInputText(question)}
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              {question.length > 25 ? question.substring(0, 25) + '...' : question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your fleet..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
          </div>
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}