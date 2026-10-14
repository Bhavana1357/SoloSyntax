import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  Globe, 
  HelpCircle, 
  CheckCircle2, 
  FileText,
  Layers,
  ChevronDown
} from 'lucide-react';

export function Header({ 
  onOpenReport, 
  onOpenChat, 
  activeView, 
  setActiveView, 
  readinessScore,
  potentialValue 
}) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <header className="pbge-header">
      {/* Top Gov Tricolor Ribbon */}
      <div className="tricolor-ribbon">
        <div className="tricolor-saffron" />
        <div className="tricolor-white" />
        <div className="tricolor-green" />
      </div>

      <div className="header-container">
        {/* Brand & Emblem */}
        <div className="header-brand">
          <div className="brand-logo-wrap">
            <img 
              src="/logo.png" 
              alt="Personal Benefit Gap Engine Logo" 
              className="brand-logo" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="brand-logo-fallback">PBGE</div>
          </div>
          <div className="brand-titles">
            <div className="brand-badge-row">
              <span className="gov-tag">AI Innovation Challenge · India</span>
              <span className="status-live-dot"><span className="pulse-dot"></span> Active Engine v2.4</span>
            </div>
            <h1 className="brand-title">
              Personal Benefit Gap Engine <span className="brand-acronym">(PBGE)</span>
            </h1>
            <p className="brand-subtitle">
              Resolving the barriers between potential citizen eligibility and successful benefit delivery
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="header-nav">
          <button 
            className={`nav-tab ${activeView === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveView('opportunities')}
          >
            <ShieldCheck size={16} />
            <span>Benefit Opportunities</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveView('graph')}
          >
            <Layers size={16} />
            <span>Benefit Gap Graph</span>
            <span className="graph-tag">Interactive</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'actionplan' ? 'active' : ''}`}
            onClick={() => setActiveView('actionplan')}
          >
            <CheckCircle2 size={16} />
            <span>Action Roadmap</span>
            <span className="readiness-mini-badge">{readinessScore}% Ready</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* AI Advisor Button */}
          <button 
            className="btn-ai-spark"
            onClick={onOpenChat}
            title="Open Jan Sahayak AI Assistant"
          >
            <Sparkles size={16} className="spark-spin" />
            <span className="btn-ai-text">Jan Sahayak AI</span>
          </button>

          {/* Export Report Button */}
          <button 
            className="btn-report-export"
            onClick={onOpenReport}
            title="Generate Official Benefit Gap Audit Report"
          >
            <Printer size={16} />
            <span className="export-text">Print Report</span>
          </button>

          {/* Language Selector */}
          <div className="lang-dropdown-wrapper">
            <button 
              className="btn-lang-selector"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              title="Change Language"
            >
              <Globe size={15} />
              <span>{languages.find(l => l.code === selectedLang)?.native}</span>
              <ChevronDown size={13} />
            </button>
            {langMenuOpen && (
              <div className="lang-menu">
                {languages.map(l => (
                  <button
                    key={l.code}
                    className={`lang-option ${selectedLang === l.code ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setLangMenuOpen(false);
                    }}
                  >
                    <span className="lang-name">{l.native}</span>
                    <span className="lang-sub">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
