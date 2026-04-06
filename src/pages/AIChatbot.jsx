import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Bot, User, Sparkles, MessageCircle,
  AlertTriangle, RefreshCw, Zap, HelpCircle, Activity, Heart
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import { sendChatMessage } from '../utils/groqChat';

const QUICK_CHIPS = [
  { label: 'What is hypoglycemia?', icon: HelpCircle },
  { label: 'Symptoms of low blood sugar', icon: AlertTriangle },
  { label: 'How does GlucoWave predict drops?', icon: Activity },
  { label: '15-15 rule for emergencies', icon: Zap },
  { label: 'Foods to prevent low glucose', icon: Heart },
  { label: 'What causes hypoglycemia?', icon: Sparkles },
];

function TypingIndicator() {
  return (
    <div className="chatbot-message chatbot-message--bot">
      <div className="chatbot-avatar chatbot-avatar--bot">
        <Bot size={18} />
      </div>
      <div className="chatbot-bubble chatbot-bubble--bot">
        <div className="chatbot-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

function formatMessage(text) {
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="chatbot-md-list">
          {listItems.map((item, i) => <li key={i}>{processInline(item)}</li>)}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const processInline = (line) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    return parts.length > 0 ? parts : line;
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || /^\d+\.\s/.test(trimmed)) {
      inList = true;
      listItems.push(trimmed.replace(/^[-•]\s+/, '').replace(/^\d+\.\s+/, ''));
    } else {
      flushList();
      if (trimmed === '') {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(<p key={`p-${i}`} className="chatbot-md-p">{processInline(trimmed)}</p>);
      }
    }
  });
  flushList();

  return elements;
}

export default function AIChatbot() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    setError(null);

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await sendChatMessage(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      if (err.message === 'GROQ_API_KEY_MISSING') {
        setError('Please add your Groq API key to the .env file (VITE_GROQ_API_KEY).');
      } else if (err.message === 'INVALID_API_KEY') {
        setError('Invalid API key. Please check your Groq API key.');
      } else if (err.message === 'RATE_LIMITED') {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    const lastUserMsgIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMsgIndex === -1) return;
    const idx = messages.length - 1 - lastUserMsgIndex;
    const lastUserMsg = messages[idx];
    setMessages(messages.slice(0, idx));
    setError(null);
    setTimeout(() => handleSend(lastUserMsg.content), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div>
      <Navbar />
      <DashboardLayout>
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <button onClick={() => navigate('/dashboard')} className="chatbot-back-btn" id="chatbot-back-btn">
                <ArrowLeft size={18} />
              </button>
              <div className="chatbot-header-avatar">
                <Bot size={22} />
              </div>
              <div>
                <h1 className="chatbot-header-title">GlucoWave AI</h1>
                <p className="chatbot-header-subtitle">
                  <span className="chatbot-status-dot"></span>
                  Hypoglycemia Expert
                </p>
              </div>
            </div>
            <div className="chatbot-header-badge">
              <Sparkles size={14} />
              Powered by Groq
            </div>
          </div>

          {/* Chat Area */}
          <div className="chatbot-messages" id="chatbot-messages-area">
            {isEmpty && !loading && (
              <div className="chatbot-empty">
                <div className="chatbot-empty-icon">
                  <MessageCircle size={48} />
                </div>
                <h2 className="chatbot-empty-title">Hello! I'm your GlucoWave AI Assistant 👋</h2>
                <p className="chatbot-empty-desc">
                  I'm here to help with everything about <strong>hypoglycemia</strong> — symptoms, causes, prevention, emergency treatment, and how GlucoWave keeps you safe.
                </p>

                {/* Quick Chips */}
                <div className="chatbot-chips">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      className="chatbot-chip"
                      onClick={() => handleSend(chip.label)}
                      id={`chip-${chip.label.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <chip.icon size={14} />
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message chatbot-message--${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                <div className={`chatbot-avatar chatbot-avatar--${msg.role === 'user' ? 'user' : 'bot'}`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`chatbot-bubble chatbot-bubble--${msg.role === 'user' ? 'user' : 'bot'}`}>
                  {msg.role === 'user' ? msg.content : formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {loading && <TypingIndicator />}

            {error && (
              <div className="chatbot-error">
                <AlertTriangle size={16} />
                <span>{error}</span>
                <button onClick={handleRetry} className="chatbot-retry-btn" id="chatbot-retry-btn">
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            {!isEmpty && (
              <div className="chatbot-chips chatbot-chips--inline">
                {QUICK_CHIPS.slice(0, 3).map((chip) => (
                  <button
                    key={chip.label}
                    className="chatbot-chip chatbot-chip--small"
                    onClick={() => handleSend(chip.label)}
                    disabled={loading}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
            <div className="chatbot-input-row">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about hypoglycemia..."
                className="chatbot-input"
                id="chatbot-input"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="chatbot-send-btn"
                id="chatbot-send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
