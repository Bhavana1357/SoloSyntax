import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PersonaBar } from './components/PersonaBar';
import { SummaryKPIs } from './components/SummaryKPIs';
import { OpportunitiesList } from './components/OpportunitiesList';
import { BenefitGapGraphView } from './components/BenefitGapGraphView';
import { ActionPlanChecklist } from './components/ActionPlanChecklist';
import { CitizenIntakeWizard } from './components/CitizenIntakeWizard';
import { JanSahayakChat } from './components/JanSahayakChat';
import { ReportModal } from './components/ReportModal';
import { PERSONAS, EMPTY_CITIZEN_TEMPLATE } from './data/personas';
import { evaluateCitizenBenefits } from './engine/benefitGapEngine';
import confetti from 'canvas-confetti';

export function App() {
  const [currentPersonaId, setCurrentPersonaId] = useState('ramesh-farmer');
  const [activeCitizen, setActiveCitizen] = useState(PERSONAS[0]);
  const [activeView, setActiveView] = useState('opportunities'); // 'opportunities' | 'graph' | 'actionplan'
  
  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);

  // Deterministic Benefit Gap Evaluation
  const evaluation = useMemo(() => {
    return evaluateCitizenBenefits(activeCitizen);
  }, [activeCitizen]);

  // Handle selecting a persona archetype
  const handleSelectPersona = (personaId) => {
    setCurrentPersonaId(personaId);
    setCompletedSteps([]);
    if (personaId === 'custom-citizen') {
      setActiveCitizen(EMPTY_CITIZEN_TEMPLATE);
      setIsWizardOpen(true);
    } else {
      const found = PERSONAS.find(p => p.id === personaId);
      if (found) {
        setActiveCitizen({ ...found, registrations: { ...found.registrations } });
      }
    }
  };

  // Handle saving customized citizen intake questionnaire
  const handleSaveCitizen = (updatedCitizen) => {
    setActiveCitizen(updatedCitizen);
    if (currentPersonaId !== 'custom-citizen') {
      setCurrentPersonaId('custom-citizen');
    }
  };

  // Simulate clearing a prerequisite gap
  const handleSimulatePrereqFix = (prereqId) => {
    setActiveCitizen(prev => {
      const nextReg = { ...prev.registrations };
      if (prereqId === 'pre_npci_dbt') nextReg.isNpciDbtMapped = true;
      if (prereqId === 'pre_pmkisan_ekyc') nextReg.hasPmkisanEkyc = true;
      if (prereqId === 'pre_land_seeding') nextReg.isLandSeededPmkisan = true;
      if (prereqId === 'pre_ayushman_card_gen') nextReg.hasAyushmanCard = true;
      if (prereqId === 'pre_ulb_lor') nextReg.hasVendorCertificateOfVending = true;
      if (prereqId === 'pre_birth_cert_name_endorsement') nextReg.hasBirthCertWithLegalName = true;
      if (prereqId === 'pre_nsp_otr') nextReg.hasNspOtr = true;
      if (prereqId === 'pre_samagra_ekyc') nextReg.hasSamagraEkyc = true;
      if (prereqId === 'pre_mgnrega_job_card') nextReg.hasMgnregaJobCard = true;
      if (prereqId === 'pre_gram_sabha_inclusion') nextReg.hasAwaasPlusSurveyEntry = true;
      return { ...prev, registrations: nextReg };
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Toggle checklist steps
  const handleToggleActionStep = (stepId, internalId, isCompleted) => {
    if (isCompleted) {
      setCompletedSteps(prev => [...prev, stepId]);
      if (internalId) {
        handleSimulatePrereqFix(internalId);
      }
    } else {
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  // Quick launch AI with custom prompt
  const handleAskAi = (promptText) => {
    setChatInitialPrompt(promptText);
    setIsChatOpen(true);
  };

  return (
    <div className="pbge-app">
      {/* Top Header */}
      <Header 
        onOpenReport={() => setIsReportOpen(true)}
        onOpenChat={() => {
          setChatInitialPrompt('');
          setIsChatOpen(true);
        }}
        activeView={activeView}
        setActiveView={setActiveView}
        readinessScore={evaluation.summary.readinessScore}
        potentialValue={evaluation.summary.totalPotentialAnnualValue}
      />

      <main className="main-content-layout">
        {/* Persona Bar */}
        <PersonaBar 
          currentPersonaId={currentPersonaId}
          onSelectPersona={handleSelectPersona}
          onOpenIntakeModal={() => setIsWizardOpen(true)}
          activeCitizen={activeCitizen}
        />

        {/* Summary KPIs */}
        <SummaryKPIs 
          summary={evaluation.summary}
          onNavigateActionPlan={() => setActiveView('actionplan')}
        />

        {/* View 1: Benefit Opportunities List */}
        {activeView === 'opportunities' && (
          <OpportunitiesList 
            evaluationResults={evaluation.results}
            onSimulatePrereqFix={handleSimulatePrereqFix}
            onAskAi={handleAskAi}
          />
        )}

        {/* View 2: Benefit Gap Graph */}
        {activeView === 'graph' && (
          <BenefitGapGraphView 
            graphData={evaluation.graphData}
            onSimulateFix={handleSimulatePrereqFix}
            citizen={activeCitizen}
          />
        )}

        {/* View 3: Personalized Action Plan Checklist */}
        {activeView === 'actionplan' && (
          <ActionPlanChecklist 
            actionPlan={evaluation.actionPlan}
            onToggleActionStep={handleToggleActionStep}
            completedSteps={completedSteps}
            onAskAi={handleAskAi}
          />
        )}
      </main>

      {/* Citizen Intake Questionnaire Modal */}
      <CitizenIntakeWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        citizen={activeCitizen}
        onSave={handleSaveCitizen}
      />

      {/* Jan Sahayak AI Chat Advisor Modal */}
      <JanSahayakChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        citizen={activeCitizen}
        evaluation={evaluation}
        initialPrompt={chatInitialPrompt}
      />

      {/* Printable Personal Benefit Gap Audit Report Modal */}
      <ReportModal 
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        citizen={activeCitizen}
        evaluation={evaluation}
      />
    </div>
  );
}

export default App;
