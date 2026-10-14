import React, { useState } from 'react';
import { X, Check, AlertTriangle, FileText, User, Building, Heart, Sparkles, RefreshCw } from 'lucide-react';

export const INDIAN_STATES = [
  'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Bihar', 'Rajasthan', 
  'West Bengal', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Andhra Pradesh', 
  'Telangana', 'Odisha', 'Kerala', 'Jharkhand', 'Assam', 'Punjab', 
  'Haryana', 'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh', 'Delhi'
];

export function CitizenIntakeWizard({ isOpen, onClose, citizen, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    ...citizen,
    registrations: { ...citizen.registrations }
  });

  const [activeTab, setActiveTab] = useState('demographics'); // 'demographics' | 'livelihood' | 'documents'

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleRegToggle = (regKey) => {
    setFormData(prev => ({
      ...prev,
      registrations: {
        ...prev.registrations,
        [regKey]: !prev.registrations[regKey]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="wizard-modal">
        {/* Header */}
        <div className="wizard-header">
          <div className="wizard-title-group">
            <span className="wizard-step-tag">Step-by-Step Household Intake</span>
            <h3 className="wizard-title">Citizen Circumstances & Registration Questionnaire</h3>
            <p className="wizard-desc">Provide ground facts to identify missing benefits, evidence gaps, and prerequisite blockers.</p>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="wizard-tabs">
          <button 
            type="button" 
            className={`w-tab ${activeTab === 'demographics' ? 'active' : ''}`}
            onClick={() => setActiveTab('demographics')}
          >
            <User size={15} />
            <span>1. Identity & Household</span>
          </button>
          <button 
            type="button" 
            className={`w-tab ${activeTab === 'livelihood' ? 'active' : ''}`}
            onClick={() => setActiveTab('livelihood')}
          >
            <Building size={15} />
            <span>2. Occupation & Land</span>
          </button>
          <button 
            type="button" 
            className={`w-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={15} />
            <span>3. Current Registrations & Credentials</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="wizard-form">
          <div className="wizard-body">
            {/* TAB 1: Demographics */}
            {activeTab === 'demographics' && (
              <div className="wizard-tab-content">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => handleChange('name', e.target.value)} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age (Years)</label>
                    <input 
                      type="number" 
                      min="18" 
                      max="100" 
                      value={formData.age} 
                      onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)} 
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Gender</label>
                    <select 
                      value={formData.gender} 
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>State of Residence</label>
                    <select 
                      value={formData.state} 
                      onChange={(e) => handleChange('state', e.target.value)}
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location Setting</label>
                    <select 
                      value={formData.location} 
                      onChange={(e) => handleChange('location', e.target.value)}
                    >
                      <option value="Rural">Rural (Village / Gram Panchayat)</option>
                      <option value="Urban">Urban (Municipality / Nagar Nigam)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Social Category / Caste</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="OBC">Other Backward Classes (OBC)</option>
                      <option value="SC">Scheduled Caste (SC)</option>
                      <option value="ST">Scheduled Tribe (ST)</option>
                      <option value="General (EWS)">Economically Weaker Section (EWS)</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ration Card Status</label>
                    <select 
                      value={formData.rationCardType} 
                      onChange={(e) => handleChange('rationCardType', e.target.value)}
                    >
                      <option value="Priority Household (PHH)">Priority Household (PHH / NFSA)</option>
                      <option value="Antyodaya Anna Yojana (AAY)">Antyodaya Anna Yojana (AAY - Poorest of Poor)</option>
                      <option value="BPL">Below Poverty Line (BPL Card)</option>
                      <option value="None">No Ration Card</option>
                    </select>
                  </div>
                </div>

                <div className="form-section-banner">
                  <Heart size={16} />
                  <span>Household Composition Details</span>
                </div>

                <div className="family-preview-box">
                  <p className="hint-text">
                    Current family members ({formData.familyMembers.length}): {formData.familyMembers.map(m => `${m.relation} (${m.age}y)`).join(', ')}
                  </p>
                  <div className="quick-family-checkboxes">
                    <label className="toggle-label">
                      <input 
                        type="checkbox" 
                        checked={formData.familyMembers.some(m => m.gender === 'Female' && m.age <= 10)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              familyMembers: [...prev.familyMembers, { relation: 'Daughter', name: 'Girl Child', age: 7, gender: 'Female' }]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              familyMembers: prev.familyMembers.filter(m => !(m.gender === 'Female' && m.age <= 10))
                            }));
                          }
                        }}
                      />
                      <span>Household includes Girl Child aged ≤ 10 years (SSY eligible)</span>
                    </label>

                    <label className="toggle-label">
                      <input 
                        type="checkbox" 
                        checked={formData.familyMembers.some(m => m.studentClass && m.studentClass.length > 0)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              familyMembers: [...prev.familyMembers, { relation: 'Child', name: 'Student', age: 15, gender: 'Female', studentClass: 'Class 10' }]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              familyMembers: prev.familyMembers.filter(m => !m.studentClass)
                            }));
                          }
                        }}
                      />
                      <span>Household has student enrolled in Class 9 - 12 or College (Scholarship eligible)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Livelihood & Income */}
            {activeTab === 'livelihood' && (
              <div className="wizard-tab-content">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Primary Occupation</label>
                    <select 
                      value={formData.occupation} 
                      onChange={(e) => handleChange('occupation', e.target.value)}
                    >
                      <option value="Farmer">Farmer (Cultivator)</option>
                      <option value="Street Vendor">Street Vendor / Hawker / Cart Seller</option>
                      <option value="Construction Worker / Laborer">Construction Worker / Daily Wage Laborer</option>
                      <option value="Student">Student (Higher Secondary / College)</option>
                      <option value="Self Employed / Artisan">Artisan / Handloom / Self Employed</option>
                      <option value="Unemployed / Homemaker">Unemployed / Homemaker</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cultivable Landholding (Acres)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="100" 
                      value={formData.landHoldingAcres} 
                      onChange={(e) => handleChange('landHoldingAcres', parseFloat(e.target.value) || 0)} 
                    />
                    <span className="field-hint">0 for landless citizens. PM-KISAN requires cultivable land.</span>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Total Annual Household Income (₹ INR)</label>
                    <input 
                      type="number" 
                      step="5000" 
                      min="10000" 
                      max="2000000" 
                      value={formData.annualIncome} 
                      onChange={(e) => handleChange('annualIncome', parseInt(e.target.value) || 50000)} 
                      required
                    />
                    <span className="field-hint">Currently: ₹{formData.annualIncome.toLocaleString('en-IN')} / year</span>
                  </div>
                  <div className="form-group">
                    <label>Current Housing Structure</label>
                    <select 
                      value={formData.housingType} 
                      onChange={(e) => handleChange('housingType', e.target.value)}
                    >
                      <option value="Kutcha">Kutcha (Mud / Thatched / Unburnt Brick)</option>
                      <option value="Single Room Semi-Pucca">Single Room Semi-Pucca</option>
                      <option value="Rented Kutcha Chawl">Rented Kutcha Room / Chawl</option>
                      <option value="Pucca">Pucca (Permanent Concrete House)</option>
                    </select>
                  </div>
                </div>

                <div className="tax-toggle-box">
                  <label className="toggle-label-highlight">
                    <input 
                      type="checkbox" 
                      checked={formData.isIncomeTaxPayer} 
                      onChange={(e) => handleChange('isIncomeTaxPayer', e.target.checked)}
                    />
                    <div>
                      <strong>Does any family member file Income Tax Returns (ITR)?</strong>
                      <p>Many welfare schemes (PM-KISAN, Ayushman, PMAY-G) exclude income taxpayers.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: Registrations & Credentials (The Gaps Check) */}
            {activeTab === 'documents' && (
              <div className="wizard-tab-content">
                <div className="credential-notice">
                  <AlertTriangle size={16} />
                  <span>
                    Toggle these to reflect your current physical and digital records. The engine will detect missing prerequisites and evidence gaps.
                  </span>
                </div>

                <div className="credentials-checklist">
                  {/* Item 1: Aadhaar Mobile */}
                  <label className="cred-item">
                    <input 
                      type="checkbox" 
                      checked={formData.registrations.isAadhaarMobileLinked}
                      onChange={() => handleRegToggle('isAadhaarMobileLinked')}
                    />
                    <div className="cred-info">
                      <span className="cred-title">Aadhaar Card Linked to Active Mobile Number</span>
                      <span className="cred-desc">Required for OTP e-KYC on portals like PM-KISAN, NSP, and DigiLocker.</span>
                    </div>
                  </label>

                  {/* Item 2: NPCI DBT Mapping */}
                  <label className="cred-item highlight-cred">
                    <input 
                      type="checkbox" 
                      checked={formData.registrations.isNpciDbtMapped}
                      onChange={() => handleRegToggle('isNpciDbtMapped')}
                    />
                    <div className="cred-info">
                      <span className="cred-title">Aadhaar-NPCI Bank Account Mapping (DBT Enabled)</span>
                      <span className="cred-desc">
                        Crucial prerequisite! Direct cash transfers fail with "Aadhaar Not Seeded in NPCI" if unmapped.
                      </span>
                    </div>
                  </label>

                  {/* Item 3: PM-KISAN e-KYC */}
                  {formData.landHoldingAcres > 0 && (
                    <label className="cred-item">
                      <input 
                        type="checkbox" 
                        checked={formData.registrations.hasPmkisanEkyc}
                        onChange={() => handleRegToggle('hasPmkisanEkyc')}
                      />
                      <div className="cred-info">
                        <span className="cred-title">PM-KISAN Biometric / OTP e-KYC Completed</span>
                        <span className="cred-desc">Mandatory on pmkisan.gov.in to release upcoming ₹2,000 tranches.</span>
                      </div>
                    </label>
                  )}

                  {/* Item 4: Ayushman Golden Card */}
                  <label className="cred-item">
                    <input 
                      type="checkbox" 
                      checked={formData.registrations.hasAyushmanCard}
                      onChange={() => handleRegToggle('hasAyushmanCard')}
                    />
                    <div className="cred-info">
                      <span className="cred-title">Ayushman Golden PVC / Digital Card Issued</span>
                      <span className="cred-desc">Enables cashless hospital admissions up to ₹5 Lakh at empanelled hospitals.</span>
                    </div>
                  </label>

                  {/* Item 5: Current Year Income Certificate */}
                  <label className="cred-item">
                    <input 
                      type="checkbox" 
                      checked={formData.registrations.hasIncomeCertificateCurrentYear}
                      onChange={() => handleRegToggle('hasIncomeCertificateCurrentYear')}
                    />
                    <div className="cred-info">
                      <span className="cred-title">Valid Income Certificate Issued in Current Financial Year</span>
                      <span className="cred-desc">Income certificates older than 1 year are rejected by scholarship and welfare portals.</span>
                    </div>
                  </label>

                  {/* Item 6: Land RoR Khatauni */}
                  {formData.landHoldingAcres > 0 && (
                    <label className="cred-item">
                      <input 
                        type="checkbox" 
                        checked={formData.registrations.hasLandRecordRoR}
                        onChange={() => handleRegToggle('hasLandRecordRoR')}
                      />
                      <div className="cred-info">
                        <span className="cred-title">Land Ownership Record (RoR / Khatauni) in Applicant's Name</span>
                        <span className="cred-desc">Digital Bhulekh extract showing clear ownership without pending litigation.</span>
                      </div>
                    </label>
                  )}

                  {/* Item 7: Certificate of Vending (CoV) */}
                  {formData.occupation.includes('Vendor') && (
                    <label className="cred-item">
                      <input 
                        type="checkbox" 
                        checked={formData.registrations.hasVendorCertificateOfVending}
                        onChange={() => handleRegToggle('hasVendorCertificateOfVending')}
                      />
                      <div className="cred-info">
                        <span className="cred-title">Certificate of Vending (CoV) / Identity Card from Urban Local Body</span>
                        <span className="cred-desc">Required for PM SVANidhi microcredit approval without secondary recommendation.</span>
                      </div>
                    </label>
                  )}

                  {/* Item 8: Birth Certificate with Name */}
                  <label className="cred-item">
                    <input 
                      type="checkbox" 
                      checked={formData.registrations.hasBirthCertWithLegalName}
                      onChange={() => handleRegToggle('hasBirthCertWithLegalName')}
                    />
                    <div className="cred-info">
                      <span className="cred-title">Child's Birth Certificate with Legal First Name Endorsed</span>
                      <span className="cred-desc">Post offices reject "Baby of [Mother]" for Sukanya Samriddhi accounts.</span>
                    </div>
                  </label>

                  {/* Item 9: Samagra e-KYC (MP) */}
                  {formData.state === 'Madhya Pradesh' && (
                    <label className="cred-item">
                      <input 
                        type="checkbox" 
                        checked={formData.registrations.hasSamagraEkyc}
                        onChange={() => handleRegToggle('hasSamagraEkyc')}
                      />
                      <div className="cred-info">
                        <span className="cred-title">Samagra Portal e-KYC Linked with Aadhaar</span>
                        <span className="cred-desc">Mandatory for MP schemes like Ladli Behna (₹1,250/mo).</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="wizard-footer">
            <div className="wizard-footer-left">
              {activeTab !== 'demographics' && (
                <button 
                  type="button" 
                  className="btn-wizard-nav"
                  onClick={() => setActiveTab(activeTab === 'documents' ? 'livelihood' : 'demographics')}
                >
                  Previous Step
                </button>
              )}
            </div>
            <div className="wizard-footer-right">
              {activeTab !== 'documents' ? (
                <button 
                  type="button" 
                  className="btn-wizard-next"
                  onClick={() => setActiveTab(activeTab === 'demographics' ? 'livelihood' : 'documents')}
                >
                  Next: {activeTab === 'demographics' ? 'Occupation & Land' : 'Registrations & Gaps'} →
                </button>
              ) : (
                <button type="submit" className="btn-wizard-submit">
                  <Sparkles size={16} />
                  <span>Run Benefit Gap Engine</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
