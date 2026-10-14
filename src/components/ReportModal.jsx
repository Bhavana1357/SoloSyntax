import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Calendar, User, FileText, Check } from 'lucide-react';

export function ReportModal({ isOpen, onClose, citizen, evaluation }) {
  if (!isOpen) return null;

  const { results, summary, actionPlan } = evaluation;
  const eligibleSchemes = results.filter(r => r.status !== 'NOT_ELIGIBLE');
  const reportRef = `PBGE-IN-${citizen.state.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop report-backdrop">
      <div className="report-modal-wrapper">
        {/* Floating Print Bar (Hidden on print) */}
        <div className="report-actions-bar no-print">
          <div className="report-bar-left">
            <span className="report-status-badge">Official Audit Preview</span>
            <span className="report-id-text">Reference ID: {reportRef}</span>
          </div>
          <div className="report-bar-right">
            <button className="btn-print-trigger" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>
            <button className="btn-report-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="printable-report-sheet" id="printable-report">
          {/* Header */}
          <div className="report-doc-header">
            <div className="report-header-emblem-wrap">
              <img 
                src="/logo.png" 
                alt="PBGE Emblem" 
                className="report-emblem" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className="report-org-title">Personal Benefit Gap Engine (PBGE)</h1>
                <p className="report-org-subtitle">
                  AI Innovation Challenge · Government Schemes · India-Wide
                </p>
                <p className="report-gazette-tag">Automated Benefit Barrier Identification & Resolution Audit</p>
              </div>
            </div>

            <div className="report-meta-box">
              <div className="meta-line"><strong>Report Ref:</strong> {reportRef}</div>
              <div className="meta-line"><strong>Audit Date:</strong> {currentDate}</div>
              <div className="meta-line"><strong>Engine Version:</strong> PBGE Core v2.4</div>
              <div className="meta-line"><strong>Jurisdiction:</strong> {citizen.state}, India</div>
            </div>
          </div>

          <div className="report-divider"></div>

          {/* Section 1: Citizen Profile Summary */}
          <div className="report-section">
            <h2 className="report-section-heading">1. Citizen Household Circumstances & Ground Facts</h2>
            <div className="citizen-facts-table">
              <div className="table-row">
                <span className="cell-label">Citizen Name:</span>
                <span className="cell-value"><strong>{citizen.name}</strong> ({citizen.gender}, {citizen.age} yrs)</span>
                <span className="cell-label">Primary Occupation:</span>
                <span className="cell-value">{citizen.occupation}</span>
              </div>
              <div className="table-row">
                <span className="cell-label">Location:</span>
                <span className="cell-value">{citizen.state} ({citizen.location})</span>
                <span className="cell-label">Social Category:</span>
                <span className="cell-value">{citizen.category}</span>
              </div>
              <div className="table-row">
                <span className="cell-label">Cultivable Landholding:</span>
                <span className="cell-value">{citizen.landHoldingAcres > 0 ? `${citizen.landHoldingAcres} Acres` : 'Landless'}</span>
                <span className="cell-label">Annual Household Income:</span>
                <span className="cell-value">₹{citizen.annualIncome.toLocaleString('en-IN')} / year</span>
              </div>
              <div className="table-row">
                <span className="cell-label">Ration Card Type:</span>
                <span className="cell-value">{citizen.rationCardType}</span>
                <span className="cell-label">Housing Type:</span>
                <span className="cell-value">{citizen.housingType}</span>
              </div>
              <div className="table-row full-width">
                <span className="cell-label">Household Members ({citizen.familyMembers.length}):</span>
                <span className="cell-value">
                  {citizen.familyMembers.map(m => `${m.relation} - ${m.name || 'Dependent'} (${m.age}y${m.studentClass ? `, ${m.studentClass}` : ''})`).join(' | ')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Executive Summary & Readiness */}
          <div className="report-section">
            <h2 className="report-section-heading">2. Benefit Gap Audit Summary</h2>
            <div className="report-kpi-summary-strip">
              <div className="kpi-mini-card">
                <span className="kpi-mini-val">{summary.potentialMatchesCount}</span>
                <span className="kpi-mini-lbl">Potential Schemes</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-mini-val">₹{(summary.totalPotentialAnnualValue / 1000).toLocaleString('en-IN')}k</span>
                <span className="kpi-mini-lbl">Potential Value / Year</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-mini-val text-rose">{summary.prerequisitesCount}</span>
                <span className="kpi-mini-lbl">Prerequisite Blockers</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-mini-val text-amber">{summary.evidenceGapsCount}</span>
                <span className="kpi-mini-lbl">Evidence Gaps</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-mini-val text-emerald">{summary.readinessScore}%</span>
                <span className="kpi-mini-lbl">Readiness Score</span>
              </div>
            </div>
          </div>

          {/* Section 3: Potential Opportunities & Gap Diagnosis */}
          <div className="report-section">
            <h2 className="report-section-heading">3. Detailed Scheme Gap Diagnosis & Match Explanations</h2>
            <div className="report-schemes-breakdown">
              {eligibleSchemes.map((evalResult, idx) => {
                const { scheme, status, statusLabel, positiveMatches, unresolvedPrerequisites, unresolvedEvidence } = evalResult;
                const isBlocked = status === 'ACTION_BLOCKED';
                const isReady = status === 'READY_TO_APPLY';

                return (
                  <div key={scheme.id} className="report-scheme-item">
                    <div className="scheme-item-header">
                      <div className="scheme-name-col">
                        <span className="opp-num-tag">Opportunity {idx + 1}</span>
                        <h3 className="scheme-title-text">{scheme.name}</h3>
                        <span className="scheme-ministry-text">{scheme.ministry} · {scheme.benefitAmount}</span>
                      </div>
                      <div className={`scheme-report-status ${isReady ? 'ready' : isBlocked ? 'blocked' : 'pending'}`}>
                        {statusLabel}
                      </div>
                    </div>

                    <div className="report-match-reasons">
                      <strong>Why match was identified:</strong>
                      <ul>
                        {positiveMatches.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {unresolvedPrerequisites.length > 0 && (
                      <div className="report-gap-block prereq-block">
                        <span className="block-title text-rose">Missing Prerequisite Barriers:</span>
                        {unresolvedPrerequisites.map((p) => (
                          <div key={p.id} className="report-subgap">
                            <span className="subgap-name">• {p.title}</span>
                            <span className="subgap-why">{p.whyItBlocks}</span>
                            <span className="subgap-how"><strong>Next Step:</strong> {p.resolutionSteps}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {unresolvedEvidence.length > 0 && (
                      <div className="report-gap-block evidence-block">
                        <span className="block-title text-amber">Missing Evidence Gaps:</span>
                        {unresolvedEvidence.map((e) => (
                          <div key={e.id} className="report-subgap">
                            <span className="subgap-name">• {e.title} ({e.authority})</span>
                            <span className="subgap-how"><strong>Next Step:</strong> {e.actionText} via {e.sourcePortal}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="report-official-link-row">
                      <span>Official Link: <strong>{scheme.officialPortal}</strong></span>
                      <span>Mode: {scheme.applicationMode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Personalized Action Plan */}
          <div className="report-section">
            <h2 className="report-section-heading">4. Recommended Sequenced Action Plan</h2>
            <div className="report-action-table">
              <div className="action-table-header">
                <span className="col-st">Step</span>
                <span className="col-act">Action Item</span>
                <span className="col-unb">Unblocks Schemes</span>
                <span className="col-auth">Official Authority / Channel</span>
              </div>
              {actionPlan.allSteps.map((step, idx) => (
                <div key={step.id} className="action-table-row">
                  <span className="col-st"><strong>#{idx + 1}</strong></span>
                  <span className="col-act">
                    <strong>{step.title}</strong>
                    <p className="step-tbl-desc">{step.resolutionSteps}</p>
                  </span>
                  <span className="col-unb">{step.unblocksSchemes.join(', ')}</span>
                  <span className="col-auth">{step.actionLabel || 'Official Portal'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Legal Disclaimer & Signoff */}
          <div className="report-disclaimer-box">
            <h4>Important Notice & Disclaimer</h4>
            <p>
              This Personal Benefit Gap Report is generated for informational and barrier-resolution guidance purposes under the AI Innovation Challenge. 
              These recommendations do not establish statutory eligibility for any particular scheme. Actual sanction of benefits is subject to official verification 
              of physical original documents, biometric authentication, and budget allocation by respective Central/State government departments.
            </p>
          </div>

          <div className="report-footer-signatures">
            <div className="sig-block">
              <div className="sig-line"></div>
              <span>Citizen Acknowledgement</span>
            </div>
            <div className="sig-block">
              <div className="sig-stamp">PBGE AI AUDIT VERIFIED</div>
              <span>PBGE AI Engine Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
