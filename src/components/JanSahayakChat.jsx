import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  User, 
  ExternalLink, 
  PhoneCall, 
  CheckCircle, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { queryJanSahayak } from '../engine/janSahayakAI';

export function JanSahayakChat({ isOpen, onClose, citizen, evaluation, initialPrompt }) {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Namaste! I am **Jan Sahayak AI**, your Personal Benefit Gap Advisor. I have evaluated ${citizen.name}'s household profile (${citizen.occupation}, ${citizen.state}, annual income ₹${citizen.annualIncome.toLocaleString('en-IN')}).\n\nI can explain why specific schemes matched, why certain prerequisites are blocking your benefits, and how to resolve them officially. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Why is PM-KISAN blocked for me?',
    'How do I check and link my bank account to NPCI for DBT?',
    'What is a Certificate of Vending for PM SVANidhi?',
    'How do I get an Ayushman Golden Card for my family?',
    'Can my children get a scholarship?',
  ];

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (userText) => {
    const textToSend = userText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate RAG reasoning delay
    setTimeout(() => {
      const responseData = queryJanSahayak(textToSend, citizen, evaluation);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseData.answer,
        extraData: responseData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Chat restarted. Ask me anything about ${citizen.name}'s benefits, evidence gaps, or prerequisite blockers.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="modal-backdrop">
      <div className="ai-chat-drawer">
        {/* Chat Drawer Header */}
        <div className="ai-chat-header">
          <div className="ai-header-left">
            <div className="ai-avatar-spark">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="ai-title-row">
                <h4 className="ai-title">Jan Sahayak AI</h4>
                <span className="ai-online-badge">RAG Active</span>
              </div>
              <p className="ai-sub">Official Benefit Rule & Barrier Resolution Advisor</p>
            </div>
          </div>

          <div className="ai-header-actions">
            <button className="btn-ai-header-icon" onClick={handleResetChat} title="Reset Chat">
              <RotateCcw size={16} />
            </button>
            <button className="btn-ai-header-icon" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="suggested-prompts-bar">
          <span className="prompts-label">Suggested Inquiries:</span>
          <div className="prompts-scroll">
            {suggestedQuestions.map((q, idx) => (
              <button 
                key={idx} 
                className="btn-prompt-pill"
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message History */}
        <div className="ai-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
              <div className={`chat-bubble ${msg.sender}`}>
                <div className="bubble-header">
                  <span className="bubble-sender">{msg.sender === 'ai' ? 'Jan Sahayak' : citizen.name}</span>
                  <span className="bubble-time">{msg.timestamp}</span>
                </div>

                <div className="bubble-text">
                  {msg.text.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={i} className="line-bold">{line.replace(/\*\*/g, '')}</strong>;
                    }
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                      return <p key={i} className="numbered-item">{line}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="bullet-item">{line.replace('- ', '')}</li>;
                    }
                    return <p key={i} className="line-paragraph">{line}</p>;
                  })}
                </div>

                {/* Additional Action Card if response has extra data */}
                {msg.extraData && (
                  <div className="bubble-extra-actions">
                    {msg.extraData.actionRequired && (
                      <div className="extra-takeaway">
                        <CheckCircle size={14} className="text-emerald" />
                        <span><strong>Action Required:</strong> {msg.extraData.actionRequired}</span>
                      </div>
                    )}

                    <div className="extra-buttons-row">
                      {msg.extraData.officialLink && (
                        <a 
                          href={msg.extraData.officialLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn-extra-link"
                        >
                          <ExternalLink size={12} />
                          <span>Official Portal</span>
                        </a>
                      )}
                      {msg.extraData.helpline && (
                        <span className="extra-helpline">
                          <PhoneCall size={12} /> {msg.extraData.helpline}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-wrap ai">
              <div className="chat-bubble ai typing-bubble">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="typing-label">Jan Sahayak is consulting official scheme rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="ai-chat-input-bar">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="ai-chat-form"
          >
            <input 
              type="text" 
              placeholder={`Ask any question about ${citizen.name}'s benefits, e-KYC, or prerequisites...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="btn-send-ai" disabled={!inputMessage.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
