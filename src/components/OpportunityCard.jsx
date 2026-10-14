import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Building, 
  Calendar, 
  IndianRupee, 
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  HelpCircle
} from 'lucide-react';

export function OpportunityCard({ evaluation, onSimulatePrereqFix, onAskAi }) {
  const [expanded, setExpanded] = useState(false);
  const { scheme, status, statusLabel, badgeColor, positiveMatches, negativeReasons, unresolvedPrerequisites, unresolvedEvidence } = evaluation;

  const isReady = status === 'READY_TO_APPLY';
  const isBlocked = status === 'ACTION_BLOCKED';
  const isPendingDoc = status === 'POTENTIAL_WITH_GAPS';
  const isNotEligible = status === 'NOT_ELIGIBLE';

  return (
    <div className={`opp-card ${status.toLowerCase()}`}>
      <div className="opp-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="opp-header-left">
          <div className="opp-badge-row">
            <span className="opp-category-tag">{scheme.category}</span>
            <span className="opp-level-tag">{scheme.level} · {scheme.state}</span>
            
            {/* Status Badge */}
            <span className={`opp-status-pill ${badgeColor}`}>
              {isReady && <CheckCircle2 size={12} />}
              {isBlocked && <ShieldAlert size={12} />}
              {isPendingDoc && <AlertTriangle size={12} />}
              <span>{statusLabel}</span>
            </span>
          </div>

          <h3 className="opp-scheme-name">
            {scheme.name}
          </h3>
          <span className="opp-hindi-name">{scheme.hindiName}</span>
          <p className="opp-ministry">
            <Building size={13} /> {scheme.ministry}
          </p>
        </div>

        <div className="opp-header-right">
          <div className="opp-value-box">
            <span className="opp-val-label">Target Benefit</span>
            <span className="opp-val-amount">{scheme.benefitAmount}</span>
          </div>
          <button 
            type="button" 
            className="btn-toggle-expand"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Quick Gap Summary Bar */}
      {(unresolvedPrerequisites.length > 0 || unresolvedEvidence.length > 0) && (
        <div className="opp-gap-summary-bar">
          <div className="gap-bar-counts">
            {unresolvedPrerequisites.length > 0 && (
              <span className="gap-pill-red">
                <ShieldAlert size={12} /> {unresolvedPrerequisites.length} Prerequisite Blocker{unresolvedPrerequisites.length > 1 ? 's' : ''}
              </span>
            )}
            {unresolvedEvidence.length > 0 && (
              <span className="gap-pill-amber">
                <FileText size={12} /> {unresolvedEvidence.length} Document Gap{unresolvedEvidence.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <span className="gap-bar-hint">
            {unresolvedPrerequisites.length > 0 
              ? `Action required before payout: ${unresolvedPrerequisites[0].title}`
              : `Missing verification: ${unresolvedEvidence[0].title}`}
          </span>
        </div>
      )}

      {/* Expanded Details Body */}
      {expanded && (
        <div className="opp-card-body">
          {/* Section 1: Why Citizen Matched */}
          <div className="opp-body-section">
            <h4 className="section-heading text-emerald">
              <CheckCircle2 size={15} />
              <span>Why Your Household Matched This Scheme</span>
            </h4>
            <ul className="positive-matches-list">
              {positiveMatches.map((m, idx) => (
                <li key={idx}>
                  <span className="bullet-check">✓</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Prerequisite Blockers (The Heart of PBGE) */}
          {unresolvedPrerequisites.length > 0 && (
            <div className="opp-body-section">
              <h4 className="section-heading text-rose">
                <ShieldAlert size={15} />
                <span>Critical Prerequisite Dependencies (Action Blockers)</span>
              </h4>
              <p className="section-subtext">
                These conditions must be resolved first. Applying without completing these prerequisites leads to silent rejection or rejected bank credits.
              </p>

              <div className="prereq-cards-container">
                {unresolvedPrerequisites.map((p) => (
                  <div key={p.id} className="prereq-item-card">
                    <div className="prereq-item-header">
                      <div className="prereq-title-row">
                        <span className="prereq-name">{p.title}</span>
                        <span className="prereq-sev-badge">{p.severity} Severity</span>
                      </div>
                      <p className="prereq-desc">{p.description}</p>
                    </div>

                    <div className="prereq-why-box">
                      <strong>Why this blocks your benefit:</strong> {p.whyItBlocks}
                    </div>

                    <div className="prereq-resolution-box">
                      <strong>Official Resolution Steps:</strong> {p.resolutionSteps}
                    </div>

                    <div className="prereq-actions-row">
                      {p.resolutionUrl && (
                        <a 
                          href={p.resolutionUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-prereq-official"
                        >
                          <ExternalLink size={13} />
                          <span>{p.actionLabel || 'Resolve on Official Portal'}</span>
                        </a>
                      )}
                      <button 
                        className="btn-quick-resolve"
                        onClick={() => onSimulatePrereqFix(p.id)}
                      >
                        <span>Simulate Resolved</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Evidence Gaps */}
          {unresolvedEvidence.length > 0 && (
            <div className="opp-body-section">
              <h4 className="section-heading text-amber">
                <FileText size={15} />
                <span>Evidence Gaps (Documents to Confirm / Renew)</span>
              </h4>
              <div className="evidence-grid">
                {unresolvedEvidence.map((e) => (
                  <div key={e.id} className="evidence-item-card">
                    <span className="evidence-authority">{e.authority}</span>
                    <span className="evidence-title">{e.title}</span>
                    <p className="evidence-desc">{e.description}</p>
                    <div className="evidence-action-row">
                      <span className="evidence-how">Action: {e.actionText}</span>
                      <a 
                        href={e.sourcePortal.startsWith('http') ? e.sourcePortal : 'https://www.digilocker.gov.in'}
                        target="_blank"
                        rel="noreferrer"
                        className="evidence-link"
                      >
                        <ExternalLink size={12} /> {e.sourcePortal.startsWith('http') ? 'Portal' : 'DigiLocker'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="opp-body-footer">
            <div className="footer-meta-info">
              <span className="meta-pill"><Clock size={12} /> Processing: {scheme.processingTime}</span>
              <span className="meta-pill">Mode: {scheme.applicationMode}</span>
            </div>

            <div className="footer-button-group">
              <button 
                className="btn-ask-ai-scheme"
                onClick={() => onAskAi(`Explain scheme rules and my specific barriers for ${scheme.shortName}`)}
              >
                <Sparkles size={13} />
                <span>Ask AI About This Scheme</span>
              </button>

              <a 
                href={scheme.officialPortal} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-open-scheme-portal"
              >
                <ExternalLink size={14} />
                <span>Open {scheme.portalName}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
