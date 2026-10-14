/**
 * Representative Indian citizen personas to showcase the Personal Benefit Gap Engine.
 */

export const PERSONAS = [
  {
    id: 'ramesh-farmer',
    name: 'Ramesh Kumar',
    hindiName: 'रमेश कुमार',
    avatar: '👨‍🌾',
    tagline: 'Small Farmer · 2 School Children · Gorakhpur, UP',
    age: 38,
    gender: 'Male',
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
    location: 'Rural',
    occupation: 'Farmer',
    landHoldingAcres: 1.5,
    annualIncome: 95000,
    category: 'OBC',
    maritalStatus: 'Married',
    housingType: 'Single Room Semi-Pucca',
    hasFourWheeler: false,
    isIncomeTaxPayer: false,
    rationCardType: 'Priority Household (PHH)',
    familyMembers: [
      { relation: 'Self', name: 'Ramesh Kumar', age: 38, gender: 'Male' },
      { relation: 'Wife', name: 'Geeta Devi', age: 34, gender: 'Female' },
      { relation: 'Daughter', name: 'Kavita Kumari', age: 14, gender: 'Female', studentClass: 'Class 9' },
      { relation: 'Son', name: 'Amit Kumar', age: 11, gender: 'Male', studentClass: 'Class 6' },
      { relation: 'Mother', name: 'Shanti Devi', age: 66, gender: 'Female' }
    ],
    // Citizen existing digital facts & registrations
    registrations: {
      hasAadhaar: true,
      isAadhaarMobileLinked: true,
      hasBankAccount: true,
      isNpciDbtMapped: false, // <-- CRITICAL PREREQUISITE GAP!
      hasPmkisanEkyc: false, // <-- PREREQUISITE GAP
      hasDigiLocker: false,
      hasAyushmanCard: false, // <-- Evidence GAP
      hasRationCard: true,
      hasSamagraId: false,
      hasMgnregaJobCard: true,
      hasCasteCertificate: true,
      hasIncomeCertificateCurrentYear: false, // <-- Expired evidence GAP
      hasLandRecordRoR: true,
      isLandSeededPmkisan: false, // <-- Prerequisite GAP
      hasNspOtr: false,
    },
    contextNotes: 'Ramesh owns 1.5 acres of ancestral farmland. He applied for PM-KISAN 6 months ago, but payments never arrived due to NPCI DBT bank mapping failure. His daughter Kavita entered Class 9 and needs scholarship support, but his income certificate expired last year.'
  },

  {
    id: 'sunita-vendor',
    name: 'Sunita Devi',
    hindiName: 'सुनीता देवी',
    avatar: '👩‍🍳',
    tagline: 'Urban Street Vendor & Mother · Mumbai, MH',
    age: 32,
    gender: 'Female',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    location: 'Urban',
    occupation: 'Street Vendor',
    landHoldingAcres: 0,
    annualIncome: 140000,
    category: 'General (EWS)',
    maritalStatus: 'Widowed',
    housingType: 'Rented Kutcha Chawl',
    hasFourWheeler: false,
    isIncomeTaxPayer: false,
    rationCardType: 'Priority Household (PHH)',
    familyMembers: [
      { relation: 'Self', name: 'Sunita Devi', age: 32, gender: 'Female' },
      { relation: 'Daughter', name: 'Pooja', age: 8, gender: 'Female', studentClass: 'Class 3' }
    ],
    registrations: {
      hasAadhaar: true,
      isAadhaarMobileLinked: true,
      hasBankAccount: true,
      isNpciDbtMapped: true,
      hasPmkisanEkyc: false,
      hasDigiLocker: true,
      hasAyushmanCard: false,
      hasRationCard: true,
      hasSamagraId: false,
      hasMgnregaJobCard: false,
      hasCasteCertificate: false,
      hasIncomeCertificateCurrentYear: false,
      hasLandRecordRoR: false,
      isLandSeededPmkisan: false,
      hasNspOtr: false,
      hasVendorCertificateOfVending: false, // <-- PREREQUISITE GAP for PM SVANidhi
      hasBirthCertWithLegalName: false, // <-- PREREQUISITE GAP for Sukanya Samriddhi
      hasExistingLpgConnection: false, // Eligible for Ujjwala 2.0!
    },
    contextNotes: 'Sunita operates a vegetable cart in suburban Mumbai. She wants a ₹10,000 working capital microloan under PM SVANidhi, but does not have a formal Certificate of Vending from the Municipal Corporation. She also wishes to open a Sukanya Samriddhi account for her 8-year-old daughter, but the birth certificate only states "Baby of Sunita".'
  },

  {
    id: 'priya-student',
    name: 'Priya Kumari',
    hindiName: 'प्रिया कुमारी',
    avatar: '🎓',
    tagline: 'First-Gen College Student · Patna, Bihar',
    age: 19,
    gender: 'Female',
    state: 'Bihar',
    district: 'Patna',
    location: 'Urban',
    occupation: 'Student',
    landHoldingAcres: 0,
    annualIncome: 110000,
    category: 'SC',
    maritalStatus: 'Single',
    housingType: 'Pucca',
    hasFourWheeler: false,
    isIncomeTaxPayer: false,
    rationCardType: 'BPL',
    familyMembers: [
      { relation: 'Self', name: 'Priya Kumari', age: 19, gender: 'Female', studentClass: '1st Year B.Sc' },
      { relation: 'Father', name: 'Ramvilas Paswan', age: 48, gender: 'Male' },
      { relation: 'Mother', name: 'Manju Devi', age: 44, gender: 'Female' }
    ],
    registrations: {
      hasAadhaar: true,
      isAadhaarMobileLinked: true,
      hasBankAccount: true,
      isNpciDbtMapped: false, // <-- Student's bank not mapped for DBT
      hasPmkisanEkyc: false,
      hasDigiLocker: true,
      hasAyushmanCard: false,
      hasRationCard: true,
      hasSamagraId: false,
      hasMgnregaJobCard: false,
      hasCasteCertificate: true,
      hasIncomeCertificateCurrentYear: true,
      hasLandRecordRoR: false,
      isLandSeededPmkisan: false,
      hasNspOtr: false, // <-- Missing National Scholarship Portal OTR
      hasBonafideCertificate: true,
    },
    contextNotes: 'Priya is enrolled in a government college. Her father is a daily-wage carpenter. She qualifies for the Centrally Sponsored Post-Matric SC Scholarship (₹12,000/yr), but has not registered on the new NSP Face-RD portal and her bank account was opened as a minor without DBT seeding.'
  },

  {
    id: 'rajesh-mp',
    name: 'Rajesh & Anita Yadav',
    hindiName: 'राजेश एवं अनिता यादव',
    avatar: '🏡',
    tagline: 'Rural Construction Worker Family · Sehore, MP',
    age: 42,
    gender: 'Male',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    location: 'Rural',
    occupation: 'Construction Worker / Laborer',
    landHoldingAcres: 0,
    annualIncome: 80000,
    category: 'OBC',
    maritalStatus: 'Married',
    housingType: 'Kutcha',
    hasFourWheeler: false,
    isIncomeTaxPayer: false,
    rationCardType: 'Antyodaya Anna Yojana (AAY)',
    familyMembers: [
      { relation: 'Self', name: 'Rajesh Yadav', age: 42, gender: 'Male' },
      { relation: 'Wife', name: 'Anita Yadav', age: 39, gender: 'Female' },
      { relation: 'Son', name: 'Sanjay', age: 16, gender: 'Male', studentClass: 'Class 10' }
    ],
    registrations: {
      hasAadhaar: true,
      isAadhaarMobileLinked: true,
      hasBankAccount: true,
      isNpciDbtMapped: true,
      hasPmkisanEkyc: false,
      hasDigiLocker: false,
      hasAyushmanCard: false,
      hasRationCard: true,
      hasSamagraId: true,
      hasSamagraEkyc: false, // <-- Prerequisite GAP for Ladli Behna
      hasMgnregaJobCard: true,
      hasCasteCertificate: false,
      hasIncomeCertificateCurrentYear: false,
      hasLandRecordRoR: false,
      isLandSeededPmkisan: false,
      hasNspOtr: false,
      hasAwaasPlusSurveyEntry: false, // <-- Prerequisite GAP for PMAY-G
      hasExistingLpgConnection: false,
    },
    contextNotes: 'Rajesh lives in a mud-thatched kutcha house in Sehore. He has an AAY Antyodaya ration card. His wife Anita is eligible for Ladli Behna (₹1,250/mo) and PM Ujjwala 2.0, but her Samagra profile does not have Aadhaar e-KYC linked. The family also urgently needs PMAY-G housing assistance.'
  }
];

export const EMPTY_CITIZEN_TEMPLATE = {
  id: 'custom-citizen',
  name: 'New Citizen Profile',
  hindiName: 'नागरिक प्रोफ़ाइल',
  avatar: '👤',
  tagline: 'Custom Citizen Intake Questionnaire',
  age: 35,
  gender: 'Female',
  state: 'Uttar Pradesh',
  district: '',
  location: 'Rural',
  occupation: 'Farmer',
  landHoldingAcres: 1.0,
  annualIncome: 120000,
  category: 'OBC',
  maritalStatus: 'Married',
  housingType: 'Kutcha',
  hasFourWheeler: false,
  isIncomeTaxPayer: false,
  rationCardType: 'Priority Household (PHH)',
  familyMembers: [
    { relation: 'Self', name: 'Citizen', age: 35, gender: 'Female' }
  ],
  registrations: {
    hasAadhaar: true,
    isAadhaarMobileLinked: true,
    hasBankAccount: true,
    isNpciDbtMapped: false,
    hasPmkisanEkyc: false,
    hasDigiLocker: false,
    hasAyushmanCard: false,
    hasRationCard: true,
    hasSamagraId: false,
    hasSamagraEkyc: false,
    hasMgnregaJobCard: false,
    hasCasteCertificate: false,
    hasIncomeCertificateCurrentYear: false,
    hasLandRecordRoR: false,
    isLandSeededPmkisan: false,
    hasNspOtr: false,
    hasVendorCertificateOfVending: false,
    hasBirthCertWithLegalName: false,
    hasExistingLpgConnection: false,
  },
  contextNotes: 'Enter your household circumstances to discover your personalized benefit gaps and resolution roadmap.'
};
