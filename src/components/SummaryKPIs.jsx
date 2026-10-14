import React from 'react';
import { 
  ShieldAlert, 
  IndianRupee, 
  CheckCircle, 
  FileQuestion, 
  TrendingUp, 
  ArrowRight,
  Unlock,
  AlertOctagon
} from 'lucide-react';

export function SummaryKPIs({ summary, onNavigateActionPlan }) {
  const {
    potentialMatchesCount,
    readyCount,
    blockedCount,
    totalPotentialAnnualValue,
    readyAnnualValue,
    readinessScore,
    prerequisitesCount,
    evidenceGapsCount,
  } = summary;

  return (
    <div className="summary-kpis-grid">
      {/* Card 1: Potential Opportunities */}
      <div className="kpi-card highlight-blue">
        <div className="kpi-top">
          <span className="kpi-label">Potential Opportunities</span>
          <span className="kpi-icon-badge blue">
            <TrendingUp size={16} />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number">{potentialMatchesCount}</span>
          <span className="kpi-subtext">Schemes Identified</span>
        </div>
        <div className="kpi-meta-split">
          <span className="kpi-ready-badge">
            <CheckCircle size={12} /> {readyCount} Ready Now
          </span>
          <span className="kpi-blocked-badge">
            <AlertOctagon size={12} /> {blockedCount} Blocked by Gaps
          </span>
        </div>
      </div>

      {/* Card 2: Potential Financial Benefit Value */}
      <div className="kpi-card highlight-emerald">
        <div className="kpi-top">
          <span className="kpi-label">Potential Benefit Value</span>
          <span className="kpi-icon-badge emerald">
            <IndianRupee size={16} />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number">
            ₹{(totalPotentialAnnualValue / 1000).toLocaleString('en-IN')}k
          </span>
          <span className="kpi-subtext">/ year total package</span>
        </div>
        <p className="kpi-hint">
          Includes direct cash DBT, health assurance (₹5L), and credit subsidies.
        </p>
      </div>

      {/* Card 3: Prerequisite Blockers */}
      <div className="kpi-card highlight-rose">
        <div className="kpi-top">
          <span className="kpi-label">Systemic Prerequisite Gaps</span>
          <span className="kpi-icon-badge rose">
            <ShieldAlert size={16} />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number text-rose">{prerequisitesCount}</span>
          <span className="kpi-subtext">Action Blockers</span>
        </div>
        <p className="kpi-hint">
          {prerequisitesCount > 0 
            ? 'Must be cleared before portal submission or PFMS bank disbursement.'
            : 'All systemic prerequisites are clear!'}
        </p>
      </div>

      {/* Card 4: Evidence Gaps */}
      <div className="kpi-card highlight-amber">
        <div className="kpi-top">
          <span className="kpi-label">Evidence Gaps</span>
          <span className="kpi-icon-badge amber">
            <FileQuestion size={16} />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-number text-amber">{evidenceGapsCount}</span>
          <span className="kpi-subtext">Documents Needed</span>
        </div>
        <p className="kpi-hint">
          Required certificates (Income, RoR, etc.) available via DigiLocker / e-District.
        </p>
      </div>

      {/* Card 5: Readiness Gauge */}
      <div className="kpi-card readiness-card" onClick={onNavigateActionPlan}>
        <div className="readiness-inner">
          <div className="readiness-circle-wrap">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle-fill"
                strokeDasharray={`${readinessScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="circle-percentage">{readinessScore}%</text>
            </svg>
          </div>
          <div className="readiness-text-group">
            <span className="readiness-title">Benefit Readiness</span>
            <span className="readiness-cta">
              View Action Plan <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
