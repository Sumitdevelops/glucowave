import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function ChatbotFAB() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the FAB if we are already on the chatbot page
  if (location.pathname === '/chatbot') return null;

  return (
    <button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300"
      aria-label="Open AI Chatbot"
    >
      <MessageCircle size={28} />
    </button>
  );
}
