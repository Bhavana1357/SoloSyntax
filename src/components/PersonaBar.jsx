import React from 'react';
import { User, Edit3, MapPin, Briefcase, IndianRupee, AlertCircle, PlusCircle } from 'lucide-react';
import { PERSONAS } from '../data/personas';

export function PersonaBar({ 
  currentPersonaId, 
  onSelectPersona, 
  onOpenIntakeModal,
  activeCitizen 
}) {
  return (
    <div className="persona-bar-section">
      <div className="persona-bar-header">
        <div className="persona-title-group">
          <span className="persona-section-eyebrow">Select Citizen Archetype</span>
          <h2 className="persona-section-title">
            Household Scenarios & Ground Truth Profiles
          </h2>
        </div>
        <button 
          className="btn-custom-intake"
          onClick={onOpenIntakeModal}
        >
          <Edit3 size={15} />
          <span>{currentPersonaId === 'custom-citizen' ? 'Edit Custom Profile' : 'Customize / New Citizen Intake'}</span>
        </button>
      </div>

      <div className="persona-cards-grid">
        {PERSONAS.map(persona => {
          const isSelected = currentPersonaId === persona.id;
          return (
            <div 
              key={persona.id}
              className={`persona-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectPersona(persona.id)}
            >
              <div className="persona-card-top">
                <span className="persona-avatar">{persona.avatar}</span>
                <div className="persona-meta">
                  <span className="persona-name">{persona.name}</span>
                  <span className="persona-hindi-name">{persona.hindiName}</span>
                </div>
                {isSelected && <span className="active-tag">Active</span>}
              </div>

              <p className="persona-tagline">{persona.tagline}</p>

              <div className="persona-chips">
                <span className="p-chip">
                  <MapPin size={12} /> {persona.state} ({persona.location})
                </span>
                <span className="p-chip">
                  <Briefcase size={12} /> {persona.occupation}
                </span>
                <span className="p-chip">
                  <IndianRupee size={12} /> ₹{(persona.annualIncome / 1000).toFixed(0)}k/yr
                </span>
              </div>

              <div className="persona-gap-callout">
                <AlertCircle size={13} className="gap-icon" />
                <span className="gap-text">
                  {persona.id === 'ramesh-farmer' && 'Blocked: Bank NPCI DBT unmapped & e-KYC missing'}
                  {persona.id === 'sunita-vendor' && 'Blocked: ULB Vending Certificate (CoV) missing'}
                  {persona.id === 'priya-student' && 'Blocked: NSP OTR & Student Bank DBT required'}
                  {persona.id === 'rajesh-mp' && 'Blocked: Samagra e-KYC & Awaas+ list entry'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Custom Persona Card */}
        <div 
          className={`persona-card custom-card ${currentPersonaId === 'custom-citizen' ? 'selected' : ''}`}
          onClick={() => {
            if (currentPersonaId !== 'custom-citizen') {
              onSelectPersona('custom-citizen');
            } else {
              onOpenIntakeModal();
            }
          }}
        >
          <div className="persona-card-top">
            <span className="persona-avatar">✍️</span>
            <div className="persona-meta">
              <span className="persona-name">
                {currentPersonaId === 'custom-citizen' ? activeCitizen.name : 'Custom Citizen'}
              </span>
              <span className="persona-hindi-name">कस्टम नागरिक</span>
            </div>
            {currentPersonaId === 'custom-citizen' && <span className="active-tag">Active</span>}
          </div>

          <p className="persona-tagline">
            {currentPersonaId === 'custom-citizen' 
              ? `${activeCitizen.occupation} · ${activeCitizen.state} · ₹${(activeCitizen.annualIncome / 1000).toFixed(0)}k/yr`
              : 'Enter custom household facts, landholding, and certificates'}
          </p>

          <div className="custom-card-action">
            <PlusCircle size={15} />
            <span>{currentPersonaId === 'custom-citizen' ? 'Modify Questionnaire' : 'Build Custom Profile'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
