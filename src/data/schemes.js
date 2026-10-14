/**
 * Official Indian Government Schemes Database for the Personal Benefit Gap Engine (PBGE)
 * Captures explicit eligibility rules, evidence requirements, and prerequisite dependencies.
 */

export const SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
    shortName: 'PM-KISAN',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    state: 'All-India',
    category: 'Agriculture',
    benefitType: 'Direct Cash Transfer',
    benefitAmount: '₹6,000 / year (in 3 equal installments of ₹2,000)',
    numericAnnualValue: 6000,
    officialPortal: 'https://pmkisan.gov.in',
    portalName: 'PM-KISAN Official Portal',
    applicationMode: 'Online Self-Registration or CSC Center',
    processingTime: '15 - 30 days',
    description: 'Direct income support of ₹6,000 per annum to all landholding farmer families across India, credited directly to Aadhaar-seeded bank accounts.',
    
    // Evaluation rules (declarative)
    eligibilityRules: {
      occupation: ['Farmer', 'Agricultural Laborer with land'],
      minLandAcres: 0.01,
      maxLandAcres: 50.0,
      isIncomeTaxPayer: false,
      isInstitutionalLandholder: false,
    },

    // Evidence Gaps (Documents that must be verified)
    evidenceRequirements: [
      {
        id: 'ev_land_ror',
        title: 'Land Ownership Records (RoR / Khatauni / Jamabandi)',
        authority: 'State Revenue Department / Bhulekh Portal',
        description: 'Updated digital record of land rights showing cultivable land in applicant\'s name.',
        sourcePortal: 'State Bhulekh / DigiLocker',
        actionText: 'Fetch digital Khatauni via DigiLocker or Revenue office',
        isCritical: true,
      },
      {
        id: 'ev_aadhaar_active',
        title: 'Aadhaar Card with Mobile Linkage',
        authority: 'UIDAI',
        description: 'Valid 12-digit Aadhaar card linked to active mobile for OTP authentication.',
        sourcePortal: 'https://myaadhaar.uidai.gov.in',
        actionText: 'Verify mobile linkage on myAadhaar portal',
        isCritical: true,
      }
    ],

    // Prerequisite Gaps (Action dependencies that MUST be cleared first)
    prerequisites: [
      {
        id: 'pre_npci_dbt',
        title: 'Aadhaar-NPCI Bank Account Mapping (DBT Active)',
        description: 'Direct Benefit Transfer requires Aadhaar to be mapped in the NPCI central mapper with an active savings bank account.',
        severity: 'High',
        whyItBlocks: 'Even if your application is approved by the State Nodal Officer, PFMS payments will fail with error "Aadhaar Not Seeded in NPCI".',
        resolutionSteps: 'Visit your bank branch with Aadhaar consent form or use IPPB (India Post Payments Bank) app to enable DBT seeding.',
        resolutionUrl: 'https://myaadhaar.uidai.gov.in/check-aadhaar-bank-account-status',
        actionLabel: 'Check NPCI DBT Status on UIDAI',
      },
      {
        id: 'pre_pmkisan_ekyc',
        title: 'PM-KISAN Biometric / OTP e-KYC',
        description: 'Mandatory e-KYC verification for all beneficiaries via OTP on PM-KISAN portal or biometric at CSC.',
        severity: 'High',
        whyItBlocks: 'Government of India has made e-KYC mandatory; upcoming installments are withheld until e-KYC is marked Completed.',
        resolutionSteps: 'Enter Aadhaar number on pmkisan.gov.in > e-KYC tab, and enter the OTP received on Aadhaar-linked mobile.',
        resolutionUrl: 'https://exlink.pmkisan.gov.in/aadharekyc.aspx',
        actionLabel: 'Complete e-KYC Online',
      },
      {
        id: 'pre_land_seeding',
        title: 'Land Seeding Status in PM-KISAN Portal',
        description: 'Verification of survey number and sub-division on state revenue portal linked to farmer profile.',
        severity: 'Medium',
        whyItBlocks: 'Payment status displays "Land Seeding: NO" if state revenue database has not cross-verified the survey number.',
        resolutionSteps: 'Submit land khatauni copy to Lekhpal / Patwari or Agriculture Extension Officer.',
        resolutionUrl: 'https://pmkisan.gov.in/BeneficiaryStatus_New.aspx',
        actionLabel: 'Check Land Seeding Status',
      }
    ]
  },

  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    hindiName: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
    shortName: 'PM-JAY',
    ministry: 'National Health Authority (NHA) & MoHFW',
    level: 'Central',
    state: 'All-India',
    category: 'Healthcare',
    benefitType: 'Health Insurance',
    benefitAmount: '₹5,00,000 / family / year cashless hospital cover',
    numericAnnualValue: 500000,
    officialPortal: 'https://beneficiary.nha.gov.in',
    portalName: 'Beneficiary NHA Portal',
    applicationMode: 'Ayushman App, Beneficiary Portal or Ayushman Mitra at Hospital',
    processingTime: 'Instant upon e-KYC approval',
    description: 'World\'s largest government-funded health assurance scheme providing a health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    
    eligibilityRules: {
      isBPLOrPoor: true,
      maxAnnualIncome: 300000,
      rationCardTypes: ['Antyodaya Anna Yojana (AAY)', 'Priority Household (PHH)', 'BPL'],
      excludedTaxPayers: true,
    },

    evidenceRequirements: [
      {
        id: 'ev_ration_card',
        title: 'Valid NFSA / State Ration Card (AAY or PHH)',
        authority: 'State Food & Civil Supplies Department',
        description: 'Active digital ration card with family member names listed properly.',
        sourcePortal: 'https://nfsa.gov.in',
        actionText: 'Verify ration card active status on NFSA portal',
        isCritical: true,
      },
      {
        id: 'ev_family_aadhaar',
        title: 'Aadhaar Cards for all family members',
        authority: 'UIDAI',
        description: 'Aadhaar of all family beneficiaries for individual e-KYC.',
        sourcePortal: 'https://myaadhaar.uidai.gov.in',
        actionText: 'Collect Aadhaar numbers of all family members',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_ayushman_card_gen',
        title: 'Ayushman Card Generation & e-KYC (Golden Card)',
        description: 'Family may be listed in SECC 2011 or NFSA database, but individual Ayushman PVC/digital card must be generated via Face-RD or Aadhaar OTP.',
        severity: 'High',
        whyItBlocks: 'Hospitals require the active 14-digit ABHA / Ayushman Card at admission desk to trigger cashless claims.',
        resolutionSteps: 'Download Ayushman App on smartphone or visit nearest Common Service Center (CSC) / Empanelled Hospital.',
        resolutionUrl: 'https://beneficiary.nha.gov.in',
        actionLabel: 'Generate Ayushman Card Online',
      },
      {
        id: 'pre_ration_family_sync',
        title: 'Family Name Discrepancy Correction in Ration Card',
        description: 'All dependent family members seeking coverage must match their exact Aadhaar names with the Ration Card record.',
        severity: 'Medium',
        whyItBlocks: 'Mismatch prevents e-KYC verification for dependent children and spouse.',
        resolutionSteps: 'Submit Aadhaar seeding request at local Taluk Supply Office / Ration Dealer.',
        resolutionUrl: 'https://nfsa.gov.in/portal/Ration_Card_State_Portals_AA',
        actionLabel: 'Visit State Ration Portal',
      }
    ]
  },

  {
    id: 'pmay-g',
    name: 'PM Awas Yojana - Gramin (PMAY-G)',
    hindiName: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    shortName: 'PMAY-G',
    ministry: 'Ministry of Rural Development',
    level: 'Central',
    state: 'All-India',
    category: 'Housing',
    benefitType: 'Housing Grant & Subsidy',
    benefitAmount: '₹1,20,000 to ₹1,30,000 + 90 days MGNREGA wages + ₹12,000 toilet grant',
    numericAnnualValue: 132000,
    officialPortal: 'https://pmayg.nic.in',
    portalName: 'PMAY-G AwaasSoft Portal',
    applicationMode: 'Gram Sabha Priority List / Awaas+ Mobile App',
    processingTime: '45 - 90 days',
    description: 'Financial assistance to rural households that are homeless or living in kutcha and dilapidated houses for constructing a pucca house with basic amenities.',

    eligibilityRules: {
      location: 'Rural',
      housingType: ['Kutcha', 'Thatched', 'Homeless', 'Single Room'],
      ownsPuccaHouse: false,
      isIncomeTaxPayer: false,
      hasFourWheeler: false,
    },

    evidenceRequirements: [
      {
        id: 'ev_land_site_proof',
        title: 'Land / Homestead Site Ownership or Allotment Certificate',
        authority: 'Gram Panchayat / Gram Pradhan',
        description: 'Proof of land possession or house site allotted by Gram Panchayat.',
        sourcePortal: 'Gram Panchayat Office',
        actionText: 'Obtain site certificate from Panchayat Secretary',
        isCritical: true,
      },
      {
        id: 'ev_kutcha_photographs',
        title: 'Geo-Tagged Photographs of Existing Kutcha House',
        authority: 'Block Development Officer (BDO) / Awaas App',
        description: 'Geotagged image evidence taken by village surveyor verifying kutcha structure.',
        sourcePortal: 'AwaasApp mobile application',
        actionText: 'Request Gram Rozgar Sahayak to capture Geo-tag',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_mgnrega_job_card',
        title: 'Active MGNREGA Job Card',
        description: 'House construction grant is bundled with 90-95 person-days of unskilled labor under MGNREGA (~₹25,000 extra wage support).',
        severity: 'High',
        whyItBlocks: 'Installments cannot be sanctioned unless mapped to an active MGNREGA Job Card number in AwaasSoft.',
        resolutionSteps: 'Apply for Job Card at Gram Panchayat Office (free of cost, issued within 15 days).',
        resolutionUrl: 'https://nrega.nic.in',
        actionLabel: 'Check MGNREGA Job Card Status',
      },
      {
        id: 'pre_gram_sabha_inclusion',
        title: 'Inclusion in Gram Sabha Awaas+ Waiting List',
        description: 'Beneficiary must be registered in the Awaas+ survey and verified by the Gram Sabha resolution.',
        severity: 'High',
        whyItBlocks: 'PMAY-G sanctions strictly follow the verified priority score order on AwaasSoft.',
        resolutionSteps: 'Verify your name in the Gram Panchayat Awaas+ priority register with Panchayat Secretary.',
        resolutionUrl: 'https://rhreporting.nic.in/netiwork/newreport.aspx',
        actionLabel: 'Search Beneficiary in AwaasSoft',
      }
    ]
  },

  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi (PM Street Vendor\'s AtmaNirbhar Nidhi)',
    hindiName: 'पीएम स्वनिधि (स्ट्रीट वेंडर्स आत्मनिर्भर निधि)',
    shortName: 'PM SVANidhi',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    level: 'Central',
    state: 'All-India',
    category: 'Livelihood & Credit',
    benefitType: 'Collateral-Free Working Capital Loan & 7% Interest Subsidy',
    benefitAmount: '₹10,000 (1st Tranche) → ₹20,000 (2nd Tranche) → ₹50,000 (3rd Tranche)',
    numericAnnualValue: 50000,
    officialPortal: 'https://pmsvanidhi.mohua.gov.in',
    portalName: 'PM SVANidhi Portal',
    applicationMode: 'Online Portal / Common Service Centre / Lending Institutions',
    processingTime: '7 - 14 days',
    description: 'Empowers urban street vendors with collateral-free working capital micro-credit, interest subsidy of 7% per annum on timely repayment, and cashback on digital transactions.',

    eligibilityRules: {
      occupation: ['Street Vendor', 'Hawker', 'Artisan / Small Food Cart', 'Daily Market Seller'],
      location: 'Urban',
      hasActiveBank: true,
    },

    evidenceRequirements: [
      {
        id: 'ev_vendor_cov',
        title: 'Certificate of Vending (CoV) / Identity Card from Urban Local Body',
        authority: 'Municipality / Municipal Corporation (ULB)',
        description: 'Official street vending card issued by Town Vending Committee (TVC).',
        sourcePortal: 'Local Municipality TVC Office',
        actionText: 'Obtain vending card from Nagar Nigam / Palika',
        isCritical: true,
      },
      {
        id: 'ev_bank_passbook',
        title: 'Active Bank Savings Account Passbook or Statement',
        authority: 'Commercial Bank / Grameen Bank / Cooperative Bank',
        description: 'Account details where loan funds will be disbursed and repayment auto-debited.',
        sourcePortal: 'Bank Branch / Net Banking',
        actionText: 'Verify active bank account passbook copy',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_ulb_lor',
        title: 'Letter of Recommendation (LoR) from ULB / TVC (If CoV Missing)',
        description: 'Vendors not issued a Certificate of Vending require a formal Letter of Recommendation generated by the ULB.',
        severity: 'High',
        whyItBlocks: 'Lending banks instantly reject applications lacking either a CoV ID or an ULB LoR application number.',
        resolutionSteps: 'Submit an LoR application on the PM SVANidhi portal under "Apply for LoR" with endorsement from vendor association.',
        resolutionUrl: 'https://pmsvanidhi.mohua.gov.in/Home/LoRApplication',
        actionLabel: 'Apply for LoR on PM SVANidhi Portal',
      },
      {
        id: 'pre_upi_qr_onboarding',
        title: 'UPI Digital QR Code Setup for Cashback Incentive',
        description: 'Vendors receive up to ₹1,200 annual cashback (₹100/mo) upon transacting digitally via BHIM / PhonePe / Paytm / Google Pay.',
        severity: 'Low',
        whyItBlocks: 'Not blocking for loan sanction, but unlocks the ₹1,200/year cashback benefit.',
        resolutionSteps: 'Order merchant QR soundbox or digital QR linked to the same bank account.',
        resolutionUrl: 'https://pmsvanidhi.mohua.gov.in',
        actionLabel: 'Link UPI QR Code',
      }
    ]
  },

  {
    id: 'ssy',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    hindiName: 'सुकन्या समृद्धि योजना',
    shortName: 'Sukanya Samriddhi',
    ministry: 'Ministry of Finance & Department of Posts',
    level: 'Central',
    state: 'All-India',
    category: 'Child & Girl Welfare',
    benefitType: 'High-Interest Sovereign Savings & Tax Exemption',
    benefitAmount: '8.2% Compound Annual Interest + Section 80C Tax Exemption',
    numericAnnualValue: 24000,
    officialPortal: 'https://www.indiapost.gov.in',
    portalName: 'India Post Savings Bank',
    applicationMode: 'Post Office or Authorized Bank Branch (SBI, PNB, etc.)',
    processingTime: 'Same day account opening',
    description: 'Government backed small deposit savings scheme for girl child under Beti Bachao Beti Padhao initiative, offering the highest sovereign interest rate with triple tax-exempt status.',

    eligibilityRules: {
      hasGirlChildUnder10: true,
      maxAgeGirlChild: 10,
    },

    evidenceRequirements: [
      {
        id: 'ev_girl_birth_cert',
        title: 'Birth Certificate of the Girl Child',
        authority: 'Municipal Registrar / Gram Panchayat Secretary',
        description: 'Official birth certificate stating the name of the girl child and parent names.',
        sourcePortal: 'State Civil Registration System / DigiLocker',
        actionText: 'Download digital Birth Certificate via DigiLocker',
        isCritical: true,
      },
      {
        id: 'ev_parent_kyc',
        title: 'Parent / Legal Guardian Identity & Address Proof',
        authority: 'UIDAI / IT Department',
        description: 'Aadhaar Card and PAN of the biological parent or legal guardian.',
        sourcePortal: 'https://myaadhaar.uidai.gov.in',
        actionText: 'Prepare Aadhaar and PAN self-attested copies',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_birth_cert_name_endorsement',
        title: 'Formal Name Endorsement on Birth Certificate',
        description: 'Birth certificates with "Baby of [Mother]" without child\'s legal first name are rejected by Post Office banking systems.',
        severity: 'High',
        whyItBlocks: 'Post Office Core Banking (Finacle) cannot open SSY CIF without child\'s official legal name on certificate.',
        resolutionSteps: 'Visit Registrar of Births & Deaths office in your municipal ward or block to add child\'s registered name.',
        resolutionUrl: 'https://crsorgi.gov.in',
        actionLabel: 'Check Birth Registration Portal',
      },
      {
        id: 'pre_post_office_account',
        title: 'Initial Deposit & Physical Account Opening Form',
        description: 'Minimum initial deposit of ₹250 required to activate the passbook.',
        severity: 'Medium',
        whyItBlocks: 'Account is not online-only; physical signature of parent is required at nearest post office.',
        resolutionSteps: 'Fill Form-1 (SSY Account Opening) available at any branch of India Post or public sector bank.',
        resolutionUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/SSY.aspx',
        actionLabel: 'Download SSY Account Opening Form',
      }
    ]
  },

  {
    id: 'post-matric-scholarship',
    name: 'Post-Matric Scholarship Scheme for SC / ST / OBC / EBC Students',
    hindiName: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    shortName: 'Post-Matric Scholarship',
    ministry: 'Ministry of Social Justice & Empowerment / Tribal Affairs',
    level: 'Central & State Sponsored',
    state: 'All-India',
    category: 'Education',
    benefitType: 'Tuition Fee Reimbursement + Monthly Maintenance Allowance',
    benefitAmount: '₹4,000 to ₹18,000 / year (Direct into Student Bank Account)',
    numericAnnualValue: 12000,
    officialPortal: 'https://scholarships.gov.in',
    portalName: 'National Scholarship Portal (NSP)',
    applicationMode: 'NSP Portal with OTR (One Time Registration)',
    processingTime: '30 - 60 days following institute verification',
    description: 'Financial assistance to students belonging to marginalized categories studying at post-matriculation or post-secondary stages to enable them to complete their education.',

    eligibilityRules: {
      hasSchoolOrCollegeStudents: true,
      category: ['SC', 'ST', 'OBC', 'EBC', 'Minority'],
      maxAnnualIncome: 250000,
      studentClass: 'Higher Secondary / College / Diploma',
    },

    evidenceRequirements: [
      {
        id: 'ev_caste_cert',
        title: 'Digital Caste Certificate with Verification Barcode',
        authority: 'Sub-Divisional Magistrate (SDM) / Tehsildar',
        description: 'State government issued permanent caste/community certificate.',
        sourcePortal: 'State e-District / Edistrict Portal',
        actionText: 'Fetch digital caste certificate from DigiLocker',
        isCritical: true,
      },
      {
        id: 'ev_income_cert_current',
        title: 'Income Certificate Issued in Current Financial Year',
        authority: 'Tehsildar / Revenue Inspector',
        description: 'Income certificate showing annual family income <= ₹2.50 Lakh, valid for current year.',
        sourcePortal: 'State e-District Portal',
        actionText: 'Apply for fresh Income Certificate (validity: 1 year)',
        isCritical: true,
      },
      {
        id: 'ev_bonafide_student',
        title: 'Bonafide Student Certificate & Fee Receipt from College/School',
        authority: 'Head of Institution / Principal',
        description: 'Letterhead certificate confirming ongoing enrollment, course, and roll number.',
        sourcePortal: 'School / College Administration Office',
        actionText: 'Collect Bonafide signed by Principal',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_nsp_otr',
        title: 'NSP One-Time Registration (OTR) with Face-RD App',
        description: 'NSP requires mandatory OTR registration using Aadhaar Face Authentication via AadhaarFaceRD mobile app.',
        severity: 'High',
        whyItBlocks: 'Fresh applications cannot be filled without a verified 14-digit OTR number.',
        resolutionSteps: 'Install NSP OTR App and Aadhaar FaceRD on Android, scan student\'s face, and generate OTR ID.',
        resolutionUrl: 'https://scholarships.gov.in/fresh/newstdRegfrmInstruction',
        actionLabel: 'Register on National Scholarship Portal',
      },
      {
        id: 'pre_student_npci_seed',
        title: 'Student\'s Own Bank Account Seeded with Aadhaar (NPCI DBT)',
        description: 'Funds are strictly disbursed to student\'s personal bank account mapped in NPCI mapper (parent accounts not accepted).',
        severity: 'High',
        whyItBlocks: 'Scholarship payment fails during PFMS validation if bank account is minor / unseeded.',
        resolutionSteps: 'Ensure student has an independent savings bank account and submit DBT consent mandate at bank.',
        resolutionUrl: 'https://myaadhaar.uidai.gov.in/check-aadhaar-bank-account-status',
        actionLabel: 'Verify Student Bank DBT Status',
      }
    ]
  },

  {
    id: 'pm-ujjwala',
    name: 'PM Ujjwala Yojana 2.0 (Pradhan Mantri Ujjwala Yojana)',
    hindiName: 'प्रधानमंत्री उज्ज्वला योजना 2.0',
    shortName: 'PM Ujjwala 2.0',
    ministry: 'Ministry of Petroleum and Natural Gas (MoPNG)',
    level: 'Central',
    state: 'All-India',
    category: 'Energy & Fuel',
    benefitType: 'Free LPG Connection + First Refill & Hotplate (Stove)',
    benefitAmount: '100% Free Connection (Worth ~₹3,200) + ₹300 Subsidy per cylinder refill',
    numericAnnualValue: 6800,
    officialPortal: 'https://www.pmuy.gov.in',
    portalName: 'PMUY 2.0 Official Portal',
    applicationMode: 'Online through LPG Distributor (Indane, BharatGas, HP Gas) or CSC',
    processingTime: '7 - 10 days',
    description: 'Provides deposit-free LPG connection to adult women from poor and deprived households, accompanied by a free first cylinder refill and gas stove.',

    eligibilityRules: {
      hasAdultFemale: true,
      isBPLOrPoor: true,
      hasExistingLpgConnection: false,
      maxAnnualIncome: 200000,
    },

    evidenceRequirements: [
      {
        id: 'ev_ration_card_family',
        title: 'Ration Card Showing Household Composition',
        authority: 'State Food & Civil Supplies Department',
        description: 'Ration card displaying names of all adult members in the beneficiary family.',
        sourcePortal: 'NFSA Portal / Ration Dealer',
        actionText: 'Provide Ration Card copy showing family tree',
        isCritical: true,
      },
      {
        id: 'ev_14_point_decl',
        title: '14-Point Declaration Annexure-I for Migrant/Poor Households',
        authority: 'Self-Declaration Form endorsed by Gas Agency',
        description: 'Standard declaration certifying no other LPG connection exists in the same household.',
        sourcePortal: 'https://www.pmuy.gov.in/annexure.html',
        actionText: 'Sign standard 14-point declaration form',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_female_bank_aadhaar',
        title: 'Woman Applicant\'s Bank Account Linked with Aadhaar',
        description: 'LPG cylinder subsidy (DBTL / PAHAL) is deposited directly into the woman head of household\'s bank account.',
        severity: 'High',
        whyItBlocks: 'Oil Marketing Companies (OMCs) cannot release connections without active DBT-seeded account for subsidy routing.',
        resolutionSteps: 'Visit nearest bank or post office to open zero-balance Jan Dhan account for the woman applicant.',
        resolutionUrl: 'https://pmuy.gov.in/apply.html',
        actionLabel: 'Apply for Ujjwala 2.0 Online',
      },
      {
        id: 'pre_omc_deduplication',
        title: 'OMC National LPG De-duplication Clearance',
        description: 'Central database checks across Indian Oil, BPCL, and HPCL to guarantee no prior connection exists at the address.',
        severity: 'Medium',
        whyItBlocks: 'Matches with previous old connection at village address can temporarily freeze the sanction.',
        resolutionSteps: 'If previously held connection was surrendered, present Surrender Certificate to distributor.',
        resolutionUrl: 'https://www.pmuy.gov.in',
        actionLabel: 'Locate Nearest LPG Distributor',
      }
    ]
  },

  {
    id: 'pm-kmy',
    name: 'PM Kisan Maandhan Yojana (Old Age Pension for Small Farmers)',
    hindiName: 'प्रधानमंत्री किसान मानधन योजना',
    shortName: 'PM-KMY Pension',
    ministry: 'Ministry of Agriculture & Farmers Welfare & LIC of India',
    level: 'Central',
    state: 'All-India',
    category: 'Social Security',
    benefitType: 'Guaranteed Monthly Pension',
    benefitAmount: '₹3,000 / month (₹36,000 / year) after age 60',
    numericAnnualValue: 36000,
    officialPortal: 'https://maandhan.in',
    portalName: 'Maandhan Central Portal',
    applicationMode: 'CSC Centers or Online Self-Enrollment',
    processingTime: 'Instant Pension Card generation',
    description: 'Voluntary and contributory pension scheme for small and marginal farmers aged 18 to 40 years, with equal 50% matching contribution by Central Government.',

    eligibilityRules: {
      occupation: ['Farmer'],
      minAge: 18,
      maxAge: 40,
      maxLandAcres: 5.0,
      isIncomeTaxPayer: false,
    },

    evidenceRequirements: [
      {
        id: 'ev_kmy_land_proof',
        title: 'Khasra / Khatauni Showing Cultivable Land Up to 2 Hectares',
        authority: 'State Revenue Authority',
        description: 'Proof of landholding confirming small or marginal farmer status.',
        sourcePortal: 'Bhulekh / Tehsil',
        actionText: 'Obtain land record extract',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_auto_debit_mandate',
        title: 'Bank Auto-Debit Mandate for Monthly Premium (₹55 - ₹200)',
        description: 'Subscriber must authorize monthly debit of their 50% premium portion (which is matched by Central Govt).',
        severity: 'High',
        whyItBlocks: 'Pension policy cannot be issued without bank auto-debit confirmation via NACH / e-mandate.',
        resolutionSteps: 'Authorize mandate via debit card / Net Banking during CSC enrollment or submit signed form at bank.',
        resolutionUrl: 'https://maandhan.in',
        actionLabel: 'Enroll in PM-KMY on Maandhan Portal',
      }
    ]
  },

  {
    id: 'ladli-behna',
    name: 'Mukhyamantri Ladli Behna Yojana (Madhya Pradesh)',
    hindiName: 'मुख्यमंत्री लाड़ली बहना योजना',
    shortName: 'Ladli Behna',
    ministry: 'Department of Women & Child Development, Govt of MP',
    level: 'State',
    state: 'Madhya Pradesh',
    category: 'Direct Benefit Transfer',
    benefitType: 'Monthly Direct Cash Transfer',
    benefitAmount: '₹1,250 / month (₹15,000 / year) direct into woman\'s account',
    numericAnnualValue: 15000,
    officialPortal: 'https://cmladlibehna.mp.gov.in',
    portalName: 'CM Ladli Behna Portal MP',
    applicationMode: 'Gram Panchayat Camps / Ward Office Registration',
    processingTime: '20 - 30 days',
    description: 'Pioneering monthly financial assistance provided directly to resident women of Madhya Pradesh to foster economic self-reliance and health.',

    eligibilityRules: {
      state: 'Madhya Pradesh',
      hasAdultFemale: true,
      femaleMinAge: 21,
      femaleMaxAge: 60,
      maxAnnualIncome: 250000,
      isIncomeTaxPayer: false,
    },

    evidenceRequirements: [
      {
        id: 'ev_samagra_id',
        title: 'Samagra Family & Member ID (9 Digits)',
        authority: 'Social Justice Department, Govt of MP',
        description: 'Individual Samagra ID of the woman applicant and family Samagra ID.',
        sourcePortal: 'https://samagra.gov.in',
        actionText: 'Check Samagra Member ID online',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_samagra_ekyc',
        title: 'Samagra Aadhaar e-KYC Completion',
        description: 'Samagra portal data must match 100% with UIDAI Aadhaar record (Name, DOB, Gender).',
        severity: 'High',
        whyItBlocks: 'Ladli Behna portal registration form is pre-filled from Samagra; unlinked Samagra profiles throw fatal error.',
        resolutionSteps: 'Complete Samagra e-KYC using biometric fingerprint or mobile OTP at MP Online kiosk or Samagra portal.',
        resolutionUrl: 'https://samagra.gov.in/Citizen/eKYC.aspx',
        actionLabel: 'Complete Samagra e-KYC Online',
      },
      {
        id: 'pre_mp_dbt_active',
        title: 'Direct Benefit Transfer (DBT) Active in Single Account',
        description: 'State government rules require DBT to be mapped only to an individual account (joint accounts often result in bounce).',
        severity: 'High',
        whyItBlocks: 'Monthly installment of ₹1,250 fails on 10th of every month if bank account does not have DBT enabled.',
        resolutionSteps: 'Visit your home bank branch and request DBT enabling on your individual savings account.',
        resolutionUrl: 'https://cmladlibehna.mp.gov.in',
        actionLabel: 'Verify Status on Ladli Behna Portal',
      }
    ]
  },

  {
    id: 'atal-pension',
    name: 'Atal Pension Yojana (APY)',
    hindiName: 'अटल पेंशन योजना',
    shortName: 'Atal Pension',
    ministry: 'PFRDA & Department of Financial Services',
    level: 'Central',
    state: 'All-India',
    category: 'Retirement & Pension',
    benefitType: 'Guaranteed Monthly Pension by Govt of India',
    benefitAmount: 'Guaranteed pension of ₹1,000 to ₹5,000 / month from age 60',
    numericAnnualValue: 60000,
    officialPortal: 'https://www.npscra.nsdl.co.in',
    portalName: 'NPS CRA / PFRDA Portal',
    applicationMode: 'Online via Net Banking or Bank Branch visit',
    processingTime: '3 - 5 business days for PRAN generation',
    description: 'Government-guaranteed pension scheme primarily focused on unorganized sector workers, providing a fixed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60.',

    eligibilityRules: {
      minAge: 18,
      maxAge: 40,
      isIncomeTaxPayer: false,
      hasActiveBank: true,
    },

    evidenceRequirements: [
      {
        id: 'ev_bank_kyc',
        title: 'Savings Bank Account with KYC',
        authority: 'Bank Branch',
        description: 'Active savings account with full KYC compliance.',
        sourcePortal: 'Bank Branch',
        actionText: 'Confirm KYC completed at bank branch',
        isCritical: true,
      }
    ],

    prerequisites: [
      {
        id: 'pre_apy_nach_mandate',
        title: 'Periodic Auto-Debit Authorization (NACH / Standing Instruction)',
        description: 'Monthly/quarterly contribution must be deducted automatically from the savings bank account.',
        severity: 'High',
        whyItBlocks: 'If account lacks sufficient balance or mandate is revoked, penalty of ₹1 per ₹100 is levied and account enters dormant state.',
        resolutionSteps: 'Submit APY subscriber registration form at your bank branch or activate APY online in mobile banking.',
        resolutionUrl: 'https://enps.nsdl.com/eNPS/ApySubRegistration.html',
        actionLabel: 'Open APY Online via eNPS',
      }
    ]
  }
];
