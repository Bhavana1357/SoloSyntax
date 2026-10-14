import React from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Building, 
  CheckSquare, 
  Square,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ActionPlanChecklist({ actionPlan, onToggleActionStep, completedSteps, onAskAi }) {
  const { allSteps, phase1, phase2, phase3 } = actionPlan;

  const handleStepClick = (step) => {
    const isCompleted = completedSteps.includes(step.id);
    onToggleActionStep(step.id, step.internalId, !isCompleted);

    if (!isCompleted) {
      // Fire confetti celebration!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const completedCount = allSteps.filter(s => completedSteps.includes(s.id)).length;
  const progressPercent = allSteps.length > 0 ? Math.round((completedCount / allSteps.length) * 100) : 0;

  return (
    <div className="action-plan-wrapper">
      {/* Top Banner */}
      <div className="action-plan-header">
        <div className="action-header-left">
          <div className="action-tag">
            <CheckCircle2 size={14} />
            <span>Personalized Benefit Action Plan</span>
          </div>
          <h3 className="action-title">Gap Resolution Roadmap & Official Action Checklist</h3>
          <p className="action-desc">
            Follow this sequenced critical path to resolve foundational blockers first, collect verified evidence, and submit official applications.
          </p>
        </div>

        <div className="action-progress-box">
          <div className="progress-labels">
            <span>Overall Roadmap Progress</span>
            <strong>{completedCount} of {allSteps.length} Steps Completed ({progressPercent}%)</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* PHASE 1: Foundational Prerequisites */}
      {phase1.length > 0 && (
        <div className="action-phase-block phase-1">
          <div className="phase-header">
            <div className="phase-badge phase-1-badge">PHASE 1 · CRITICAL UNBLOCKERS</div>
            <h4 className="phase-title">Systemic & Digital Prerequisites</h4>
            <p className="phase-desc">
              High-impact dependencies: Resolving these foundational actions unblocks multiple schemes simultaneously.
            </p>
          </div>

          <div className="phase-steps-list">
            {phase1.map((step) => {
              const isDone = completedSteps.includes(step.id);
              return (
                <div key={step.id} className={`action-step-card ${isDone ? 'completed' : ''}`}>
                  <div className="step-check-col" onClick={() => handleStepClick(step)}>
                    <button className={`btn-step-check ${isDone ? 'checked' : ''}`}>
                      {isDone ? <CheckCircle2 size={20} className="check-icon-active" /> : <Square size={20} />}
                    </button>
                    <span className="step-num-pill">Step {step.stepNumber}</span>
                  </div>

                  <div className="step-main-content">
                    <div className="step-title-row">
                      <h5 className={`step-title ${isDone ? 'strikethrough' : ''}`}>{step.title}</h5>
                      <span className="unblock-schemes-badge">
                        Unblocks: {step.unblocksSchemes.join(', ')}
                      </span>
                    </div>

                    <p className="step-desc">{step.description}</p>

                    <div className="step-why-banner">
                      <strong>Why this matters:</strong> {step.whyItMatters}
                    </div>

                    <div className="step-resolution-instructions">
                      <strong>Action Steps:</strong> {step.resolutionSteps}
                    </div>

                    <div className="step-footer-actions">
                      {step.actionUrl && (
                        <a 
                          href={step.actionUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-step-action-url"
                        >
                          <ExternalLink size={13} />
                          <span>{step.actionLabel || 'Visit Official Resolution Portal'}</span>
                        </a>
                      )}

                      <button 
                        className="btn-step-ai-help"
                        onClick={() => onAskAi(`How do I resolve this prerequisite: "${step.title}"? Explain the exact official procedure.`)}
                      >
                        <Sparkles size={13} />
                        <span>Ask AI for Guidance</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 2: Evidence Verification */}
      {phase2.length > 0 && (
        <div className="action-phase-block phase-2">
          <div className="phase-header">
            <div className="phase-badge phase-2-badge">PHASE 2 · DOCUMENT PROCUREMENT</div>
            <h4 className="phase-title">Evidence & Certificate Verification</h4>
            <p className="phase-desc">
              Obtain or verify digital certificates from issuing authorities (e-District, Revenue, DigiLocker).
            </p>
          </div>

          <div className="phase-steps-list">
            {phase2.map((step) => {
              const isDone = completedSteps.includes(step.id);
              return (
                <div key={step.id} className={`action-step-card ${isDone ? 'completed' : ''}`}>
                  <div className="step-check-col" onClick={() => handleStepClick(step)}>
                    <button className={`btn-step-check ${isDone ? 'checked' : ''}`}>
                      {isDone ? <CheckCircle2 size={20} className="check-icon-active" /> : <Square size={20} />}
                    </button>
                    <span className="step-num-pill">Step {step.stepNumber}</span>
                  </div>

                  <div className="step-main-content">
                    <div className="step-title-row">
                      <h5 className={`step-title ${isDone ? 'strikethrough' : ''}`}>{step.title}</h5>
                      <span className="unblock-schemes-badge amber">
                        For: {step.unblocksSchemes.join(', ')}
                      </span>
                    </div>

                    <p className="step-desc">{step.description}</p>
                    <div className="step-resolution-instructions">
                      <strong>How to obtain:</strong> {step.resolutionSteps}
                    </div>

                    <div className="step-footer-actions">
                      <a 
                        href={step.actionUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-step-action-url"
                      >
                        <ExternalLink size={13} />
                        <span>{step.actionLabel}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 3: Formal Scheme Applications */}
      <div className="action-phase-block phase-3">
        <div className="phase-header">
          <div className="phase-badge phase-3-badge">PHASE 3 · SUBMISSION & DISBURSEMENT</div>
          <h4 className="phase-title">Official Portal Application Submission</h4>
          <p className="phase-desc">
            Submit formal applications on verified central and state portals once prerequisites and evidence are ready.
          </p>
        </div>

        <div className="phase-steps-list">
          {phase3.map((step) => {
            const isDone = completedSteps.includes(step.id);
            return (
              <div key={step.id} className={`action-step-card ${isDone ? 'completed' : ''}`}>
                <div className="step-check-col" onClick={() => handleStepClick(step)}>
                  <button className={`btn-step-check ${isDone ? 'checked' : ''}`}>
                    {isDone ? <CheckCircle2 size={20} className="check-icon-active" /> : <Square size={20} />}
                  </button>
                  <span className="step-num-pill">Step {step.stepNumber}</span>
                </div>

                <div className="step-main-content">
                  <div className="step-title-row">
                    <h5 className={`step-title ${isDone ? 'strikethrough' : ''}`}>{step.title}</h5>
                    <span className={`readiness-indicator ${step.isReady ? 'ready' : 'gaps'}`}>
                      {step.isReady ? 'Ready for Instant Submission' : 'Gaps Pending Above'}
                    </span>
                  </div>

                  <p className="step-desc">{step.description}</p>
                  <p className="step-sub-inst">{step.resolutionSteps}</p>

                  <div className="step-footer-actions">
                    <a 
                      href={step.actionUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-step-apply-now"
                    >
                      <ExternalLink size={13} />
                      <span>{step.actionLabel}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
