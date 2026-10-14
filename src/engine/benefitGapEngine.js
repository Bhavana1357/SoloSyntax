/**
 * Personal Benefit Gap Engine (PBGE)
 * Core evaluation engine: Deterministic rules, evidence gap discovery,
 * prerequisite dependency mapping, and graph generator.
 */

import { SCHEMES } from '../data/schemes';

export function evaluateCitizenBenefits(citizen, schemes = SCHEMES) {
  const results = [];

  for (const scheme of schemes) {
    const evaluation = evaluateScheme(citizen, scheme);
    results.push(evaluation);
  }

  // Calculate summary metrics
  const eligibleSchemes = results.filter(r => r.status !== 'NOT_ELIGIBLE');
  const readySchemes = results.filter(r => r.status === 'READY_TO_APPLY');
  const blockedSchemes = results.filter(r => r.status === 'ACTION_BLOCKED' || r.status === 'POTENTIAL_WITH_GAPS');
  
  const totalPotentialAnnualValue = eligibleSchemes.reduce((sum, r) => sum + (r.scheme.numericAnnualValue || 0), 0);
  const readyAnnualValue = readySchemes.reduce((sum, r) => sum + (r.scheme.numericAnnualValue || 0), 0);
  
  // Collect all unique unresolved prerequisite gaps
  const allPrerequisiteGaps = [];
  const allEvidenceGaps = [];

  eligibleSchemes.forEach(r => {
    r.unresolvedPrerequisites.forEach(p => {
      if (!allPrerequisiteGaps.some(item => item.id === p.id)) {
        allPrerequisiteGaps.push({ ...p, schemeIds: [r.scheme.id], schemeNames: [r.scheme.shortName] });
      } else {
        const existing = allPrerequisiteGaps.find(item => item.id === p.id);
        existing.schemeIds.push(r.scheme.id);
        existing.schemeNames.push(r.scheme.shortName);
      }
    });

    r.unresolvedEvidence.forEach(e => {
      if (!allEvidenceGaps.some(item => item.id === e.id)) {
        allEvidenceGaps.push({ ...e, schemeIds: [r.scheme.id], schemeNames: [r.scheme.shortName] });
      } else {
        const existing = allEvidenceGaps.find(item => item.id === e.id);
        existing.schemeIds.push(r.scheme.id);
        existing.schemeNames.push(r.scheme.shortName);
      }
    });
  });

  // Calculate Readiness Score (0 to 100)
  const totalRequirements = eligibleSchemes.reduce((acc, r) => acc + r.totalRequirementsCount, 0);
  const metRequirements = eligibleSchemes.reduce((acc, r) => acc + r.metRequirementsCount, 0);
  const readinessScore = totalRequirements > 0 ? Math.round((metRequirements / totalRequirements) * 100) : 0;

  // Generate Sequenced Action Plan
  const actionPlan = generateSequencedActionPlan(allPrerequisiteGaps, allEvidenceGaps, eligibleSchemes);

  return {
    results,
    summary: {
      totalEvaluated: results.length,
      potentialMatchesCount: eligibleSchemes.length,
      readyCount: readySchemes.length,
      blockedCount: blockedSchemes.length,
      totalPotentialAnnualValue,
      readyAnnualValue,
      readinessScore,
      prerequisitesCount: allPrerequisiteGaps.length,
      evidenceGapsCount: allEvidenceGaps.length,
    },
    actionPlan,
    graphData: buildBenefitGapGraph(citizen, results)
  };
}

/**
 * Deterministic scheme-by-scheme evaluator
 */
function evaluateScheme(citizen, scheme) {
  const positiveMatches = [];
  const negativeReasons = [];
  const rules = scheme.eligibilityRules;

  // 1. Check State criteria
  if (scheme.level === 'State' && scheme.state !== 'All-India') {
    if (citizen.state.toLowerCase() !== scheme.state.toLowerCase()) {
      negativeReasons.push(`Scheme is exclusively for residents of ${scheme.state} (Citizen is in ${citizen.state})`);
    } else {
      positiveMatches.push(`Resident of eligible state: ${scheme.state}`);
    }
  }

  // 2. Check Occupation criteria
  if (rules.occupation && rules.occupation.length > 0) {
    const occMatch = rules.occupation.some(occ => 
      citizen.occupation.toLowerCase().includes(occ.toLowerCase()) || 
      occ.toLowerCase().includes(citizen.occupation.toLowerCase())
    );
    if (!occMatch) {
      negativeReasons.push(`Occupation mismatch: Citizen is a "${citizen.occupation}", scheme requires: ${rules.occupation.join(', ')}`);
    } else {
      positiveMatches.push(`Occupation matches scheme criteria: ${citizen.occupation}`);
    }
  }

  // 3. Check Landholding criteria
  if (rules.minLandAcres !== undefined || rules.maxLandAcres !== undefined) {
    const acres = citizen.landHoldingAcres || 0;
    if (rules.minLandAcres !== undefined && acres < rules.minLandAcres) {
      negativeReasons.push(`Requires cultivable land ownership (Citizen owns ${acres} acres)`);
    } else if (rules.maxLandAcres !== undefined && acres > rules.maxLandAcres) {
      negativeReasons.push(`Landholding exceeds scheme limit of ${rules.maxLandAcres} acres (Citizen owns ${acres} acres)`);
    } else if (acres > 0) {
      positiveMatches.push(`Landholding is within permissible limit (${acres} acres)`);
    }
  }

  // 4. Check Income criteria
  if (rules.maxAnnualIncome !== undefined) {
    if (citizen.annualIncome > rules.maxAnnualIncome) {
      negativeReasons.push(`Annual income ₹${citizen.annualIncome.toLocaleString('en-IN')} exceeds threshold of ₹${rules.maxAnnualIncome.toLocaleString('en-IN')}`);
    } else {
      positiveMatches.push(`Household annual income is within income ceiling (₹${citizen.annualIncome.toLocaleString('en-IN')} <= ₹${rules.maxAnnualIncome.toLocaleString('en-IN')})`);
    }
  }

  // 5. Check Income Tax payer exclusion
  if (rules.isIncomeTaxPayer === false && citizen.isIncomeTaxPayer === true) {
    negativeReasons.push('Exclusion rule: Income taxpayers are ineligible for this benefit.');
  }

  // 6. Check Location (Rural/Urban)
  if (rules.location && rules.location !== citizen.location) {
    negativeReasons.push(`Location restriction: Scheme requires ${rules.location} location, but citizen resides in ${citizen.location}.`);
  } else if (rules.location) {
    positiveMatches.push(`Matches location requirement (${citizen.location})`);
  }

  // 7. Check Housing criteria (for PMAY)
  if (rules.housingType && rules.housingType.length > 0) {
    const houseMatch = rules.housingType.some(h => citizen.housingType.toLowerCase().includes(h.toLowerCase()));
    if (!houseMatch) {
      negativeReasons.push(`Requires living in ${rules.housingType.join('/')} dwelling (Citizen lives in ${citizen.housingType})`);
    } else {
      positiveMatches.push(`Housing condition satisfies scheme criteria (${citizen.housingType})`);
    }
  }

  // 8. Specific Family conditions
  if (rules.hasGirlChildUnder10) {
    const hasEligibleGirl = citizen.familyMembers.some(m => 
      m.gender === 'Female' && m.age <= 10 && (m.relation.includes('Daughter') || m.relation.includes('Child'))
    );
    if (!hasEligibleGirl) {
      negativeReasons.push('Requires a girl child aged 10 years or under in the household.');
    } else {
      positiveMatches.push('Household has an eligible girl child under 10 years old.');
    }
  }

  if (rules.hasSchoolOrCollegeStudents) {
    const hasStudent = citizen.familyMembers.some(m => m.studentClass && m.studentClass.length > 0);
    if (!hasStudent) {
      negativeReasons.push('Requires an actively enrolled student in school or higher education.');
    } else {
      positiveMatches.push('Household has actively enrolled school/college students.');
    }
  }

  if (rules.hasAdultFemale) {
    const hasFemale = citizen.gender === 'Female' || citizen.familyMembers.some(m => m.gender === 'Female' && m.age >= 18);
    if (!hasFemale) {
      negativeReasons.push('Requires an adult female beneficiary in the household.');
    } else {
      positiveMatches.push('Qualifies with adult female beneficiary in family.');
    }
  }

  if (rules.category && rules.category.length > 0) {
    if (!rules.category.includes(citizen.category)) {
      negativeReasons.push(`Social category mismatch: Citizen is "${citizen.category}", scheme is targeted for ${rules.category.join('/')}`);
    } else {
      positiveMatches.push(`Social category qualifies: ${citizen.category}`);
    }
  }

  // If there are negative disqualifying reasons, citizen is NOT_ELIGIBLE
  if (negativeReasons.length > 0) {
    return {
      scheme,
      status: 'NOT_ELIGIBLE',
      statusLabel: 'Not Eligible',
      badgeColor: 'gray',
      positiveMatches,
      negativeReasons,
      unresolvedPrerequisites: [],
      resolvedPrerequisites: [],
      unresolvedEvidence: [],
      resolvedEvidence: [],
      totalRequirementsCount: 0,
      metRequirementsCount: 0,
    };
  }

  // --- Citizen meets core criteria! Now analyze GAPS (Evidence + Prerequisites) ---
  const reg = citizen.registrations || {};
  const unresolvedEvidence = [];
  const resolvedEvidence = [];
  const unresolvedPrerequisites = [];
  const resolvedPrerequisites = [];

  // Evaluate Evidence Requirements
  for (const ev of scheme.evidenceRequirements) {
    let isMet = false;
    if (ev.id === 'ev_land_ror' && reg.hasLandRecordRoR) isMet = true;
    else if (ev.id === 'ev_aadhaar_active' && reg.hasAadhaar && reg.isAadhaarMobileLinked) isMet = true;
    else if (ev.id === 'ev_ration_card' && reg.hasRationCard) isMet = true;
    else if (ev.id === 'ev_ration_card_family' && reg.hasRationCard) isMet = true;
    else if (ev.id === 'ev_family_aadhaar' && reg.hasAadhaar) isMet = true;
    else if (ev.id === 'ev_land_site_proof' && reg.hasMgnregaJobCard) isMet = true;
    else if (ev.id === 'ev_kutcha_photographs' && reg.hasAwaasPlusSurveyEntry) isMet = true;
    else if (ev.id === 'ev_vendor_cov' && reg.hasVendorCertificateOfVending) isMet = true;
    else if (ev.id === 'ev_bank_passbook' && reg.hasBankAccount) isMet = true;
    else if (ev.id === 'ev_bank_kyc' && reg.hasBankAccount) isMet = true;
    else if (ev.id === 'ev_girl_birth_cert' && reg.hasBirthCertWithLegalName) isMet = true;
    else if (ev.id === 'ev_parent_kyc' && reg.hasAadhaar) isMet = true;
    else if (ev.id === 'ev_caste_cert' && reg.hasCasteCertificate) isMet = true;
    else if (ev.id === 'ev_income_cert_current' && reg.hasIncomeCertificateCurrentYear) isMet = true;
    else if (ev.id === 'ev_bonafide_student' && reg.hasBonafideCertificate) isMet = true;
    else if (ev.id === 'ev_samagra_id' && reg.hasSamagraId) isMet = true;
    else if (ev.id === 'ev_14_point_decl' && !reg.hasExistingLpgConnection) isMet = true;
    else if (ev.id === 'ev_kmy_land_proof' && reg.hasLandRecordRoR) isMet = true;

    if (isMet) {
      resolvedEvidence.push(ev);
    } else {
      unresolvedEvidence.push(ev);
    }
  }

  // Evaluate Prerequisite Dependencies
  for (const pre of scheme.prerequisites) {
    let isMet = false;
    if (pre.id === 'pre_npci_dbt' && reg.isNpciDbtMapped) isMet = true;
    else if (pre.id === 'pre_pmkisan_ekyc' && reg.hasPmkisanEkyc) isMet = true;
    else if (pre.id === 'pre_land_seeding' && reg.isLandSeededPmkisan) isMet = true;
    else if (pre.id === 'pre_ayushman_card_gen' && reg.hasAyushmanCard) isMet = true;
    else if (pre.id === 'pre_ration_family_sync' && reg.hasRationCard) isMet = true;
    else if (pre.id === 'pre_mgnrega_job_card' && reg.hasMgnregaJobCard) isMet = true;
    else if (pre.id === 'pre_gram_sabha_inclusion' && reg.hasAwaasPlusSurveyEntry) isMet = true;
    else if (pre.id === 'pre_ulb_lor' && reg.hasVendorCertificateOfVending) isMet = true;
    else if (pre.id === 'pre_upi_qr_onboarding' && reg.isNpciDbtMapped) isMet = true;
    else if (pre.id === 'pre_birth_cert_name_endorsement' && reg.hasBirthCertWithLegalName) isMet = true;
    else if (pre.id === 'pre_post_office_account' && reg.hasBirthCertWithLegalName) isMet = true;
    else if (pre.id === 'pre_nsp_otr' && reg.hasNspOtr) isMet = true;
    else if (pre.id === 'pre_student_npci_seed' && reg.isNpciDbtMapped) isMet = true;
    else if (pre.id === 'pre_female_bank_aadhaar' && reg.isNpciDbtMapped) isMet = true;
    else if (pre.id === 'pre_omc_deduplication' && !reg.hasExistingLpgConnection) isMet = true;
    else if (pre.id === 'pre_auto_debit_mandate' && reg.isNpciDbtMapped) isMet = true;
    else if (pre.id === 'pre_samagra_ekyc' && reg.hasSamagraEkyc) isMet = true;
    else if (pre.id === 'pre_mp_dbt_active' && reg.isNpciDbtMapped) isMet = true;
    else if (pre.id === 'pre_apy_nach_mandate' && reg.isNpciDbtMapped) isMet = true;

    if (isMet) {
      resolvedPrerequisites.push(pre);
    } else {
      unresolvedPrerequisites.push(pre);
    }
  }

  const totalRequirementsCount = scheme.evidenceRequirements.length + scheme.prerequisites.length;
  const metRequirementsCount = resolvedEvidence.length + resolvedPrerequisites.length;

  // Determine overall status
  let status = 'READY_TO_APPLY';
  let statusLabel = 'Ready to Apply';
  let badgeColor = 'emerald';

  const hasHighSeverityBlocker = unresolvedPrerequisites.some(p => p.severity === 'High');

  if (hasHighSeverityBlocker) {
    status = 'ACTION_BLOCKED';
    statusLabel = 'Action Blocked (Prerequisite Gap)';
    badgeColor = 'rose';
  } else if (unresolvedPrerequisites.length > 0 || unresolvedEvidence.length > 0) {
    status = 'POTENTIAL_WITH_GAPS';
    statusLabel = 'Potential Match (Evidence Pending)';
    badgeColor = 'amber';
  }

  return {
    scheme,
    status,
    statusLabel,
    badgeColor,
    positiveMatches,
    negativeReasons: [],
    unresolvedPrerequisites,
    resolvedPrerequisites,
    unresolvedEvidence,
    resolvedEvidence,
    totalRequirementsCount,
    metRequirementsCount,
  };
}

/**
 * Generates a phased, sequenced action plan prioritizing multi-scheme unblockers
 */
function generateSequencedActionPlan(prerequisites, evidenceGaps, eligibleSchemes) {
  // Sort prerequisites: ones that unblock the most schemes come first!
  const sortedPrereqs = [...prerequisites].sort((a, b) => {
    if (a.severity === 'High' && b.severity !== 'High') return -1;
    if (b.severity === 'High' && a.severity !== 'High') return 1;
    return b.schemeIds.length - a.schemeIds.length;
  });

  const phase1 = sortedPrereqs.map((p, idx) => ({
    id: `action_pre_${p.id}`,
    stepNumber: idx + 1,
    phase: 'Phase 1: Foundational Prerequisites',
    phaseBadge: 'Unblocker',
    title: p.title,
    description: p.description,
    whyItMatters: p.whyItBlocks,
    resolutionSteps: p.resolutionSteps,
    actionUrl: p.resolutionUrl,
    actionLabel: p.actionLabel,
    severity: p.severity,
    unblocksSchemes: p.schemeNames,
    type: 'prerequisite',
    internalId: p.id,
  }));

  const phase2 = evidenceGaps.map((e, idx) => ({
    id: `action_ev_${e.id}`,
    stepNumber: phase1.length + idx + 1,
    phase: 'Phase 2: Evidence Document Verification',
    phaseBadge: 'Documentation',
    title: `Obtain / Verify: ${e.title}`,
    description: e.description,
    whyItMatters: `Required by scheme authority (${e.authority}) to validate eligibility proof.`,
    resolutionSteps: e.actionText,
    actionUrl: e.sourcePortal.startsWith('http') ? e.sourcePortal : 'https://www.digilocker.gov.in',
    actionLabel: e.sourcePortal.startsWith('http') ? 'Open Document Portal' : 'Fetch on DigiLocker',
    severity: e.isCritical ? 'High' : 'Medium',
    unblocksSchemes: e.schemeNames,
    type: 'evidence',
    internalId: e.id,
  }));

  const phase3 = eligibleSchemes.map((r, idx) => ({
    id: `action_apply_${r.scheme.id}`,
    stepNumber: phase1.length + phase2.length + idx + 1,
    phase: 'Phase 3: Formal Scheme Application',
    phaseBadge: 'Submission',
    title: `Submit Application for ${r.scheme.name}`,
    description: `Target benefit: ${r.scheme.benefitAmount}. Mode: ${r.scheme.applicationMode}.`,
    whyItMatters: `Estimated processing time: ${r.scheme.processingTime}.`,
    resolutionSteps: `Navigate to ${r.scheme.portalName} or nearest CSC and complete application form with the verified documents from Phase 1 and Phase 2.`,
    actionUrl: r.scheme.officialPortal,
    actionLabel: `Open ${r.scheme.shortName} Portal`,
    severity: 'Medium',
    unblocksSchemes: [r.scheme.shortName],
    type: 'submission',
    isReady: r.status === 'READY_TO_APPLY',
  }));

  return {
    allSteps: [...phase1, ...phase2, ...phase3],
    phase1,
    phase2,
    phase3,
  };
}

/**
 * Builds the Benefit Gap Graph connecting:
 * Citizen Facts -> Prerequisites -> Evidence -> Schemes
 */
export function buildBenefitGapGraph(citizen, evaluationResults) {
  const nodes = [];
  const links = [];

  // 1. Citizen Facts Layer (Left)
  const citizenFactNodes = [
    { id: 'fact_occ', label: citizen.occupation, sub: 'Occupation', type: 'fact', icon: 'briefcase', status: 'verified' },
    { id: 'fact_income', label: `₹${(citizen.annualIncome / 1000).toFixed(0)}k/yr`, sub: 'Income Level', type: 'fact', icon: 'wallet', status: 'verified' },
    { id: 'fact_state', label: `${citizen.state} (${citizen.location})`, sub: 'Jurisdiction', type: 'fact', icon: 'map', status: 'verified' },
  ];

  if (citizen.landHoldingAcres > 0) {
    citizenFactNodes.push({ id: 'fact_land', label: `${citizen.landHoldingAcres} Acres Land`, sub: 'Land Asset', type: 'fact', icon: 'trees', status: 'verified' });
  }

  if (citizen.familyMembers && citizen.familyMembers.length > 1) {
    citizenFactNodes.push({ id: 'fact_family', label: `${citizen.familyMembers.length} Family Members`, sub: 'Household', type: 'fact', icon: 'users', status: 'verified' });
  }

  nodes.push(...citizenFactNodes);

  // 2. Eligible Schemes Layer (Right)
  const eligibleEvals = evaluationResults.filter(r => r.status !== 'NOT_ELIGIBLE');

  eligibleEvals.forEach(ev => {
    nodes.push({
      id: `scheme_${ev.scheme.id}`,
      label: ev.scheme.shortName,
      sub: ev.scheme.benefitAmount,
      type: 'scheme',
      category: ev.scheme.category,
      status: ev.status,
      schemeId: ev.scheme.id,
      officialPortal: ev.scheme.officialPortal,
    });
  });

  // 3. Prerequisites Layer (Center-Left)
  const addedPrereqIds = new Set();
  const addedEvidenceIds = new Set();

  eligibleEvals.forEach(ev => {
    // Prerequisites
    ev.unresolvedPrerequisites.forEach(p => {
      const pNodeId = `prereq_${p.id}`;
      if (!addedPrereqIds.has(pNodeId)) {
        addedPrereqIds.add(pNodeId);
        nodes.push({
          id: pNodeId,
          label: p.title.length > 28 ? p.title.substring(0, 26) + '...' : p.title,
          sub: p.severity === 'High' ? 'Critical Blocker' : 'Prerequisite',
          type: 'prerequisite',
          status: 'blocking',
          fullData: p,
        });
      }
      // Link prerequisite to scheme
      links.push({
        source: pNodeId,
        target: `scheme_${ev.scheme.id}`,
        type: 'blocks_scheme',
        status: 'blocking',
      });
    });

    ev.resolvedPrerequisites.forEach(p => {
      const pNodeId = `prereq_${p.id}`;
      if (!addedPrereqIds.has(pNodeId)) {
        addedPrereqIds.add(pNodeId);
        nodes.push({
          id: pNodeId,
          label: p.title.length > 28 ? p.title.substring(0, 26) + '...' : p.title,
          sub: 'Satisfied',
          type: 'prerequisite',
          status: 'satisfied',
          fullData: p,
        });
      }
      links.push({
        source: pNodeId,
        target: `scheme_${ev.scheme.id}`,
        type: 'fulfills_scheme',
        status: 'satisfied',
      });
    });

    // Evidence
    ev.unresolvedEvidence.forEach(e => {
      const eNodeId = `ev_${e.id}`;
      if (!addedEvidenceIds.has(eNodeId)) {
        addedEvidenceIds.add(eNodeId);
        nodes.push({
          id: eNodeId,
          label: e.title.length > 28 ? e.title.substring(0, 26) + '...' : e.title,
          sub: 'Evidence Gap',
          type: 'evidence',
          status: 'missing',
          fullData: e,
        });
      }
      links.push({
        source: eNodeId,
        target: `scheme_${ev.scheme.id}`,
        type: 'missing_evidence',
        status: 'missing',
      });
    });

    // Link Fact to Schemes / Prerequisites
    if (ev.scheme.id === 'pm-kisan' && citizen.landHoldingAcres > 0) {
      links.push({ source: 'fact_land', target: `prereq_pre_npci_dbt`, type: 'fact_trigger' });
    }
    links.push({ source: 'fact_occ', target: `scheme_${ev.scheme.id}`, type: 'fact_qualifies' });
  });

  return { nodes, links };
}
