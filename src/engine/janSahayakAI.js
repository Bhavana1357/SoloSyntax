/**
 * Jan Sahayak AI - Knowledge retrieval and conversational explanation engine.
 * Interprets citizen queries, explains scheme eligibility, identifies exact barriers,
 * and formulates actionable gap-resolution roadmaps.
 */

export function queryJanSahayak(question, citizen, evaluation) {
  const q = question.toLowerCase();
  const { results, summary, actionPlan } = evaluation;

  // 1. Direct scheme inquiry: PM-KISAN
  if (q.includes('kisan') || q.includes('pm-kisan') || q.includes('farmer') || q.includes('agriculture') || q.includes('6000') || q.includes('installment')) {
    const pmKisan = results.find(r => r.scheme.id === 'pm-kisan');
    if (!pmKisan || pmKisan.status === 'NOT_ELIGIBLE') {
      return {
        answer: `Under the official guidelines of the Ministry of Agriculture, PM-KISAN is exclusively for landholding farmer families. Currently, your profile indicates: ${pmKisan?.negativeReasons?.join('; ') || 'You do not meet the primary agricultural landholding criteria'}.`,
        keyTakeaway: 'Ineligible due to landholding or occupation criteria.',
        actionRequired: 'Verify if you hold ancestral agricultural land recorded in your state Bhulekh portal.',
        officialLink: 'https://pmkisan.gov.in',
        helpline: 'Toll-Free PM-KISAN Helpline: 155261 / 011-24300606',
      };
    }

    const hasNpciGap = pmKisan.unresolvedPrerequisites.some(p => p.id === 'pre_npci_dbt');
    const hasEkycGap = pmKisan.unresolvedPrerequisites.some(p => p.id === 'pre_pmkisan_ekyc');
    const hasLandGap = pmKisan.unresolvedPrerequisites.some(p => p.id === 'pre_land_seeding');

    let gapExplanation = '';
    if (hasNpciGap) {
      gapExplanation += `\n\n⚠️ **Critical Blocker: Aadhaar-NPCI DBT Mapping Inactive**\nYour bank account is not mapped in the National Payments Corporation of India (NPCI) Aadhaar Payment Bridge. Even though you own ${citizen.landHoldingAcres} acres and qualify for the ₹6,000/yr benefit, government PFMS dispatches will fail with code "Aadhaar Not Seeded in NPCI".`;
    }
    if (hasEkycGap) {
      gapExplanation += `\n\n⚠️ **Pending e-KYC**: Mandatory biometric or OTP e-KYC has not been validated on pmkisan.gov.in.`;
    }
    if (hasLandGap) {
      gapExplanation += `\n\n⚠️ **Land Seeding Pending**: Your land revenue survey number must be cross-seeded by the local Lekhpal / Patwari.`;
    }

    return {
      answer: `You meet the primary criteria for **PM-KISAN** because you are a registered farmer with ${citizen.landHoldingAcres} acres of land and your annual income is within the eligible range.${gapExplanation}\n\n**Next Actionable Steps:**\n1. Visit your bank branch or use the India Post Payments Bank (IPPB) app to submit the Aadhaar DBT Seeding consent.\n2. Complete Aadhaar OTP e-KYC on the official portal: pmkisan.gov.in.\n3. Verify your status in the Beneficiary Status tab. Once NPCI & e-KYC show "YES", all pending ₹2,000 installments will be disbursed directly.`,
      keyTakeaway: hasNpciGap ? 'Eligible, but disbursement blocked by inactive NPCI DBT bank mapping.' : 'Eligible! Ensure e-KYC and land seeding are up to date.',
      actionRequired: 'Complete Aadhaar-NPCI bank linking and e-KYC.',
      officialLink: 'https://pmkisan.gov.in',
      helpline: 'PM-KISAN Helpline: 155261 / 1800-115-526',
    };
  }

  // 2. Query regarding NPCI / Aadhaar DBT
  if (q.includes('npci') || q.includes('dbt') || q.includes('bank') || q.includes('seed') || q.includes('link aadhaar')) {
    return {
      answer: `**Understanding Aadhaar-NPCI DBT Linking:**\nHaving an Aadhaar card linked for KYC at a bank branch is NOT the same as Aadhaar-NPCI DBT Seeding.\n\n- **Bank KYC** simply associates your Aadhaar number with your bank account for identification.\n- **NPCI DBT Seeding** designates your specific account in the Reserve Bank / NPCI central routing table as the primary receiving vessel for Central and State Government subsidies.\n\n**How to resolve this gap:**\n1. **Check Status Online**: Visit myaadhaar.uidai.gov.in and click "Bank Seeding Status".\n2. **Physical Branch**: Go to your bank with a photocopy of your Aadhaar card and fill the standard "Application for Linking / Seeding Aadhaar Number & Receiving DBT Benefits in Bank Account - NPCI Mapping".\n3. **Quick Digital Alternative**: Open a digital savings account with India Post Payments Bank (IPPB) and select "DBT Seeding to IPPB" — it activates in 24 hours.`,
      keyTakeaway: 'NPCI DBT mapping is the single most common reason why eligible citizens miss out on government cash transfers.',
      actionRequired: 'Submit DBT consent mandate at bank or verify status on UIDAI portal.',
      officialLink: 'https://myaadhaar.uidai.gov.in/check-aadhaar-bank-account-status',
      helpline: 'UIDAI Helpline: 1947',
    };
  }

  // 3. Query regarding Ayushman Bharat / Health
  if (q.includes('ayushman') || q.includes('health') || q.includes('hospital') || q.includes('pm-jay') || q.includes('treatment') || q.includes('5 lakh')) {
    const pmjay = results.find(r => r.scheme.id === 'pm-jay');
    const hasCard = citizen.registrations.hasAyushmanCard;

    return {
      answer: `**Ayushman Bharat PM-JAY Eligibility Analysis:**\nYour household has a **${citizen.rationCardType || 'Ration Card'}** and an annual income of ₹${citizen.annualIncome.toLocaleString('en-IN')}, making your family eligible for ₹5,00,000 annual cashless hospitalization coverage across 27,000+ empanelled hospitals in India.\n\n${hasCard ? '✅ Your Ayushman Golden Card is active.' : '⚠️ **Current Gap**: You do not yet have the physical/digital Ayushman Golden Card. Hospitals cannot admit you cashless without generating this card.'}\n\n**How to generate your Ayushman Card:**\n1. Download the **Ayushman App** from Google Play Store or visit beneficiary.nha.gov.in.\n2. Log in using your mobile number and search using your Ration Card Number or Aadhaar.\n3. Perform Face-RD authentication using your phone camera (no need to visit any office).\n4. Download the digital Ayushman PVC card instantly.`,
      keyTakeaway: 'Eligible for ₹5,00,000 annual family coverage; e-KYC card generation required.',
      actionRequired: 'Download Ayushman App and complete instant Face e-KYC.',
      officialLink: 'https://beneficiary.nha.gov.in',
      helpline: 'Ayushman Bharat National Helpline: 14555',
    };
  }

  // 4. Query regarding PM SVANidhi (Street Vendors)
  if (q.includes('svanidhi') || q.includes('vendor') || q.includes('street') || q.includes('thela') || q.includes('loan') || q.includes('working capital')) {
    return {
      answer: `**PM SVANidhi Micro-Credit Scheme:**\nUrban street vendors are eligible for an initial collateral-free loan of ₹10,000 at a low interest rate (7% government interest subsidy), which upgrades to ₹20,000 and ₹50,000 upon timely repayment.\n\n⚠️ **Key Prerequisite Barrier**: You need a **Certificate of Vending (CoV)** or a **Letter of Recommendation (LoR)** from your Urban Local Body (Municipality/Nagar Nigam).\n\n**Step-by-step resolution:**\n1. Visit pmsvanidhi.mohua.gov.in and click "Apply for LoR".\n2. Upload your Aadhaar, bank passbook, and a photo of your vending stall/cart.\n3. Within 7 days, your local Town Vending Committee (TVC) verifies your vending location and issues an electronic LoR, unlocking the loan sanction at any PSU bank.`,
      keyTakeaway: 'Collateral-free working capital loan; requires ULB vending certificate or LoR.',
      actionRequired: 'Submit LoR application on PM SVANidhi portal.',
      officialLink: 'https://pmsvanidhi.mohua.gov.in',
      helpline: 'MoHUA SVANidhi Helpline: 1800-11-1979',
    };
  }

  // 5. Query regarding Scholarships
  if (q.includes('scholarship') || q.includes('post-matric') || q.includes('college') || q.includes('school') || q.includes('student') || q.includes('nsp') || q.includes('education')) {
    const scMatch = citizen.category === 'SC' || citizen.category === 'ST' || citizen.category === 'OBC';
    return {
      answer: `**Post-Matric & Pre-Matric Scholarships:**\nStudents from ${citizen.category} category with family income under ₹2.50 Lakh are eligible for 100% tuition reimbursement and monthly maintenance allowances (up to ₹18,000/year).\n\n**Common Barriers & Prerequisites:**\n1. **NSP OTR (One-Time Registration)**: Must be completed using the official **AadhaarFaceRD** mobile app on Android.\n2. **Student\'s Own Bank Account**: Scholarship funds can ONLY be transferred to a bank account in the student\'s own name with NPCI DBT enabled (parents\' accounts are rejected).\n3. **Current Year Income Certificate**: Must be dated within the last 12 months from the State e-District portal.\n4. **Bonafide Certificate**: Stamped and signed by the Principal/Registrar.`,
      keyTakeaway: 'High-value scholarship eligible; requires student-owned bank account + fresh income certificate + NSP OTR.',
      actionRequired: 'Complete NSP Face-RD registration and obtain renewed income certificate.',
      officialLink: 'https://scholarships.gov.in',
      helpline: 'NSP Help Desk: 0120-6619540',
    };
  }

  // 6. Query regarding Ladli Behna (MP) or Women schemes
  if (q.includes('ladli') || q.includes('behna') || q.includes('women') || q.includes('mahila') || q.includes('1250') || q.includes('ujjwala')) {
    return {
      answer: `**Women Beneficiary Schemes Overview:**\n1. **Ladli Behna Yojana (Madhya Pradesh)**: Provides ₹1,250/month (₹15,000/year) to resident women aged 21-60. Prerequisite: Requires Samagra Portal e-KYC linked with an individual (not joint) Aadhaar-DBT bank account.\n2. **PM Ujjwala 2.0**: Provides 100% free LPG connection with first refill and gas stove for women in poor households without an active gas connection.\n3. **Sukanya Samriddhi Yojana**: Offers 8.2% sovereign tax-free interest for girl children up to age 10. Prerequisite: Formal birth certificate with the child\'s permanent legal name endorsed.`,
      keyTakeaway: 'Direct cash assistance of ₹15,000/yr + free LPG connection available.',
      actionRequired: 'Complete Samagra e-KYC and ensure individual bank account has DBT active.',
      officialLink: 'https://cmladlibehna.mp.gov.in',
      helpline: 'Ladli Behna Helpline: 0755-2700800',
    };
  }

  // 7. General Inquiry / Citizen Gap Summary
  const readySchemes = results.filter(r => r.status === 'READY_TO_APPLY');
  const blockedSchemes = results.filter(r => r.status === 'ACTION_BLOCKED');
  const pendingSchemes = results.filter(r => r.status === 'POTENTIAL_WITH_GAPS');

  return {
    answer: `Based on your household profile (${citizen.occupation}, ${citizen.state}, annual income ₹${citizen.annualIncome.toLocaleString('en-IN')}, and ${citizen.familyMembers.length} family members):\n\n- **Total Schemes Evaluated:** ${results.length}\n- **Potential Matching Opportunities:** ${summary.potentialMatchesCount}\n- **Total Unlocked Benefit Value:** ₹${summary.totalPotentialAnnualValue.toLocaleString('en-IN')} / year\n- **Readiness Score:** ${summary.readinessScore}%\n\n**Current Barriers Summary:**\n- You have **${summary.prerequisitesCount} prerequisite gap(s)** blocking automatic approval or bank disbursement.\n- You have **${summary.evidenceGapsCount} evidence document(s)** requiring digital verification or renewal.\n\nTake a look at your **Personalized Action Plan** below to see how resolving 1 or 2 foundational prerequisites (like Aadhaar-NPCI bank mapping) will unlock multiple schemes simultaneously.`,
    keyTakeaway: `${summary.potentialMatchesCount} matching schemes found with potential annual value of ₹${summary.totalPotentialAnnualValue.toLocaleString('en-IN')}.`,
    actionRequired: 'Follow the Sequenced Action Plan to resolve foundational blockers.',
    officialLink: 'https://www.myscheme.gov.in',
    helpline: 'National Government Services Portal: 1800-111-555',
  };
}
