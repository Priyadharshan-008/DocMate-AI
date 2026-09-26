// DocMate AI - Standalone Universal Application Controller
// Works on both file:/// (local direct open) and http:// (web server) without CORS module limitations.

(function () {
  'use strict';

  // ==========================================
  // 1. DATASET: SERVICES & SITUATIONAL CONFIG
  // ==========================================
  const SERVICES_DATA = [
    {
      id: "birth-certificate",
      category: "certificates",
      name_en: "Birth Certificate",
      name_ta: "பிறப்புச் சான்றிதழ்",
      desc_en: "Official record of a person's birth issued by Corporation / Municipality / Village Panchayat.",
      desc_ta: "மாநகராட்சி, நகராட்சி அல்லது கிராம பஞ்சாயத்தால் வழங்கப்படும் அதிகாரப்பூர்வ பிறப்பு பதிவு ஆவணம்.",
      issuing_authority_en: "Corporation / Municipality / Revenue Dept",
      issuing_authority_ta: "மாநகராட்சி / நகராட்சி / வருவாய்த்துறை",
      standard_fee: "₹60 (e-Seva service charge)",
      processing_days: "7 - 15 Working Days",
      icon: "baby",
      documents: [
        {
          id: "doc-bc-1",
          name_en: "Hospital Birth Discharge Summary / Form 1",
          name_ta: "மருத்துவமனை பிறப்பு அறிக்கை / படிவம் 1",
          category: "primary_proof",
          reason_en: "Proves date, time, sex, and place of child birth as reported by the medical institution.",
          reason_ta: "மருத்துவமனையில் குழந்தை பிறந்த தேதி, நேரம், பாலினம் மற்றும் இடத்தை நிரூபிக்கிறது.",
          format: "original_and_copy",
          format_label_en: "Original + 1 Photocopy",
          format_label_ta: "அசல் + 1 நகல்",
          note_en: "Must be signed/stamped by the hospital medical officer with registration number.",
          note_ta: "மருத்துவ அதிகாரியின் கையொப்பம் மற்றும் முத்திரை இருக்க வேண்டும்.",
          essential: true
        },
        {
          id: "doc-bc-2",
          name_en: "Parents' Aadhaar Cards",
          name_ta: "பெற்றோரின் ஆதார் அட்டைகள்",
          category: "identity_proof",
          reason_en: "Verifies the identity, nationality, and parental relationship of both parents.",
          reason_ta: "தாய், தந்தை இருவரின் அடையாளம் மற்றும் பெற்றோர் உரிமையை சரிபார்க்கிறது.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Photocopy",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்",
          note_en: "Carry original Aadhaar cards for spot inspection at the e-Seva or Registrar desk.",
          note_ta: "சரிபார்ப்பிற்காக அசல் ஆதாரை உடன் எடுத்துச் செல்லவும்.",
          essential: true
        },
        {
          id: "doc-bc-3",
          name_en: "Parents' Marriage Certificate / Ration Card",
          name_ta: "பெற்றோர் திருமணச் சான்றிதழ் / குடும்ப அட்டை",
          category: "relationship_proof",
          reason_en: "Validates marital status of parents and confirms family household listing.",
          reason_ta: "பெற்றோரின் திருமண உறுதி மற்றும் குடும்ப சேர்க்கையை உறுதி செய்ய.",
          format: "photocopy",
          format_label_en: "1 Photocopy",
          format_label_ta: "1 நகல்",
          note_en: "If marriage certificate is unavailable, Smart Ration Card or joint affidavit can be submitted.",
          note_ta: "திருமணச் சான்றிதழ் இல்லையெனில், ஸ்மார்ட் ரேஷன் கார்டு சமர்ப்பிக்கலாம்.",
          essential: false
        },
        {
          id: "doc-bc-4",
          name_en: "Address Proof of Parents (Electricity Bill / Gas / Ration)",
          name_ta: "பெற்றோரின் முகவரி சான்று (மின் கட்டணம் / ரேஷன் அட்டை)",
          category: "address_proof",
          reason_en: "Establishes permanent/current residence jurisdiction for certificate delivery.",
          reason_ta: "சான்றிதழ் வழங்கும் அதிகார வரம்பை உறுதி செய்ய முகவரி சான்று தேவை.",
          format: "photocopy",
          format_label_en: "1 Photocopy (Recent)",
          format_label_ta: "1 நகல் (சமீபத்தியது)",
          note_en: "Address should match the locality of the registrar office if applying locally.",
          note_ta: "முகவரி சம்பந்தப்பட்ட எல்லைக்குள் இருத்தல் நலம்.",
          essential: true
        },
        {
          id: "doc-bc-5",
          name_en: "Delayed Registration Non-Availability Certificate (If > 1 year)",
          name_ta: "தாமத பதிவுக்கான தடையில்லாச் சான்று (1 வருடத்திற்கு மேல் எனில்)",
          category: "supporting_proof",
          reason_en: "Mandatory if birth was not registered within 21 days or 1 year under Section 13(3) of RBD Act.",
          reason_ta: "குழந்தை பிறந்து 1 வருடத்திற்கு மேல் பதிவு செய்யப்படாமல் இருந்தால் வருவாய் கோட்டாட்சியர் (RDO) உத்தரவு தேவை.",
          format: "original",
          format_label_en: "Original Order / Court Order",
          format_label_ta: "அசல் ஆணை / நீதிமன்ற உத்தரவு",
          note_en: "Requires an affidavit and order from the Revenue Divisional Officer (RDO) or Magistrate.",
          note_ta: "RDO அல்லது வட்டாட்சியர் அனுமதியுடன் கூடிய பிரமாணப் பத்திரம் தேவை.",
          essential: false,
          conditional: "Only for delayed registration (>1 year)"
        }
      ]
    },
    {
      id: "community-certificate",
      category: "certificates",
      name_en: "Community Certificate (SC / ST / BC / MBC / OBC)",
      name_ta: "சாதிச் சான்றிதழ் (BC / MBC / SC / ST / OBC)",
      desc_en: "Certifies reservation category for education, government examinations, and welfare benefits.",
      desc_ta: "கல்வி, வேலைவாய்ப்பு மற்றும் அரசு நலத்திட்டங்களுக்கான சாதி பிரிவு சான்றளிப்பு ஆவணம்.",
      issuing_authority_en: "Revenue Dept (Tahsildar / Zonal Deputy Tahsildar)",
      issuing_authority_ta: "வருவாய்த்துறை (வட்டாட்சியர் / மண்டல துணை வட்டாட்சியர்)",
      standard_fee: "₹60 (e-Seva charge)",
      processing_days: "15 - 30 Working Days",
      icon: "badge",
      documents: [
        {
          id: "doc-cc-1",
          name_en: "Applicant's School Transfer Certificate (TC) / Marksheet",
          name_ta: "விண்ணப்பதாரரின் பள்ளி மாற்றுச் சான்றிதழ் (TC) / மதிப்பெண் பட்டியல்",
          category: "primary_proof",
          reason_en: "Contains student's community/caste as recorded during school admission.",
          reason_ta: "பள்ளி சேர்க்கையின் போது பதிவு செய்யப்பட்ட சாதி விபரத்தை நிரூபிக்கிறது.",
          format: "photocopy_self_attested",
          format_label_en: "Photocopy with School Stamp",
          format_label_ta: "பள்ளி முத்திரையுடன் கூடிய நகல்",
          note_en: "Community column should not be left blank or written as 'Not Disclosed'.",
          note_ta: "சாதி பத்தி காலியாக இருக்கக்கூடாது.",
          essential: true
        },
        {
          id: "doc-cc-2",
          name_en: "Father's or Mother's Community Certificate",
          name_ta: "தந்தை அல்லது தாயின் சாதிச் சான்றிதழ்",
          category: "relationship_proof",
          reason_en: "Crucial lineage evidence proving heritage and family community status.",
          reason_ta: "குடும்பத்தின் வம்சாவளி சாதி நிலையை உறுதி செய்யும் முதன்மை ஆதாரம்.",
          format: "photocopy",
          format_label_en: "Photocopy (Original for verification)",
          format_label_ta: "நகல் (சரிபார்க்க அசல்)",
          note_en: "If parents' certificates are unavailable, sibling's or paternal uncle's certificate can be attached.",
          note_ta: "பெற்றோர் சான்றிதழ் இல்லையெனில் உடன்பிறந்தோரின் சான்றிதழ் சமர்ப்பிக்கலாம்.",
          essential: true
        },
        {
          id: "doc-cc-3",
          name_en: "Applicant's Aadhaar Card",
          name_ta: "விண்ணப்பதாரரின் ஆதார் அட்டை",
          category: "identity_proof",
          reason_en: "Biometric and demographic identity verification for the citizen.",
          reason_ta: "விண்ணப்பதாரரின் அடையாளம் மற்றும் முகவரியை உறுதி செய்ய.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Copy",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்",
          note_en: "Ensure applicant name matches school records.",
          note_ta: "ஆதாரில் உள்ள பெயர் பள்ளி பதிவேடுகளுடன் பொருந்த வேண்டும்.",
          essential: true
        },
        {
          id: "doc-cc-4",
          name_en: "Smart Family Ration Card",
          name_ta: "ஸ்மார்ட் குடும்ப அட்டை",
          category: "address_proof",
          reason_en: "Proves family structure and local village/taluk jurisdiction under the VAO.",
          reason_ta: "குடும்ப உறவு மற்றும் உள்ளூர் கிராம நிர்வாக அலுவலர் (VAO) எல்லை சரிபார்ப்புக்கு.",
          format: "photocopy",
          format_label_en: "Photocopy",
          format_label_ta: "நகல்",
          note_en: "Applicant must be listed as a member in the active ration card.",
          note_ta: "ரேஷன் கார்டில் விண்ணப்பதாரர் பெயர் சேர்க்கப்பட்டிருக்க வேண்டும்.",
          essential: true
        },
        {
          id: "doc-cc-5",
          name_en: "Recent Passport Size Photographs (2 Nos)",
          name_ta: "சமீபத்திய பாஸ்போர்ட் அளவு புகைப்படங்கள் (2)",
          category: "photographs",
          reason_en: "Affixed onto physical records and e-District digital identity archive.",
          reason_ta: "மின் ஆவண காப்பகம் மற்றும் பதிவேடுகளுக்காக.",
          format: "physical_photos",
          format_label_en: "2 Color Photos (White Background)",
          format_label_ta: "2 வண்ணப் படங்கள் (வெள்ளை பின்னணி)",
          note_en: "Must be clear and recent (within past 3 months).",
          note_ta: "3 மாதங்களுக்குள் எடுக்கப்பட்ட சமீபத்திய புகைப்படம்.",
          essential: true
        },
        {
          id: "doc-cc-6",
          name_en: "Self-Declaration / VAO Inquiry Report",
          name_ta: "சுய அறிவிப்பு / கிராம நிர்வாக அலுவலர் (VAO) அறிக்கை",
          category: "supporting_proof",
          reason_en: "Mandatory local field verification report by the Village Administrative Officer.",
          reason_ta: "கிராம நிர்வாக அலுவலர் மற்றும் வருவாய் ஆய்வாளரின் கள விசாரணை அறிக்கை.",
          format: "original",
          format_label_en: "System Generated / VAO Endorsed",
          format_label_ta: "VAO பரிந்துரை / இணைய ஒப்புதல்",
          note_en: "Usually done digitally via e-District workflow after applying at e-Seva.",
          note_ta: "இ-சேவை மையத்தில் விண்ணப்பித்த பின் VAO நேரடியாக களஆய்வு செய்வார்.",
          essential: true
        }
      ]
    },
    {
      id: "income-certificate",
      category: "revenue",
      name_en: "Income Certificate",
      name_ta: "வருமானச் சான்றிதழ்",
      desc_en: "Document specifying the annual household income of a family, needed for scholarships & welfare.",
      desc_ta: "குடும்பத்தின் ஆண்டு வருமானத்தை உறுதி செய்யும் சான்றிதழ் (உதவித்தொகை மற்றும் சலுகைகளுக்கு).",
      issuing_authority_en: "Revenue Department (Tahsildar)",
      issuing_authority_ta: "வருவாய்த்துறை (வட்டாட்சியர்)",
      standard_fee: "₹60 (e-Seva charge)",
      processing_days: "7 - 15 Working Days",
      icon: "currency",
      documents: [
        {
          id: "doc-ic-1",
          name_en: "Salary Slip / Form 16 / Income Affidavit",
          name_ta: "சம்பள ரசீது / படிவம் 16 / வருமான பிரமாணப் பத்திரம்",
          category: "primary_proof",
          reason_en: "Verifies the current earnings from employment or business.",
          reason_ta: "மாதாந்திர சம்பளம் அல்லது தொழில் வருமானத்தை நிரூபிக்க.",
          format: "original_and_copy",
          format_label_en: "Original Salary Slip / Notarized Affidavit",
          format_label_ta: "சமீபத்திய சம்பள ரசீது / நோட்டரி சான்று",
          note_en: "For daily wage / agricultural earners, a notarized self-affidavit is accepted.",
          note_ta: "தினக்கூலி அல்லது விவசாயிகளுக்கு நோட்டரி பிரமாணப் பத்திரம் போதுமானது.",
          essential: true
        },
        {
          id: "doc-ic-2",
          name_en: "Smart Family Ration Card",
          name_ta: "ஸ்மார்ட் குடும்ப அட்டை",
          category: "address_proof",
          reason_en: "Lists all earning and non-earning members of the household.",
          reason_ta: "குடும்பத்தில் உள்ள அனைத்து உறுப்பினர்களையும் வருமானத்தில் கணக்கிட.",
          format: "photocopy",
          format_label_en: "Photocopy",
          format_label_ta: "நகல்",
          note_en: "Ensure ration card is linked and active with correct member count.",
          note_ta: "ரேஷன் கார்டு செயலில் உள்ளதை உறுதிப்படுத்தவும்.",
          essential: true
        },
        {
          id: "doc-ic-3",
          name_en: "Applicant / Head of Family's Aadhaar Card",
          name_ta: "விண்ணப்பதாரர் / குடும்பத் தலைவரின் ஆதார் அட்டை",
          category: "identity_proof",
          reason_en: "Primary identity verification for the citizen requesting income assessment.",
          reason_ta: "விண்ணப்பதாரரின் அடையாளத்தை உறுதிப்படுத்த.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Copy",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்",
          note_en: "Must be clearly readable with DOB visible.",
          note_ta: "பிறந்த தேதி தெளிவாகத் தெரிய வேண்டும்.",
          essential: true
        },
        {
          id: "doc-ic-4",
          name_en: "Property Tax Receipt / EB Bill / Rental Agreement",
          name_ta: "சொத்து வரி ரசீது / மின்கட்டண ரசீது / வாடகை ஒப்பந்தம்",
          category: "address_proof",
          reason_en: "Proves current residential status and property ownership details.",
          reason_ta: "தற்போதைய குடியிருப்பு மற்றும் சொத்து விவரங்களை மதிப்பிட.",
          format: "photocopy",
          format_label_en: "Latest Receipt Copy",
          format_label_ta: "சமீபத்திய ரசீது நகல்",
          note_en: "Recent receipt within last 6 months.",
          note_ta: "கடந்த 6 மாதங்களுக்குள் செலுத்தப்பட்ட ரசீது.",
          essential: true
        },
        {
          id: "doc-ic-5",
          name_en: "Bank Passbook Statement (Last 3 - 6 months)",
          name_ta: "வங்கி கணக்குப் புத்தக அறிக்கை (3 முதல் 6 மாதங்கள்)",
          category: "supporting_proof",
          reason_en: "Used by the Revenue Inspector to verify regular incoming cash flows.",
          reason_ta: "வருவாய் ஆய்வாளர் பணப் பரிவர்த்தனைகளை சரிபார்க்க.",
          format: "photocopy",
          format_label_en: "Bank Passbook First Page + Recent Transactions",
          format_label_ta: "வங்கி பாஸ்புக் முதல் பக்கம் + பரிவர்த்தனைகள்",
          note_en: "Ensure account holder name and IFSC are legible.",
          note_ta: "கணக்கு எண் மற்றும் IFSC குறியீடு தெளிவாக இருக்க வேண்டும்.",
          essential: false
        },
        {
          id: "doc-ic-6",
          name_en: "Passport Size Photograph (1 No)",
          name_ta: "பாஸ்போர்ட் அளவு புகைப்படம் (1)",
          category: "photographs",
          reason_en: "Printed directly on the issued digital income certificate.",
          reason_ta: "வழங்கப்படும் மின்னணு சான்றிதழில் பதிவேற்றப்பட.",
          format: "physical_photos",
          format_label_en: "1 Recent Photo",
          format_label_ta: "1 சமீபத்திய புகைப்படம்",
          note_en: "Keep a digital soft copy or passport photo ready.",
          note_ta: "நேரடி ஸ்கேனிங்கிற்கு புகைப்படம் தேவை.",
          essential: true
        }
      ]
    },
    {
      id: "residence-certificate",
      category: "revenue",
      name_en: "Residence / Nativity Certificate",
      name_ta: "இருப்பிடச் சான்றிதழ் / குடியுரிமைச் சான்றிதழ்",
      desc_en: "Proves continuous residence in a specific taluk/district for admission, job quotas, or exams.",
      desc_ta: "குறிப்பிட்ட பகுதியில் தொடர்ந்து வசித்து வருவதை நிரூபிக்கும் சான்றிதழ்.",
      issuing_authority_en: "Revenue Dept (Tahsildar)",
      issuing_authority_ta: "வருவாய்த்துறை (வட்டாட்சியர்)",
      standard_fee: "₹60 (e-Seva charge)",
      processing_days: "7 - 15 Working Days",
      icon: "home",
      documents: [
        {
          id: "doc-rc-1",
          name_en: "Smart Family Ration Card",
          name_ta: "ஸ்மார்ட் குடும்ப அட்டை",
          category: "address_proof",
          reason_en: "Primary legal proof of family domicile in the local fair price shop jurisdiction.",
          reason_ta: "உள்ளூர் நியாய விலை கடை எல்லைக்குள் வசிப்பதற்கான முதன்மை ஆதாரம்.",
          format: "photocopy",
          format_label_en: "Photocopy of both sides",
          format_label_ta: "இரு பக்க நகல்",
          note_en: "Address on ration card will be considered primary.",
          note_ta: "ரேஷன் கார்டில் உள்ள முகவரி முதன்மையாகக் கருதப்படும்.",
          essential: true
        },
        {
          id: "doc-rc-2",
          name_en: "Applicant's Aadhaar Card / Voter ID Card",
          name_ta: "விண்ணப்பதாரர் ஆதார் அட்டை / வாக்காளர் அடையாள அட்டை",
          category: "identity_proof",
          reason_en: "Confirms age, citizenship, and identity of applicant.",
          reason_ta: "விண்ணப்பதாரரின் குடியுரிமை மற்றும் அடையாள சரிபார்ப்பிற்கு.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Copy",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்",
          note_en: "Carry original during verification.",
          note_ta: "சரிபார்ப்பின் போது அசல் எடுத்து வரவும்.",
          essential: true
        },
        {
          id: "doc-rc-3",
          name_en: "Proof of Continuous Residence (5 Years)",
          name_ta: "தொடர் குடியிருப்புக்கான 5 ஆண்டு ஆதாரம்",
          category: "primary_proof",
          reason_en: "Proves living in the State/District continuously (School TC / Gas bill / Land tax / Rental agreement).",
          reason_ta: "5 வருடங்களாக தொடர்ந்து அப்பகுதியில் வசிப்பதற்கான ஆவணம் (பள்ளி TC, வீட்டு வரி).",
          format: "photocopy",
          format_label_en: "School study certificate / House tax receipts (last 5 years)",
          format_label_ta: "பள்ளி படிப்பு சான்றிதழ் / 5 ஆண்டு வீட்டு வரி ரசீதுகள்",
          note_en: "Crucial for Nativity certificates for medical/engineering counseling (NEET/TNEA).",
          note_ta: "மருத்துவ/பொறியியல் கலந்தாய்வுக்கு (NEET/TNEA) இது மிக அவசியம்.",
          essential: true
        },
        {
          id: "doc-rc-4",
          name_en: "Electricity Bill or Property Tax Receipt (Recent)",
          name_ta: "மின் கட்டண ரசீது அல்லது சொத்து வரி ரசீது",
          category: "address_proof",
          reason_en: "Verifies current active residence premises.",
          reason_ta: "தற்போதைய குடியிருப்பு இடத்தை உறுதி செய்ய.",
          format: "photocopy",
          format_label_en: "Latest Receipt Copy",
          format_label_ta: "சமீபத்திய ரசீது நகல்",
          note_en: "If rented, attach Registered Rental Agreement copy.",
          note_ta: "வாடகை வீட்டில் இருப்பின் வாடகை ஒப்பந்த நகல் சமர்ப்பிக்கவும்.",
          essential: true
        },
        {
          id: "doc-rc-5",
          name_en: "Passport Size Photograph (1 No)",
          name_ta: "பாஸ்போர்ட் அளவு புகைப்படம் (1)",
          category: "photographs",
          reason_en: "Required for digital certificate generation.",
          reason_ta: "மின்னணு சான்றிதழ் பதிவுக்கு.",
          format: "physical_photos",
          format_label_en: "1 Recent Photo",
          format_label_ta: "1 புகைப்படம்",
          note_en: "Clean clear front-facing photograph.",
          note_ta: "தெளிவான புகைப்படம்.",
          essential: true
        }
      ]
    },
    {
      id: "death-certificate",
      category: "certificates",
      name_en: "Death Certificate",
      name_ta: "இறப்புச் சான்றிதழ்",
      desc_en: "Official document recording the demise of a person, essential for legal inheritance & pensions.",
      desc_ta: "இறப்பை அதிகாரப்பூர்வமாக பதிவு செய்து வாரிசுரிமை மற்றும் காப்பீட்டுக்கு தேவையான சான்றிதழ்.",
      issuing_authority_en: "Local Body / Corporation / Municipality / PHC",
      issuing_authority_ta: "உள்ளாட்சி / மாநகராட்சி / நகராட்சி / ஆரம்ப சுகாதார நிலையம்",
      standard_fee: "₹60 (e-Seva charge)",
      processing_days: "7 - 14 Working Days",
      icon: "file-text",
      documents: [
        {
          id: "doc-dc-1",
          name_en: "Hospital Death Summary / Form 2 / Medical Cause of Death",
          name_ta: "மருத்துவமனை இறப்பு அறிக்கை / படிவம் 2 / இறப்புக்கான மருத்துவக் காரணம்",
          category: "primary_proof",
          reason_en: "Legally certifies the date, time, and medical cause of death.",
          reason_ta: "இறந்த தேதி, நேரம் மற்றும் மருத்துவ காரணத்தை நிரூபிக்க.",
          format: "original_and_copy",
          format_label_en: "Original Medical Form",
          format_label_ta: "அசல் மருத்துவ அறிக்கை",
          note_en: "If death occurred at home, certificate/report from the Village Administrative Officer (VAO) or local doctor is required.",
          note_ta: "வீட்டில் மரணம் நிகழ்ந்தால், VAO அல்லது உள்ளூர் மருத்துவரின் சான்று தேவை.",
          essential: true
        },
        {
          id: "doc-dc-2",
          name_en: "Deceased Person's Aadhaar Card / Voter ID",
          name_ta: "மறைந்த நபரின் ஆதார் அட்டை / வாக்காளர் அடையாள அட்டை",
          category: "identity_proof",
          reason_en: "To record national identity numbers and mark records in the civil registry.",
          reason_ta: "மறைந்த நபரின் விவரங்களை அரசு பதிவேட்டில் பதிய.",
          format: "original_and_copy",
          format_label_en: "Original + 1 Photocopy",
          format_label_ta: "அசல் + 1 நகல்",
          note_en: "Original will be verified and returned.",
          note_ta: "அசல் சரிபார்க்கப்பட்டு திருப்பித் தரப்படும்.",
          essential: true
        },
        {
          id: "doc-dc-3",
          name_en: "Cremation / Burial Ground Receipt",
          name_ta: "சுடுகாடு / இடுகாடு ரசீது (அடக்கம் செய்யப்பட்ட ரசீது)",
          category: "supporting_proof",
          reason_en: "Proof of final disposal of the mortal remains as required under civil registration act.",
          reason_ta: "இறுதிச் சடங்கு நடைபெற்றதற்கான நகராட்சி / பஞ்சாயத்து ரசீது.",
          format: "original_and_copy",
          format_label_en: "Original Receipt",
          format_label_ta: "அசல் ரசீது",
          note_en: "Issued by the municipal or village burial ground caretaker.",
          note_ta: "சுடுகாட்டு பொறுப்பாளரால் வழங்கப்பட்ட ரசீது.",
          essential: true
        },
        {
          id: "doc-dc-4",
          name_en: "Applicant's Identity & Relationship Proof (Aadhaar / Ration Card)",
          name_ta: "விண்ணப்பதாரரின் அடையாள மற்றும் உறவு சான்று",
          category: "relationship_proof",
          reason_en: "Verifies that the person applying is an immediate family member / next of kin.",
          reason_ta: "விண்ணப்பிப்பவர் முதல் நிலை வாரிசு அல்லது குடும்ப உறுப்பினர் என உறுதி செய்ய.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Photocopy",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்",
          note_en: "Smart ration card showing deceased and applicant together is ideal.",
          note_ta: "இருவர் பெயரும் உள்ள ரேஷன் அட்டை மிகச் சிறந்தது.",
          essential: true
        }
      ]
    },
    {
      id: "first-graduate-certificate",
      category: "certificates",
      name_en: "First Graduate Certificate",
      name_ta: "முதல் பட்டதாரி சான்றிதழ்",
      desc_en: "Grants tuition fee concession in higher education colleges for the first graduate in the family.",
      desc_ta: "குடும்பத்தில் முதல் பட்டதாரிக்கு கல்லூரிகளில் கல்விக் கட்டண சலுகை வழங்கும் சான்றிதழ்.",
      issuing_authority_en: "Revenue Dept (Tahsildar)",
      issuing_authority_ta: "வருவாய்த்துறை (வட்டாட்சியர்)",
      standard_fee: "₹60 (e-Seva charge)",
      processing_days: "15 - 20 Working Days",
      icon: "academic-cap",
      documents: [
        {
          id: "doc-fg-1",
          name_en: "Applicant's 10th & 12th Marksheets / School TC",
          name_ta: "விண்ணப்பதாரரின் 10 மற்றும் 12-ம் வகுப்பு மதிப்பெண் சான்றிதழ் / TC",
          category: "primary_proof",
          reason_en: "Proves higher secondary completion and eligibility for degree admission.",
          reason_ta: "பள்ளிப் படிப்பை முடித்து கல்லூரிக்கு விண்ணப்பிப்பதை நிரூபிக்க.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Copies",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்கள்",
          note_en: "Carry originals for verification.",
          note_ta: "அசல் ஆவணங்களை எடுத்துச் செல்லவும்.",
          essential: true
        },
        {
          id: "doc-fg-2",
          name_en: "Father & Mother's Transfer Certificates / Education Proof",
          name_ta: "தாய் மற்றும் தந்தையின் பள்ளி மாற்றுச் சான்றிதழ் (TC) / கல்வி சான்று",
          category: "supporting_proof",
          reason_en: "Proves that parents have not completed graduation (degree).",
          reason_ta: "பெற்றோர் கல்லூரி பட்டப்படிப்பு முடிக்கவில்லை என்பதை நிரூபிக்க.",
          format: "photocopy",
          format_label_en: "TC Photocopies / Illiterate Notary Affidavit if no schooling",
          format_label_ta: "பள்ளி TC நகல்கள் / பள்ளி செல்லாதோருக்கு நோட்டரி பிரமாணப் பத்திரம்",
          note_en: "If parents did not go to school, a notarized self-affidavit is mandatory.",
          note_ta: "பெற்றோர் பள்ளி செல்லவில்லை எனில் பிரமாணப் பத்திரம் சமர்ப்பிக்க வேண்டும்.",
          essential: true
        },
        {
          id: "doc-fg-3",
          name_en: "Siblings' Educational Certificates (Brothers/Sisters)",
          name_ta: "உடன்பிறந்த சகோதர, சகோதரிகளின் கல்விச் சான்றிதழ்கள்",
          category: "relationship_proof",
          reason_en: "Confirms that elder siblings are not graduates and haven't availed this benefit.",
          reason_ta: "மூத்த சகோதரர்/சகோதரி பட்டதாரியாக இல்லை அல்லது இச்சலுகை பெறவில்லை என உறுதி செய்ய.",
          format: "photocopy",
          format_label_en: "Current study certificate / School TC of siblings",
          format_label_ta: "பள்ளி TC அல்லது படிப்பு சான்றிதழ்",
          note_en: "If single child, mention in self-declaration.",
          note_ta: "ஒரே குழந்தை எனில் சுய வாக்குமூலத்தில் குறிப்பிடலாம்.",
          essential: true
        },
        {
          id: "doc-fg-4",
          name_en: "Smart Family Ration Card",
          name_ta: "ஸ்மார்ட் குடும்ப அட்டை",
          category: "address_proof",
          reason_en: "Verifies total family members, parents, and siblings.",
          reason_ta: "முழு குடும்ப உறுப்பினர்களின் எண்ணிக்கையை அறிய.",
          format: "photocopy",
          format_label_en: "Photocopy of both sides",
          format_label_ta: "இரு பக்க நகல்",
          note_en: "All family members must appear on the same card.",
          note_ta: "அனைத்து குடும்ப உறுப்பினர்களும் இதில் இருக்க வேண்டும்.",
          essential: true
        },
        {
          id: "doc-fg-5",
          name_en: "Joint Declaration by Parents and Applicant (Annexure Form)",
          name_ta: "பெற்றோர் மற்றும் மாணவரின் கூட்டு உறுதிமொழிப் படிவம்",
          category: "primary_proof",
          reason_en: "Legal declaration stating no member of the family has graduated.",
          reason_ta: "குடும்பத்தில் இதுவரை யாரும் பட்டப்படிப்பு முடிக்கவில்லை என்ற உறுதிமொழி.",
          format: "original",
          format_label_en: "Original Signed Declaration Form",
          format_label_ta: "கையொப்பமிட்ட அசல் படிவம்",
          note_en: "Signed by student and parents in the presence of VAO.",
          note_ta: "மாணவர் மற்றும் பெற்றோர் கையொப்பமிட வேண்டும்.",
          essential: true
        }
      ]
    },
    {
      id: "legal-heir-certificate",
      category: "certificates",
      name_en: "Legal Heir Certificate",
      name_ta: "வாரிசுச் சான்றிதழ்",
      desc_en: "Identifies legitimate living successors of a deceased person for asset claims and pensions.",
      desc_ta: "மறைந்த நபரின் சொத்துக்கள், வேலை மற்றும் ஓய்வூதிய உரிமைக்கான வாரிசு சான்று.",
      issuing_authority_en: "Revenue Dept (Tahsildar)",
      issuing_authority_ta: "வருவாய்த்துறை (வட்டாட்சியர்)",
      standard_fee: "₹60 (e-Seva charge)",
      processing_days: "15 - 30 Working Days",
      icon: "users",
      documents: [
        {
          id: "doc-lh-1",
          name_en: "Death Certificate of the Deceased Person",
          name_ta: "மறைந்த நபரின் இறப்புச் சான்றிதழ்",
          category: "primary_proof",
          reason_en: "Mandatory foundation document proving demise.",
          reason_ta: "இறப்பை அதிகாரப்பூர்வமாக நிரூபிக்கும் முதன்மை ஆவணம்.",
          format: "original_and_copy",
          format_label_en: "Original + Photocopy",
          format_label_ta: "அசல் + நகல்",
          note_en: "Must be issued by the competent Municipal/Panchayat registrar.",
          note_ta: "அங்கீகரிக்கப்பட்ட பதிவாளரால் வழங்கப்பட்டிருக்க வேண்டும்.",
          essential: true
        },
        {
          id: "doc-lh-2",
          name_en: "Aadhaar Cards of All Surviving Legal Heirs",
          name_ta: "உயிருடன் உள்ள அனைத்து வாரிசுகளின் ஆதார் அட்டைகள்",
          category: "identity_proof",
          reason_en: "Individual identification of each surviving heir (Spouse, Children, Parents).",
          reason_ta: "ஒவ்வொரு சட்டபூர்வ வாரிசின் அடையாள சரிபார்ப்பிற்கு.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Copies of All Heirs",
          format_label_ta: "அனைத்து வாரிசுகளின் சுய சான்றொப்ப நகல்கள்",
          note_en: "Carry originals for VAO field inquiry verification.",
          note_ta: "VAO களவிசாரணையின் போது அசல் ஆவணங்கள் காட்டப்பட வேண்டும்.",
          essential: true
        },
        {
          id: "doc-lh-3",
          name_en: "Smart Family Ration Card of Deceased",
          name_ta: "மறைந்த நபரின் ஸ்மார்ட் குடும்ப அட்டை",
          category: "address_proof",
          reason_en: "Shows the family structure and names recorded together before demise.",
          reason_ta: "மறைவுக்கு முன் குடும்பத்தில் இருந்த நபர்களின் பதிவை அறிய.",
          format: "photocopy",
          format_label_en: "Photocopy",
          format_label_ta: "நகல்",
          note_en: "Ensure the deceased was listed on the card.",
          note_ta: "மறைந்த நபர் பெயர் இதில் இருக்க வேண்டும்.",
          essential: true
        },
        {
          id: "doc-lh-4",
          name_en: "Marriage Certificate / Wedding Invitation (For Spouse Claim)",
          name_ta: "திருமணச் சான்றிதழ் / திருமண அழைப்பிதழ் (மனைவி/கணவர்)",
          category: "relationship_proof",
          reason_en: "Proves legal marital relationship with the deceased.",
          reason_ta: "மறைந்தவருடன் சட்டப்பூர்வ திருமண பந்தத்தை நிரூபிக்க.",
          format: "photocopy",
          format_label_en: "Photocopy (Original for verification)",
          format_label_ta: "நகல் (சரிபார்க்க அசல்)",
          note_en: "If marriage certificate is absent, affidavit may be requested.",
          note_ta: "சான்றிதழ் இல்லையெனில் உறுதிமொழி பத்திரம் தேவைப்படலாம்.",
          essential: true
        },
        {
          id: "doc-lh-5",
          name_en: "Notarized Affidavit with Names of All Living Legal Heirs",
          name_ta: "அனைத்து வாரிசுகளின் விவரம் அடங்கிய நோட்டரி பிரமாணப் பத்திரம்",
          category: "primary_proof",
          reason_en: "Sworn legal undertaking stating that no other heirs exist.",
          reason_ta: "வேறு வாரிசுகள் யாரும் இல்லை என்பதை உறுதி செய்யும் சட்டபூர்வ உறுதிமொழி.",
          format: "original",
          format_label_en: "Original Stamped Notarized Affidavit (₹20 Stamp)",
          format_label_ta: "நோட்டரி கையொப்பமிட்ட அசல் பிரமாணப் பத்திரம்",
          note_en: "Must clearly list spouse, all children, and deceased person's mother if alive.",
          note_ta: "மனைவி, குழந்தைகள் மற்றும் தாயார் பெயர் இடம் பெற வேண்டும்.",
          essential: true
        }
      ]
    },
    {
      id: "driving-license",
      category: "transport",
      name_en: "Driving License (LLR / Permanent DL)",
      name_ta: "ஓட்டுநர் உரிமம் (பழகுநர் LLR / நிரந்தர DL)",
      desc_en: "Authorization to drive motor vehicles issued by Regional Transport Office (RTO / Parivahan).",
      desc_ta: "வட்டாரப் போக்குவரத்து அலுவலகத்தால் (RTO) வழங்கப்படும் வாகன ஓட்டுநர் உரிமம்.",
      issuing_authority_en: "Transport Department (RTO)",
      issuing_authority_ta: "போக்குவரத்துத் துறை (RTO)",
      standard_fee: "₹200 - ₹500 (depending on vehicle class)",
      processing_days: "Same Day (LLR) / 7 Days (DL test)",
      icon: "truck",
      documents: [
        {
          id: "doc-dl-1",
          name_en: "Age Proof (10th Marksheet / Birth Certificate / Passport)",
          name_ta: "வயது சான்று (10-ம் வகுப்பு மதிப்பெண் / பிறப்பு சான்றிதழ்)",
          category: "primary_proof",
          reason_en: "Verifies applicant meets minimum age (18 for gear vehicles, 16 for gearless 50cc).",
          reason_ta: "விண்ணப்பதாரர் குறைந்தபட்ச வயது வரம்பை அடைந்துவிட்டாரா என்பதை அறிய.",
          format: "original_and_copy",
          format_label_en: "Original + Photocopy",
          format_label_ta: "அசல் + நகல்",
          note_en: "Birth certificate or SSLC book is widely preferred at RTO.",
          note_ta: "SSLC மார்க்ஷீட் அல்லது பிறப்புச் சான்றிதழ் மிகச் சிறந்தது.",
          essential: true
        },
        {
          id: "doc-dl-2",
          name_en: "Address Proof (Aadhaar Card / Voter ID / Passport)",
          name_ta: "முகவரி சான்று (ஆதார் அட்டை / வாக்காளர் அட்டை)",
          category: "address_proof",
          reason_en: "Determines jurisdiction of the Regional Transport Office (RTO).",
          reason_ta: "சம்பந்தப்பட்ட வட்டாரப் போக்குவரத்து அலுவலக (RTO) எல்லையை அறிய.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Photocopy",
          format_label_ta: "சுய சான்றொப்பமிட்ட நகல்",
          note_en: "Aadhaar eKYC online avoids physical address proof scrutiny.",
          note_ta: "ஆதார் eKYC செய்தால் நேரடி ஆவண சரிபார்ப்பு எளிதாகும்.",
          essential: true
        },
        {
          id: "doc-dl-3",
          name_en: "Medical Certificate (Form 1A for >40 yrs or Commercial)",
          name_ta: "மருத்துவ சான்றிதழ் (படிவம் 1A - 40 வயதுக்கு மேல் அல்லது வணிக வாகனங்கள்)",
          category: "supporting_proof",
          reason_en: "Certifies physical and visual fitness to operate a motor vehicle safely.",
          reason_ta: "வாகனம் ஓட்ட தேவையான கண்பார்வை மற்றும் உடல் தகுதியை அறிய.",
          format: "original",
          format_label_en: "Original Signed by Registered Medical Practitioner",
          format_label_ta: "அங்கீகரிக்கப்பட்ட மருத்துவரின் அசல் சான்று",
          note_en: "Mandatory if age >40 or applying for transport/commercial badge.",
          note_ta: "40 வயதுக்கு மேற்பட்டோருக்கு அல்லது வணிக உரிமத்திற்கு கட்டாயம்.",
          essential: false
        },
        {
          id: "doc-dl-4",
          name_en: "Learner's License (LLR) Copy (For Permanent DL)",
          name_ta: "பழகுநர் உரிமம் (LLR) நகல் (நிரந்தர உரிமத்திற்கு)",
          category: "primary_proof",
          reason_en: "Mandatory prerequisite before taking the practical 8-track / driving test.",
          reason_ta: "நிரந்தர ஓட்டுநர் உரிமத் தேர்வுக்கு செல்ல பழகுநர் உரிமம் அவசியம்.",
          format: "original_and_copy",
          format_label_en: "Active LLR Printout (>30 days old and <6 months)",
          format_label_ta: "செல்லுபடியாகும் LLR அசல் அச்சு நகல்",
          note_en: "Must be at least 30 days old and within 180 days validity.",
          note_ta: "LLR பெற்று 30 நாட்கள் முடிந்திருக்க வேண்டும் (180 நாட்களுக்குள்).",
          essential: true
        },
        {
          id: "doc-dl-5",
          name_en: "Passport Size Photographs (3 Nos)",
          name_ta: "பாஸ்போர்ட் அளவு புகைப்படங்கள் (3)",
          category: "photographs",
          reason_en: "For RTO physical file index (biometrics will also be taken at RTO counter).",
          reason_ta: "RTO பதிவேட்டிற்கு (நேரடி பயோமெட்ரிக் புகைப்படமும் எடுக்கப்படும்).",
          format: "physical_photos",
          format_label_en: "3 Recent Photos",
          format_label_ta: "3 சமீபத்திய புகைப்படங்கள்",
          note_en: "Carry spares for test forms.",
          note_ta: "படிவங்களில் ஒட்ட கூடுதல் படங்கள் எடுத்துச் செல்லவும்.",
          essential: true
        }
      ]
    },
    {
      id: "smart-ration-card",
      category: "welfare",
      name_en: "New Smart Family Ration Card",
      name_ta: "புதிய குடும்ப அட்டை (ஸ்மார்ட் ரேஷன் கார்டு)",
      desc_en: "Civil supplies card for subsidized food commodities, subsidized gas, and key identity proof.",
      desc_ta: "நியாயவிலைக் கடைகளில் உணவுப் பொருட்கள் பெறவும் குடும்ப அடையாளமாகவும் பயன்படும் அட்டை.",
      issuing_authority_en: "Civil Supplies & Consumer Protection Dept (TNePDS)",
      issuing_authority_ta: "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத் துறை",
      standard_fee: "₹20 (Card printing fee)",
      processing_days: "15 - 30 Working Days",
      icon: "shopping-bag",
      documents: [
        {
          id: "doc-rcard-1",
          name_en: "Aadhaar Cards of All Family Members to be Included",
          name_ta: "சேர்க்கப்பட வேண்டிய அனைத்து குடும்ப உறுப்பினர்களின் ஆதார் அட்டைகள்",
          category: "identity_proof",
          reason_en: "Biometric and demographic deduplication ensuring no member exists in multiple cards.",
          reason_ta: "ஒரு நபர் ஒன்றுக்கும் மேற்பட்ட குடும்ப அட்டைகளில் இல்லை என்பதை உறுதி செய்ய.",
          format: "photocopy_self_attested",
          format_label_en: "Self-Attested Copies of All Members",
          format_label_ta: "அனைத்து உறுப்பினர்களின் நகல்கள்",
          note_en: "All Aadhaar cards must have phone numbers linked.",
          note_ta: "ஆதாருடன் தொலைபேசி எண் இணைக்கப்பட்டிருப்பது விரைவுபடுத்தும்.",
          essential: true
        },
        {
          id: "doc-rcard-2",
          name_en: "Proof of Address (Electricity Bill / Rental Agreement / Property Tax)",
          name_ta: "முகவரி சான்று (மின்கட்டணம் / வாடகை ஒப்பந்தம் / சொத்து வரி)",
          category: "address_proof",
          reason_en: "Maps the family to the correct local Fair Price Shop (Ration Shop) circle.",
          reason_ta: "குடும்பத்தை அருகிலுள்ள நியாயவிலைக் கடை வட்டத்துடன் இணைக்க.",
          format: "photocopy",
          format_label_en: "Latest Bill Copy",
          format_label_ta: "சமீபத்திய ரசீது நகல்",
          note_en: "For rented house, registered rental agreement with owner's EB receipt is needed.",
          note_ta: "வாடகை வீட்டிற்கு வாடகை ஒப்பந்தம் மற்றும் வீட்டு உரிமையாளரின் EB ரசீது.",
          essential: true
        },
        {
          id: "doc-rcard-3",
          name_en: "Name Deletion Certificate / Surrender Certificate from Previous Card",
          name_ta: "முந்தைய குடும்ப அட்டையிலிருந்து பெயர் நீக்கல் சான்றிதழ்",
          category: "primary_proof",
          reason_en: "Proof that married couple/members have been removed from parents' cards.",
          reason_ta: "பெற்றோரின் அட்டையிலிருந்து பெயர் நீக்கப்பட்டதை நிரூபிக்கும் சான்று.",
          format: "original_and_copy",
          format_label_en: "Online Deletion Slip / Surrender Certificate",
          format_label_ta: "இணைய பெயர் நீக்கல் ரசீது / சான்று",
          note_en: "Crucial for newly married couples applying for their first independent card.",
          note_ta: "புதிதாக திருமணமான தம்பதியருக்கு இது மிகவும் கட்டாயம்.",
          essential: true
        },
        {
          id: "doc-rcard-4",
          name_en: "Gas Connection Details / Consumer Passbook Copy",
          name_ta: "சமையல் எரிவாயு இணைப்பு விவரம் / நுகர்வோர் புத்தகம்",
          category: "supporting_proof",
          reason_en: "Determines kerosene quota entitlement (No gas = full kerosene, 1 cylinder = partial, 2 = nil).",
          reason_ta: "மண்ணெண்ணெய் ஒதுக்கீடு அளவை முடிவு செய்ய (எரிவாயு சிலிண்டர் விவரம்).",
          format: "photocopy",
          format_label_en: "Gas Consumer Book Front Page Copy",
          format_label_ta: "எரிவாயு புத்தக முதல் பக்க நகல்",
          note_en: "Mention if no LPG connection exists to get full subsidised items.",
          note_ta: "எரிவாயு இணைப்பு இல்லை எனில் விண்ணப்பத்தில் குறிப்பிடலாம்.",
          essential: false
        },
        {
          id: "doc-rcard-5",
          name_en: "Family Head Photograph (Passphoto)",
          name_ta: "குடும்பத் தலைவரின் பாஸ்போர்ட் அளவு புகைப்படம்",
          category: "photographs",
          reason_en: "Printed on the Smart Card front surface (traditionally female head of household).",
          reason_ta: "ஸ்மார்ட் கார்டில் அச்சிடப்பட (குடும்பத் தலைவி படம்).",
          format: "physical_photos",
          format_label_en: "1 Clear Color Photo (White Background)",
          format_label_ta: "1 தெளிவான வண்ணப் புகைப்படம்",
          note_en: "In Tamil Nadu, adult woman is usually designated as family head.",
          note_ta: "தமிழகத்தில் பொதுவாக குடும்பத்தின் மூத்த பெண்மணியே குடும்பத் தலைவர்.",
          essential: true
        }
      ]
    }
  ];

  const STATES_AND_DISTRICTS = {
    "Tamil Nadu": [
      "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
      "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
      "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
      "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
      "Tenkasi", "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli",
      "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
      "Vellore", "Viluppuram", "Virudhunagar"
    ],
    "Karnataka": [
      "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru (Dakshina Kannada)",
      "Hubballi-Dharwad", "Belagavi", "Ballari", "Kalaburagi", "Shivamogga", "Tumakuru"
    ],
    "Kerala": [
      "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
      "Idukki", "Ernakulam (Kochi)", "Thrissur", "Palakkad", "Malappuram", "Kozhikode",
      "Wayanad", "Kannur", "Kasaragod"
    ],
    "Andhra Pradesh": [
      "Visakhapatnam", "Vijayawada (NTR)", "Guntur", "Tirupati", "Kurnool", "Nellore"
    ],
    "Maharashtra": [
      "Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Chhatrapati Sambhajinagar"
    ],
    "Delhi (NCT)": [
      "Central Delhi", "New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"
    ]
  };

  const COMMON_QUESTIONS_AT_OFFICE = [
    {
      id: "q-1",
      question_en: "Are any additional local verification documents needed from the VAO (Village Administrative Officer)?",
      question_ta: "கிராம நிர்வாக அலுவலரிடம் (VAO) கூடுதல் கையொப்பம் அல்லது கள விசாரணை அறிக்கை தேவையா?",
      tip_en: "For revenue certificates (Community, Income, Nativity), the VAO and Revenue Inspector must submit a field report.",
      tip_ta: "வருவாய்த்துறை சான்றிதழ்களுக்கு VAO மற்றும் வருவாய் ஆய்வாளர் (RI) கள ஆய்வு அறிக்கை அவசியமானது."
    },
    {
      id: "q-2",
      question_en: "Will original documents be returned immediately after spot verification?",
      question_ta: "நேரடி சரிபார்ப்பிற்குப் பிறகு அசல் ஆவணங்கள் உடனடியாக திருப்பித் தரப்படுமா?",
      tip_en: "Government e-Seva desks only scan originals; do NOT surrender your original birth/marriage certificates unless instructed by gazetted officers.",
      tip_ta: "இ-சேவை மையங்கள் அசலை ஸ்கேன் மட்டுமே செய்கின்றன; அசல் சான்றிதழ்களை அங்கே ஒப்படைக்க வேண்டாம்."
    },
    {
      id: "q-3",
      question_en: "What is the application tracking number (CAN / Ack Number) and portal URL?",
      question_ta: "விண்ணப்ப கண்காணிப்பு எண் (CAN / Acknowledgement Number) மற்றும் இணைய முகவரி என்ன?",
      tip_en: "Always collect the printed computer acknowledgement slip with application reference number (e.g., TN-REV-...).",
      tip_ta: "விண்ணப்ப எண் கொண்ட கணினி ரசீதை கட்டாயம் பெற்றுக் கொள்ளவும்."
    },
    {
      id: "q-4",
      question_en: "Is an in-person physical appearance / biometric scan mandatory?",
      question_ta: "விண்ணப்பதாரர் நேரில் ஆஜராக வேண்டுமா அல்லது கைரேகை பயோமெட்ரிக் பதிவு அவசியமா?",
      tip_en: "Required for Aadhaar updates and Driving License tests, but usually not mandatory for basic revenue certificates.",
      tip_ta: "ஆதார் மற்றும் ஓட்டுநர் உரிமத்திற்கு நேரடி வருகை தேவை; பிற சான்றிதழ்களுக்கு குடும்ப உறுப்பினர் விண்ணப்பிக்கலாம்."
    },
    {
      id: "q-5",
      question_en: "What is the official processing timeline under the Citizen Charter?",
      question_ta: "குடிமக்கள் சாசனத்தின்படி சான்றிதழ் கிடைக்க எத்தனை நாட்கள் ஆகும்?",
      tip_en: "Most revenue certificates have a statutory timeline of 15 to 30 days. Ask for escalation contacts if delayed.",
      tip_ta: "பொதுவாக 15 முதல் 30 வேலை நாட்களுக்குள் சான்றிதழ் வழங்கப்பட வேண்டும்."
    },
    {
      id: "q-6",
      question_en: "What is the exact official government fee and mode of payment (Cash / UPI)?",
      question_ta: "அரசு நிர்ணயித்த சரியான கட்டணம் எவ்வளவு மற்றும் அதை UPI மூலம் செலுத்தலாமா?",
      tip_en: "Standard e-Seva fee is ₹60. The fee is printed on the computer receipt; never pay unreceipted cash.",
      tip_ta: "நிலையான இ-சேவை கட்டணம் ₹60. ரசீதில் அச்சிடப்பட்ட தொகையை மட்டுமே செலுத்தவும்."
    }
  ];

  const NEXT_STEPS_GUIDE = [
    {
      step: 1,
      title_en: "Organize Document Folder (Originals + 2 Sets)",
      title_ta: "ஆவணக் கோப்பை ஒழுங்கமைத்தல் (அசல் + 2 நகல் தொகுப்புகள்)",
      desc_en: "Sort documents into two separate sets: 1 file containing verified originals, and 1 file containing self-attested photocopies with 2 recent passport size photos.",
      desc_ta: "அசல் ஆவணங்களை ஒரு கோப்பிலும், சுய சான்றொப்பமிட்ட 2 நகல் தொகுப்புகளை மற்றொரு கோப்பிலும் பாதுகாப்பாக அடுக்கி வைக்கவும்."
    },
    {
      step: 2,
      title_en: "Locate Nearest Authorized e-Seva / TNeGA Center",
      title_ta: "அருகிலுள்ள அரசு அங்கீகாரம் பெற்ற இ-சேவை மையத்தை கண்டறிதல்",
      desc_en: "Visit your local Taluk Office, Municipality Office, or authorized Arasu e-Seva center. Working hours are typically 10:00 AM - 5:30 PM.",
      desc_ta: "வட்டாட்சியர் அலுவலகம், நகராட்சி அல்லது கூட்டுறவு சங்கங்களில் இயங்கும் அரசு இ-சேவை மையத்திற்கு காலை 10:00 முதல் மாலை 5:30-க்குள் செல்லவும்."
    },
    {
      step: 3,
      title_en: "Prepare Government Service Fee (Cash / UPI)",
      title_ta: "அரசு சேவைக் கட்டணத்தை தயாராக வைத்திருங்கள் (பணம் / UPI)",
      desc_en: "Keep ₹60 to ₹100 handy for revenue applications. Insist on a computer-generated transaction receipt displaying your CAN number.",
      desc_ta: "விண்ணப்பக் கட்டணத்தை (சுமார் ₹60) தயாராக வைக்கவும். CAN எண் கொண்ட அதிகாரப்பூர்வ கணினி ரசீதை தவறாமல் பெறவும்."
    },
    {
      step: 4,
      title_en: "Track SMS Notifications & Download Digital Certificate",
      title_ta: "SMS அறிவிப்புகளை கண்காணித்து மின்னணு சான்றிதழை பதிவிறக்கவும்",
      desc_en: "You will receive SMS alerts as your application moves through verification. Once approved, download the digitally signed certificate online via TN e-District.",
      desc_ta: "VAO மற்றும் வருவாய் ஆய்வாளர் ஆய்வுக்குப் பின் ஒப்புதல் பெற்றவுடன், டிஜிட்டல் கையொப்பமிட்ட சான்றிதழை இணையத்தில் பதிவிறக்கலாம்."
    }
  ];

  // ==========================================
  // 2. TRANSLATIONS (EN & TA)
  // ==========================================
  const TRANSLATIONS = {
    en: {
      app_title: "DocMate AI",
      app_tagline: "Government Document Checklist Assistant",
      prototype_badge: "Student AI Immersion Project Prototype",
      disclaimer_short: "Notice: Educational prototype. Document requirements can vary by jurisdiction. Always verify final requirements with official government portals or your local Taluk / e-Seva office.",
      nav_home: "Home",
      nav_services: "Services",
      nav_checklist: "My Checklist",
      nav_assistant: "DocMate Assistant",
      nav_faq: "FAQ",
      nav_about: "About Project",
      hero_title: "Never Visit a Government Office Unprepared.",
      hero_subtitle: "An AI-assisted document checklist system designed to eliminate repeat visits, missing paperwork, and confusion at government and e-Seva centers.",
      hero_cta: "Find Required Documents",
      hero_cta_chat: "Ask AI Assistant",
      hero_stat_services: "10+ Common Services",
      hero_stat_reduction: "60% Fewer Re-Visits",
      hero_stat_languages: "Tamil & English",
      hero_stat_security: "Zero PII Stored",
      search_placeholder: "Search for a service (e.g. Birth Certificate, Income, Community, Ration Card)...",
      search_all_category: "All Categories",
      cat_certificates: "Certificates & Civil",
      cat_revenue: "Revenue & Domicile",
      cat_transport: "Transport & Driving",
      cat_welfare: "Civil Supplies & Ration",
      select_service_btn: "Generate Checklist",
      issuing_dept: "Issuing Authority",
      est_time: "Est. Timeline",
      gov_fee: "Govt / e-Seva Fee",
      step1_title: "1. Select Service",
      step2_title: "2. Personal Details & Context",
      step3_title: "3. Smart Checklist",
      form_heading: "Tell us a few details to customize your checklist",
      form_subheading: "Your responses help us determine exact supporting documents. We never ask for or store sensitive information like Aadhaar or bank numbers.",
      label_service: "Selected Service",
      label_state: "State",
      label_district: "District",
      label_applicant: "Who is this application for?",
      applicant_self: "For Myself",
      applicant_minor: "For My Minor Child (Under 18)",
      applicant_parent: "For My Parent / Elderly Dependent",
      applicant_deceased: "For Deceased Family Member",
      applicant_spouse: "For My Spouse",
      label_mode: "How do you plan to apply?",
      mode_eseva: "Arasu e-Seva / CSC Center (Recommended)",
      mode_online: "Direct Online Portal (TNeGA / State Portal)",
      mode_office: "Direct Taluk / Municipality / Collectorate Office",
      label_urgency: "Application Urgency / Situation",
      urgency_normal: "Standard Application",
      urgency_urgent: "Urgent / Tatkal Requirement (Admission / Deadline)",
      label_residence_type: "Residential Ownership Status",
      residence_own: "Living in Own House / Ancestral Property",
      residence_rent: "Living in Rented House (Needs Rental Agreement)",
      btn_generate_checklist: "Generate Personalized Checklist",
      btn_back_to_services: "Back to Services",
      checklist_title: "Personalized Document Checklist",
      checklist_summary: "Tailored for",
      in_district: "in",
      readiness_score_title: "Application Readiness Score",
      readiness_calculating: "Calculating...",
      readiness_ready_msg: "Great job! You have all essential documents. You are ready to visit the office.",
      readiness_moderate_msg: "Good progress. You still need a few documents before your visit to avoid rejection.",
      readiness_low_msg: "Preparation needed. Please gather missing documents to avoid multiple trips.",
      status_have: "I have this",
      status_need: "I need this",
      status_na: "Not Applicable",
      filter_all: "All Documents",
      filter_have: "Ready",
      filter_need: "Pending",
      filter_essential: "Mandatory Only",
      doc_why_required: "Why it may be required:",
      doc_format: "Required Format:",
      doc_note: "Important Verification Note:",
      btn_print: "Print Checklist",
      btn_save: "Download Checklist",
      btn_reset: "Reset Checklist",
      btn_ask_ai_doc: "Ask DocMate AI about this list",
      next_steps_heading: "What should I do next?",
      next_steps_sub: "A step-by-step practical guide before stepping out of your home",
      office_questions_heading: "Questions to Ask at the Office",
      office_questions_sub: "Carry these questions to prevent unexpected surprises or delays",
      copy_question: "Copy Question",
      ai_assistant_title: "DocMate Assistant",
      ai_assistant_subtitle: "Your AI companion for government paperwork guidance",
      ai_welcome_msg: "Hello! I am DocMate Assistant, your guide for government document checklists. How can I assist you with your application today?",
      ai_quick_prompts: "Suggested Questions:",
      ai_input_placeholder: "Ask in English or தமிழ் (e.g. 'What if I don't have a ration card?')...",
      ai_send_btn: "Send",
      ai_disclaimer_notice: "DocMate Assistant provides educational guidance based on typical Indian e-Seva/state procedures. Requirements change; please verify with the competent local authority.",
      ai_typing: "DocMate AI is thinking...",
      faq_title: "Frequently Asked Questions",
      faq_subtitle: "Everything you need to know about preparing government applications",
      about_title: "About DocMate AI",
      about_badge: "College / School AI Immersion Project",
      about_intro: "DocMate AI is an educational prototype developed as part of an AI Immersion Project to empower citizens with automated, customized document preparation checklists.",
      problem_title: "The Problem",
      problem_desc: "Every day, millions of citizens visit government administrative offices (such as Taluk offices, Municipalities, e-Seva centers, and RTOs) only to be turned away because they lacked a specific photocopy, self-attestation, or local proof. This results in lost daily wages, travel costs, frustration, and overburdened desk officers.",
      solution_title: "The AI Solution",
      solution_desc: "DocMate AI applies an intelligent decision system combined with conversational AI to understand user context (relationship, locality, urgent requirements) and produce an itemized, verified checklist with practical guidance on formats, official fees, and questions to ask.",
      benefits_title: "Expected Citizen Benefits",
      benefits_item1: "Reduces repetitive office visits by up to 60%.",
      benefits_item2: "Empowers rural and urban citizens with transparent knowledge of fees and timeframes.",
      benefits_item3: "Eliminates middleman dependencies and confusion regarding self-attestation vs originals.",
      benefits_item4: "Accessible bilingual interface supporting Tamil & English.",
      safety_title: "Safety, Accuracy & Zero-PII Policy",
      safety_desc: "DocMate AI never asks for or stores sensitive personal data such as Aadhaar numbers, PAN, bank accounts, or passwords. All selections remain on your device. Always cross-check with official portals such as tnega.tn.gov.in, edistrict, or parivahan.gov.in.",
      footer_text: "DocMate AI — Student AI Immersion Prototype. Not affiliated with any official government agency. Always confirm with the relevant government department."
    },
    ta: {
      app_title: "DocMate AI",
      app_tagline: "அரசு ஆவண சரிபார்ப்பு உதவியாளர்",
      prototype_badge: "மாணவர் AI திட்ட மாதிரி (கல்வி முன்மாதிரி)",
      disclaimer_short: "முக்கிய அறிவிப்பு: இது மாணவர் AI கல்வி மாதிரி திட்டம். ஆவண தேவைகள் மாறுபடலாம். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அரசு இணையதளம் அல்லது உள்ளூர் இ-சேவை / வட்டாட்சியர் அலுவலகத்தில் சரிபார்க்கவும்.",
      nav_home: "முகப்பு",
      nav_services: "சேவைகள்",
      nav_checklist: "என் சரிபார்ப்பு பட்டியல்",
      nav_assistant: "DocMate உதவியாளர்",
      nav_faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      nav_about: "திட்டம் பற்றி",
      hero_title: "அரசு அலுவலகத்திற்கு முழு தயாரிப்புடன் செல்லுங்கள்.",
      hero_subtitle: "தேவையான ஆவணங்களை முன்கூட்டியே அறிந்து கொண்டு, அலைச்சலையும் தேவையில்லாத மறுமுறை வருகைகளையும் தவிர்க்க உதவும் ஸ்மார்ட் AI வழிகாட்டி.",
      hero_cta: "தேவையான ஆவணங்களை கண்டறியவும்",
      hero_cta_chat: "AI உதவியாளரிடம் கேளுங்கள்",
      hero_stat_services: "10+ முக்கிய சேவைகள்",
      hero_stat_reduction: "60% மறுமுறை வருகை குறைப்பு",
      hero_stat_languages: "தமிழ் மற்றும் ஆங்கிலம்",
      hero_stat_security: "தனிநபர் விவரங்கள் சேமிக்கப்படுவதில்லை",
      search_placeholder: "சேவையைத் தேடவும் (எ.கா. பிறப்புச் சான்றிதழ், வருமானம், சாதி, ரேஷன் அட்டை)...",
      search_all_category: "அனைத்துப் பிரிவுகள்",
      cat_certificates: "சான்றிதழ்கள் & பதிவுகள்",
      cat_revenue: "வருவாய் & குடியிருப்பு",
      cat_transport: "போக்குவரத்து & ஓட்டுநர்",
      cat_welfare: "உணவுப்பொருள் & குடும்ப அட்டை",
      select_service_btn: "பட்டியலை உருவாக்கவும்",
      issuing_dept: "வழங்கும் துறை",
      est_time: "ஆகும் காலம்",
      gov_fee: "அரசு / இ-சேவை கட்டணம்",
      step1_title: "1. சேவையைத் தேர்ந்தெடுங்கள்",
      step2_title: "2. சூழ்நிலை விவரங்கள்",
      step3_title: "3. ஸ்மார்ட் சரிபார்ப்பு பட்டியல்",
      form_heading: "உங்கள் சரிபார்ப்பு பட்டியலை உருவாக்க சில விவரங்கள் தேவை",
      form_subheading: "சரியான துணை ஆவணங்களை பரிந்துரைக்கவே இக்கேள்விகள். ஆதார் எண் அல்லது வங்கி விவரங்கள் போன்ற ரகசிய தகவல்களை நாங்கள் ஒருபோதும் சேகரிப்பதில்லை.",
      label_service: "தேர்ந்தெடுக்கப்பட்ட சேவை",
      label_state: "மாநிலம்",
      label_district: "மாவட்டம்",
      label_applicant: "விண்ணப்பம் யாருக்காக?",
      applicant_self: "எனக்காக (சுய விண்ணப்பம்)",
      applicant_minor: "என் மைனர் குழந்தைக்காக (18 வயதுக்குட்பட்டோர்)",
      applicant_parent: "என் பெற்றோர் / முதியோருக்காக",
      applicant_deceased: "மறைந்த குடும்ப உறுப்பினருக்காக",
      applicant_spouse: "என் கணவர் / மனைவிக்காக",
      label_mode: "எப்படி விண்ணப்பிக்க திட்டமிட்டுள்ளீர்கள்?",
      mode_eseva: "அரசு இ-சேவை மையம் (பரிந்துரைக்கப்படுகிறது)",
      mode_online: "நேரடி அரசு இணையதளம் (TNeGA / இணையதளம்)",
      mode_office: "நேரடி வட்டாட்சியர் / நகராட்சி / ஆட்சியர் அலுவலகம்",
      label_urgency: "விண்ணப்ப அவசரம் / சூழ்நிலை",
      urgency_normal: "வழக்கமான விண்ணப்பம்",
      urgency_urgent: "அவசரம் / தட்கல் தேவை (கல்லூரி சேர்க்கை / காலக்கெடு)",
      label_residence_type: "குடியிருப்பு உரிமை விவரம்",
      residence_own: "சொந்த வீடு / பூர்வீக வீடு",
      residence_rent: "வாடகை வீடு (வாடகை ஒப்பந்த நகல் தேவைப்படும்)",
      btn_generate_checklist: "ஸ்மார்ட் பட்டியலை உருவாக்கவும்",
      btn_back_to_services: "சேவைகள் பக்கத்திற்கு திரும்ப",
      checklist_title: "பிரத்யேக ஆவண சரிபார்ப்பு பட்டியல்",
      checklist_summary: "பரிந்துரைக்கப்பட்ட சேவை",
      in_district: "மாவட்டம்:",
      readiness_score_title: "விண்ணப்ப தயார்நிலை மதிப்பீடு",
      readiness_calculating: "கணக்கிடப்படுகிறது...",
      readiness_ready_msg: "அற்புதம்! உங்களிடம் தேவையான முக்கிய ஆவணங்கள் உள்ளன. நீங்கள் அலுவலகத்திற்கு செல்ல தயாராக உள்ளீர்கள்.",
      readiness_moderate_msg: "நல்ல முன்னேற்றம்! நிராகரிப்பைத் தவிர்க்க இன்னும் சில ஆவணங்களை தயார் செய்து கொள்ளுங்கள்.",
      readiness_low_msg: "முன் தயாரிப்பு அவசியம். அலைச்சலைத் தவிர்க்க நிலுவையில் உள்ள ஆவணங்களைச் சேர்க்கவும்.",
      status_have: "என்னிடம் உள்ளது",
      status_need: "இது எனக்கு தேவை",
      status_na: "பொருந்தாது",
      filter_all: "அனைத்து ஆவணங்கள்",
      filter_have: "தயாராக உள்ளவை",
      filter_need: "தேவைப்படுபவை",
      filter_essential: "முக்கியமானவை மட்டும்",
      doc_why_required: "ஏன் தேவைப்படலாம்:",
      doc_format: "தேவையான வடிவம்:",
      doc_note: "முக்கிய சரிபார்ப்பு குறிப்பு:",
      btn_print: "பட்டியலை அச்சிடுக",
      btn_save: "பட்டியலை சேமிக்க (Download)",
      btn_reset: "பட்டியலை மீட்டமைக்கவும்",
      btn_ask_ai_doc: "AI உதவியாளரிடம் இந்த பட்டியலை பற்றி கேளுங்கள்",
      next_steps_heading: "அடுத்து நான் என்ன செய்ய வேண்டும்?",
      next_steps_sub: "அரசு அலுவலகத்திற்குச் செல்லும் முன் பின்பற்ற வேண்டிய 4 எளிய வழிகள்",
      office_questions_heading: "அலுவலகத்தில் கேட்க வேண்டிய கேள்விகள்",
      office_questions_sub: "தேவையற்ற தாமதங்களைத் தவிர்க்க இந்த கேள்விகளை நினைவில் கொள்ளுங்கள்",
      copy_question: "கேள்வியை நகலெடு",
      ai_assistant_title: "DocMate உதவியாளர்",
      ai_assistant_subtitle: "அரசு ஆவண வழிகாட்டலுக்கான உங்கள் AI தோழன்",
      ai_welcome_msg: "வணக்கம்! நான் DocMate AI உதவியாளர். அரசு ஆவணங்கள் மற்றும் சான்றிதழ் நடைமுறைகள் குறித்து ஏதேனும் சந்தேகங்கள் இருந்தால் என்னிடம் தாராளமாகக் கேட்கலாம்.",
      ai_quick_prompts: "பரிந்துரைக்கப்பட்ட கேள்விகள்:",
      ai_input_placeholder: "தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள் (எ.கா: 'ரேஷன் அட்டை இல்லையெனில் என்ன செய்வது?')...",
      ai_send_btn: "அனுப்பு",
      ai_disclaimer_notice: "DocMate AI என்பது கல்வி நோக்கில் உருவாக்கப்பட்ட மாதிரி. ஆவண நடைமுறைகள் மாறக்கூடும்; எனவே சம்பந்தப்பட்ட அரசு அலுவலகத்தில் இறுதி விவரங்களை சரிபார்க்கவும்.",
      ai_typing: "DocMate AI யோசித்து பதிலளிக்கிறது...",
      faq_title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faq_subtitle: "அரசு விண்ணப்பங்கள் தயாரிப்பது குறித்த பொதுவான சந்தேகங்கள்",
      about_title: "திட்டம் பற்றிய விவரங்கள்",
      about_badge: "மாணவர் AI கல்வி மாதிரி திட்டம் (AI Immersion Project)",
      about_intro: "DocMate AI என்பது குடிமக்கள் அரசு அலுவலகங்களுக்குச் செல்வதற்கு முன் தேவையான அனைத்து ஆவணங்களையும் எளிதாக அறிந்து கொள்ள உதவும் ஒரு முன்மாதிரி மென்பொருள் ஆகும்.",
      problem_title: "பிரச்சனை",
      problem_desc: "தினசரி லட்சக்கணக்கான மக்கள் முறையான ஆவணங்கள், தேவையான புகைப்படங்கள் அல்லது சுய சான்றொப்பம் இல்லாமல் அரசு அலுவலகங்களுக்குச் சென்று வெறும் கையோடு திரும்பி வருகின்றனர். இதனால் பணவிரயம் மற்றும் நேரவிரயம் ஏற்படுகிறது.",
      solution_title: "AI தீர்வு",
      solution_desc: "DocMate AI அமைப்பானது பயனரின் குடும்ப சூழல், சேவை வகை மற்றும் மாவட்ட தேவைகளைக் கருத்தில் கொண்டு, சரியான ஆவணப் பட்டியல் மற்றும் தயார்நிலை சதவீதத்தை துல்லியமாக கணக்கிட்டு வழங்குகிறது.",
      benefits_title: "எதிர்பார்க்கப்படும் பலன்கள்",
      benefits_item1: "தேவையற்ற மறுமுறை வருகைகளை 60% வரை குறைக்கிறது.",
      benefits_item2: "சரியான அரசு கட்டணம் மற்றும் கால அவகாசம் பற்றிய வெளிப்படைத்தன்மை.",
      benefits_item3: "புரோக்கர்கள் மற்றும் இடைத்தரகர்கள் மீதான சார்பை நீக்குகிறது.",
      benefits_item4: "தமிழ் மற்றும் ஆங்கிலத்தில் எளிமையாக பயன்படுத்தக்கூடிய வசதி.",
      safety_title: "பாதுகாப்பு, துல்லியம் & ரகசியத்தன்மை",
      safety_desc: "DocMate AI எந்தவொரு ஆதார் எண், வங்கி கணக்கு எண் அல்லது கடவுச்சொற்களை சேகரிப்பதில்லை. அனைத்து தகவல்களும் உங்கள் கணினியிலேயே பாதுகாப்பாக இயங்குகின்றன. இறுதி தேவைகளுக்கு எப்போதும் tnega.tn.gov.in போன்ற அரசு தளங்களை அணுகவும்.",
      footer_text: "DocMate AI — மாணவர் AI மாதிரி திட்டம். இது எந்தவொரு அதிகாரப்பூர்வ அரசு நிறுவனத்துடனும் நேரடியாக தொடர்புடையது அல்ல. சம்பந்தப்பட்ட துறையிடம் சரிபார்க்கவும்."
    }
  };

  const FAQ_DATA = [
    {
      q_en: "What is an Arasu e-Seva Center, and what services are available there?",
      q_ta: "அரசு இ-சேவை மையம் என்றால் என்ன? அங்கு என்னென்ன சேவைகள் கிடைக்கும்?",
      a_en: "Arasu e-Seva centers (run by TNeGA and cooperative credit societies) provide citizen services like applying for Community, Income, Nativity certificates, paying electricity bills, and applying for new smart cards for a nominal fixed fee of ₹60.",
      a_ta: "தமிழ்நாடு மின்னாளுமை முகமை (TNeGA) மூலம் நடத்தப்படும் இ-சேவை மையங்களில் சாதி, வருமானம், இருப்பிடச் சான்றிதழ்கள், மின் கட்டணம் செலுத்துதல், ஸ்மார்ட் குடும்ப அட்டை போன்ற 100-க்கும் மேற்பட்ட அரசு சேவைகளை ₹60 நிர்ணயிக்கப்பட்ட கட்டணத்தில் பெறலாம்."
    },
    {
      q_en: "What does 'Self-Attested Photocopy' mean?",
      q_ta: "'சுய சான்றொப்பமிட்ட நகல்' (Self-Attested) என்றால் என்ன?",
      a_en: "A self-attested photocopy is a photocopy of your original document where you write 'Self Attested', sign your normal signature, and write today's date across a blank portion. As per modern administrative reforms, gazetted officer attestation is no longer required for most state certificates.",
      a_ta: "அசல் ஆவணத்தின் நகலில், நீங்களே 'Self-Attested' அல்லது 'சுய சான்றொப்பம்' என்று எழுதி உங்கள் கையொப்பத்தையும் அன்றைய தேதியையும் இடுவது ஆகும். தற்போதைய அரசு விதிகளின்படி பெரும்பாலான சான்றிதழ்களுக்கு அரசு உயரதிகாரியின் சான்றொப்பம் அவசியமில்லை."
    },
    {
      q_en: "Can I show documents on DigiLocker instead of carrying physical originals?",
      q_ta: "அசல் ஆவணங்களுக்குப் பதிலாக மொபைலில் DigiLocker செயலியைக் காட்டலாமா?",
      a_en: "Under Rule 9A of the Information Technology Rules, documents fetched via DigiLocker (Aadhaar, Driving License, RC book, CBSE marksheets) are treated at par with original physical documents. However, for e-Seva scanning, having clear physical photocopies ready saves substantial time.",
      a_ta: "மத்திய அரசின் தகவல் தொழில்நுட்ப விதிகளின்படி DigiLocker-ல் உள்ள ஆவணங்கள் (ஆதார், ஓட்டுநர் உரிமம், வாகன RC) அசல் ஆவணங்களுக்கு சமமானவை. எனினும் இ-சேவை மையத்தில் ஸ்கேன் செய்ய காகித நகல்களை எடுத்துச் செல்வது பணியை விரைவுபடுத்தும்."
    },
    {
      q_en: "What should I do if my father does not have a Community Certificate?",
      q_ta: "என் தந்தையிடம் சாதிச் சான்றிதழ் இல்லையெனில் நான் எப்படி விண்ணப்பிப்பது?",
      a_en: "If your father's community certificate is unavailable, you can submit your mother's, paternal uncle's, paternal grandfather's, or biological sibling's community certificate. A genealogy chart and notary affidavit endorsed by the Village Administrative Officer (VAO) will also be required.",
      a_ta: "தந்தையின் சான்றிதழ் இல்லையெனில், தாயார், உடன்பிறந்த சகோதரர்/சகோதரி அல்லது தந்தையின் சகோதரரின் சான்றிதழை சமர்ப்பிக்கலாம். மேலும் VAO மற்றும் நோட்டரி உறுதிமொழிப் பத்திரம் மூலம் வம்சாவளி உறவை நிரூபிக்கலாம்."
    },
    {
      q_en: "How long is an Income Certificate valid in Tamil Nadu?",
      q_ta: "வருமானச் சான்றிதழின் செல்லுபடி காலம் எவ்வளவு?",
      a_en: "In Tamil Nadu, an Income Certificate is typically valid for 6 months (or for the current financial year: April 1 to March 31). A fresh certificate must be applied for educational scholarship renewals every academic year.",
      a_ta: "தமிழகத்தில் வருமானச் சான்றிதழ் வழக்கமாக 6 மாதங்கள் அல்லது சம்பந்தப்பட்ட நிதியாண்டுக்கு (ஏப்ரல் 1 முதல் மார்ச் 31 வரை) மட்டுமே செல்லுபடியாகும். கல்வி உதவித்தொகைக்கு ஒவ்வொரு ஆண்டும் புதுப்பிக்க வேண்டும்."
    },
    {
      q_en: "Does DocMate AI store my personal records or Aadhaar details?",
      q_ta: "DocMate AI என் தனிப்பட்ட தகவல்களையோ அல்லது ஆதார் எண்ணையோ சேமித்து வைக்கிறதா?",
      a_en: "No, absolutely not. DocMate AI is strictly a student educational prototype that runs entirely in your browser. We do not maintain any database or server storage of your identity, names, or addresses. Your privacy and safety are paramount.",
      a_ta: "இல்லை, நிச்சயமாக இல்லை. DocMate AI என்பது ஒரு கல்வி மாதிரி திட்டம். இது உங்கள் பிரவுசரிலேயே இயங்குகிறது; உங்கள் ஆதார் எண், பெயர் அல்லது முகவரி போன்ற எந்தவொரு ரகசிய தகவல்களையும் நாங்கள் சேமிப்பதில்லை."
    }
  ];

  // ==========================================
  // 3. AI ASSISTANT NATURAL LANGUAGE ENGINE
  // ==========================================
  class DocMateAIAssistant {
    constructor(services, lang) {
      this.servicesData = services;
      this.currentLang = lang;
    }

    setLanguage(lang) {
      this.currentLang = lang;
    }

    getSuggestions() {
      if (this.currentLang === "ta") {
        return [
          "பிறப்புச் சான்றிதழ் பெற என்ன ஆவணங்கள் தேவை?",
          "தந்தையின் சாதிச் சான்றிதழ் இல்லையெனில் என்ன செய்வது?",
          "வருமானச் சான்றிதழின் செல்லுபடி காலம் எவ்வளவு?",
          "இ-சேவை மையத்தில் அரசு கட்டணம் எவ்வளவு?",
          "DigiLocker ஆவணங்களை அரசு அலுவலகங்களில் ஏற்பார்களா?",
          "முகவரி சான்றுக்கு ரேஷன் கார்டு இல்லையெனில் மாற்று என்ன?"
        ];
      }
      return [
        "What documents do I need for a Birth Certificate?",
        "What if I don't have my father's Community Certificate?",
        "How long is an Income Certificate valid?",
        "What is the official government fee at e-Seva?",
        "Can I use DigiLocker documents instead of originals?",
        "What can I use as address proof without a Ration Card?"
      ];
    }

    async processQuery(userInput) {
      const query = userInput.trim().toLowerCase();
      await new Promise(r => setTimeout(r, 400));

      const isTamil = this.currentLang === "ta" || /[\u0B80-\u0BFF]/.test(userInput);
      const disclaimer = isTamil 
        ? "\n\n⚠️ *குறிப்பு: இது கல்வி வழிகாட்டுதல் மட்டுமே. உங்கள் உள்ளூர் வட்டாட்சியர் அல்லது இ-சேவை அலுவலகத்தில் இறுதி தேவைகளை சரிபார்க்கவும்.*"
        : "\n\n⚠️ *Note: This is an educational guide. Please verify the final requirements with your local Taluk / e-Seva office.*";

      if (query.includes("father") || query.includes("தந்தை") || query.includes("appa") || (query.includes("community") && (query.includes("without") || query.includes("miss") || query.includes("illai")))) {
        if (isTamil) {
          return {
            text: `உங்கள் தந்தையின் சாதிச் சான்றிதழ் இல்லையென்றாலும் சாதிச் சான்றிதழ் பெற வழிமுறைகள் உள்ளன:\n\n1. **மாற்று குடும்ப ஆவணங்கள்:** தாயார், உடன்பிறந்த சகோதரர்/சகோதரி அல்லது தந்தையின் சகோதரரின் சான்றிதழ்.\n2. **பள்ளி TC:** விண்ணப்பதாரரின் மாற்றுச் சான்றிதழில் சாதி பதிவு செய்யப்பட்டிருக்க வேண்டும்.\n3. **நோட்டரி பிரமாணப் பத்திரம்:** தந்தையின் சான்றிதழ் இல்லாத காரணத்தை விளக்கும் உறுதிமொழி பத்திரம்.\n4. **VAO களவிசாரணை:** கிராம நிர்வாக அலுவலர் பூர்வீக விசாரணை நடத்தி அறிக்கை தருவார்.${disclaimer}`,
            followUp: "உங்களுக்கு பள்ளி மாற்றுச் சான்றிதழ் (TC) நகல் ஏற்கனவே உள்ளதா?"
          };
        } else {
          return {
            text: `If your father's Community Certificate is not available, here are the accepted official alternative routes:\n\n1. **Immediate Family Proof:** Mother's, biological siblings', or paternal uncle's community certificate.\n2. **School Transfer Certificate (TC):** Applicant's TC with caste/community category recorded.\n3. **Notarized Lineage Affidavit:** Sworn affidavit explaining non-availability with family genealogical tree.\n4. **VAO Field Verification:** The Village Administrative Officer will conduct a local enquiry.${disclaimer}`,
            followUp: "Do you have your school Transfer Certificate (TC) ready?"
          };
        }
      }

      if (query.includes("digilocker") || query.includes("டிஜிலாக்கர்") || query.includes("digital copy") || query.includes("soft copy")) {
        if (isTamil) {
          return {
            text: `DigiLocker ஆவணங்கள் குறித்து தெரிந்து கொள்ள வேண்டியவை:\n\n• IT Act (Rule 9A) படி DigiLocker மூலம் சரிபார்க்கப்பட்ட டிஜிட்டல் ஆவணங்கள் அசல் ஆவணங்களுக்கு இணையாக சட்டப்பூர்வமாக அங்கீகரிக்கப்பட்டவை.\n• RTO மற்றும் போக்குவரத்து காவல்துறை DigiLocker ஆவணங்களை அதிகாரப்பூர்வமாக ஏற்கிறது.\n• **இ-சேவை மையங்களுக்கு குறிப்பு:** கணினியில் ஸ்கேன் செய்ய வேண்டியிருப்பதால், உங்களுடன் காகித நகல்களையும் எடுத்துச் செல்வது நேரத்தை மிச்சப்படுத்தும்.${disclaimer}`,
            followUp: "நீங்கள் எந்த சேவைக்காக விண்ணப்பிக்க திட்டமிட்டுள்ளீர்கள்?"
          };
        } else {
          return {
            text: `Yes! Here is how DigiLocker is treated at government offices:\n\n• Under Rule 9A of the IT Rules 2016, digitally verified documents via DigiLocker are legally on par with original physical documents.\n• RTO officially accepts DigiLocker for vehicle documents.\n• **Tip for e-Seva:** Because operators scan physical documents into the portal scanner, keeping 2 paper photocopies will prevent counter delays.${disclaimer}`,
            followUp: "Which specific service are you preparing documents for?"
          };
        }
      }

      if (query.includes("birth") || query.includes("பிறப்பு") || query.includes("pirappu") || query.includes("baby")) {
        if (isTamil) {
          return {
            text: `பிறப்புச் சான்றிதழ் பெற பொதுவாகத் தேவைப்படும் முக்கிய ஆவணங்கள்:\n\n1. **மருத்துவமனை பிறப்பு அறிக்கை (Discharge Summary / Form 1):** மருத்துவமனையால் வழங்கப்பட்ட அசல் அறிக்கை.\n2. **பெற்றோரின் ஆதார் அட்டைகள்:** தாய் மற்றும் தந்தை இருவரின் சுய சான்றொப்பமிட்ட நகல்கள்.\n3. **முகவரி சான்று / குடும்ப அட்டை:** தற்போதைய வசிப்பிடத்தை உறுதி செய்ய.\n4. **திருமணச் சான்றிதழ் (இருப்பின்).**\n\n📌 *குழந்தை பிறந்து 21 நாட்களுக்குள் பதிவு செய்வது இலவசம். 1 வருடத்திற்கு மேல் தாமதமானால் RDO உத்தரவு தேவை.*${disclaimer}`,
            followUp: "குழந்தை பிறந்து 21 நாட்களுக்குள் உள்ளதா அல்லது 1 வருடத்திற்கு மேலாகிவிட்டதா?"
          };
        } else {
          return {
            text: `For a Birth Certificate, you typically need the following verified documents:\n\n1. **Hospital Discharge Report / Form 1:** Stamped by hospital medical officer.\n2. **Both Parents' Aadhaar Cards:** Self-attested copies (bring originals for spot check).\n3. **Address Proof / Smart Ration Card:** Proving residence in the registrar jurisdiction.\n4. **Marriage Certificate (Optional but helpful).**\n\n📌 *Registration within 21 days is direct. If delayed beyond 1 year, an RDO/Magistrate order is required.*${disclaimer}`,
            followUp: "Was the child born within the last 21 days, or is this a delayed registration?"
          };
        }
      }

      if (query.includes("income") || query.includes("வருமானம்") || query.includes("varumanam") || query.includes("validity") || query.includes("செல்லுபடி")) {
        if (isTamil) {
          return {
            text: `வருமானச் சான்றிதழ் பற்றிய முக்கிய தகவல்கள்:\n\n• **செல்லுபடி காலம்:** தமிழகத்தில் வருமானச் சான்றிதழ் வழக்கமாக 6 மாதங்கள் அல்லது நடப்பு நிதியாண்டுக்கு (March 31 வரை) மட்டுமே செல்லும்.\n• **தேவையான ஆவணங்கள்:** சம்பள ரசீது / வருமான உறுதிமொழி பத்திரம், குடும்ப அட்டை, ஆதார் அட்டை, சொத்து வரி அல்லது மின்கட்டண ரசீது.\n• **அரசு கட்டணம்:** அரசு இ-சேவை மையத்தில் ₹60 மட்டுமே.${disclaimer}`,
            followUp: "விண்ணப்பதாரர் மாத சம்பளம் பெறுபவரா அல்லது சுயதொழில் செய்பவரா?"
          };
        } else {
          return {
            text: `Key requirements & validity for an Income Certificate:\n\n• **Validity Period:** In most states, an Income Certificate is valid for 6 months or until March 31 of the financial year.\n• **Checklist:** Salary Slip or Notarized Income Affidavit, Smart Family Ration Card, Aadhaar Card, Recent EB bill / Property tax receipt.\n• **Official Fee:** Standard e-Seva service charge is ₹60.${disclaimer}`,
            followUp: "Are you applying as a salaried employee or self-employed earner?"
          };
        }
      }

      if (query.includes("fee") || query.includes("charge") || query.includes("cost") || query.includes("கட்டணம்") || query.includes("kattanam") || query.includes("panam")) {
        if (isTamil) {
          return {
            text: `அரசு இ-சேவை மைய கட்டண விவரங்கள்:\n\n• **நிலையான இ-சேவை கட்டணம்:** சாதி, வருமானம், இருப்பிடம், முதல் பட்டதாரி, வாரிசுச் சான்றிதழ்களுக்கு அரசு நிர்ணயித்த கட்டணம் **₹60 மட்டுமே**.\n• **ஸ்மார்ட் ரேஷன் கார்டு:** அட்டை அச்சிடும் கட்டணம் சுமார் ₹20 - ₹30.\n• **ஓட்டுநர் உரிமம் (RTO):** LLR கட்டணம் சுமார் ₹200.\n\n⚠️ எப்போதும் கணினியில் அச்சிடப்பட்ட அதிகாரப்பூர்வ ரசீதை (Acknowledgement Slip) பெற்றுக் கொள்ளுங்கள்.${disclaimer}`,
            followUp: "உங்களுக்கு கணினி ரசீது பெறுவதில் ஏதேனும் சந்தேகம் உள்ளதா?"
          };
        } else {
          return {
            text: `Official Government & e-Seva Fee Structure:\n\n• **Standard Revenue Certificates:** Authorized fee at Arasu e-Seva counters is **₹60 only**.\n• **Smart Ration Card:** ₹20 - ₹30 for PVC card printing.\n• **Driving License (RTO):** ~₹200 for LLR test.\n\n⚠️ Always insist on the printed computer acknowledgement slip with your CAN / reference number.${disclaimer}`,
            followUp: "Would you like help calculating the exact readiness of your documents?"
          };
        }
      }

      if (query.includes("address proof") || query.includes("no ration") || query.includes("ration card illai") || query.includes("முகவரி சான்று")) {
        if (isTamil) {
          return {
            text: `ஸ்மார்ட் ரேஷன் கார்டு இல்லையெனில் ஏற்றுக்கொள்ளப்படும் மாற்று முகவரி சான்றுகள்:\n\n1. **ஆதார் அட்டை:** தற்போதைய சரியான முகவரியுடன் கூடிய ஆதார் அட்டை.\n2. **மின்கட்டண ரசீது (EB Bill):** சமீபத்திய 3 மாதங்களுக்குள் உள்ள ரசீது.\n3. **வாடகை ஒப்பந்தம்:** முத்திரைத்தாளில் பதிவு செய்யப்பட்ட நடப்பு ஒப்பந்தம்.\n4. **வங்கி கணக்குப் புத்தகம் (Bank Passbook):** முகவரியுடன் கூடிய வங்கி பாஸ்புக்.\n5. **வாக்காளர் அட்டை (Voter ID) / பாஸ்போர்ட்.**${disclaimer}`,
            followUp: "இவற்றில் எந்த மாற்று ஆவணம் தற்போது உங்களிடம் உள்ளது?"
          };
        } else {
          return {
            text: `If you do not have a Ration Card, here are recognized alternative proofs of address:\n\n1. **Aadhaar Card:** With current address.\n2. **Electricity Bill (EB):** Recent bill within 3 months.\n3. **Registered Rental Agreement:** Along with landlord's EB receipt.\n4. **Nationalized Bank Passbook:** First page stamped with current address.\n5. **Voter ID Card (EPIC) or Indian Passport.**${disclaimer}`,
            followUp: "Which of these alternate address proofs do you currently possess?"
          };
        }
      }

      for (const service of this.servicesData) {
        if (query.includes(service.id) || query.includes(service.name_en.toLowerCase()) || query.includes(service.name_ta)) {
          const docsList = service.documents.map((d, i) => `${i + 1}. **${isTamil ? d.name_ta : d.name_en}** (${isTamil ? d.format_label_ta : d.format_label_en})`).join("\n");
          if (isTamil) {
            return {
              text: `**${service.name_ta}** பெறுவதற்கான முக்கிய ஆவணங்களின் பட்டியல்:\n\n${docsList}\n\n• **வழங்கும் துறை:** ${service.issuing_authority_ta}\n• **தோராயமான காலம்:** ${service.processing_days}\n• **அரசு கட்டணம்:** ${service.standard_fee}${disclaimer}`,
              followUp: "இந்த ஆவணங்கள் உங்களிடம் உள்ளதா? சரிபார்க்க 'Find Required Documents' பொத்தானை அழுத்தவும்."
            };
          } else {
            return {
              text: `Here are the primary documents required for **${service.name_en}**:\n\n${docsList}\n\n• **Issuing Authority:** ${service.issuing_authority_en}\n• **Standard Timeline:** ${service.processing_days}\n• **Official Fee:** ${service.standard_fee}${disclaimer}`,
              followUp: "Do you have all these documents ready, or would you like to review alternative proofs?"
            };
          }
        }
      }

      if (isTamil) {
        return {
          text: `உங்கள் கேள்வி எனக்குப் புரிந்தது: "${userInput}".\n\nஅரசு ஆவணங்கள் குறித்த பொதுவான ஆலோசனைகள்:\n1. அசல் ஆவணங்களுடன் குறைந்தது 2 செட் சுய சான்றொப்பமிட்ட நகல்களை (Self-Attested Photocopies) தயாராக வைத்திருங்கள்.\n2. 3 சமீபத்திய பாஸ்போர்ட் அளவு வண்ணப் புகைப்படங்களை கையில் வைத்திருங்கள்.\n3. உங்கள் பகுதியில் உள்ள அங்கீகரிக்கப்பட்ட அரசு இ-சேவை மையத்தை அணுகினால் எளிதில் விண்ணப்பிக்கலாம்.${disclaimer}`,
          followUp: "நீங்கள் எந்த குறிப்பிட்ட அரசு சேவையை நாட விரும்புகிறீர்கள்?"
        };
      } else {
        return {
          text: `Thank you for your question: "${userInput}".\n\nGeneral practical advice for government paperwork:\n1. Always carry your **Original Documents** along with **2 sets of Self-Attested Photocopies**.\n2. Keep **3 recent passport-size photographs** ready.\n3. Ensure your name and Date of Birth match across your Aadhaar, school marksheet, and ration card.\n4. For specific document requirements, select a certificate from the Services menu.${disclaimer}`,
          followUp: "Which specific service or document would you like me to inspect for you?"
        };
      }
    }
  }

  // ==========================================
  // 4. MAIN CONTROLLER CLASS
  // ==========================================
  class DocMateApp {
    constructor() {
      this.currentLang = localStorage.getItem('docmate_lang') || 'en';
      this.currentView = 'home';
      this.selectedService = null;
      this.userContext = {
        serviceId: 'birth-certificate',
        state: 'Tamil Nadu',
        district: 'Chennai',
        applicantRelation: 'self',
        mode: 'eseva',
        urgency: 'normal',
        residenceType: 'own'
      };
      
      this.checklistState = {};
      this.currentFilter = 'all';
      this.aiAssistant = new DocMateAIAssistant(SERVICES_DATA, this.currentLang);

      this.init();
    }

    init() {
      this.bindEvents();
      this.applyLanguage(this.currentLang);
      this.populateStatesAndDistricts();
      this.populateServiceDropdown();
      this.renderServicesGrid();
      this.renderFAQs();
      this.renderNextSteps();
      this.renderOfficeQuestions();
      this.renderAIChips();

      // Pre-select first service
      this.selectService('birth-certificate', false);

      // Route based on URL hash if provided
      const hash = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(hash);

      this.refreshIcons();
    }

    refreshIcons() {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try {
          window.lucide.createIcons();
        } catch (e) {
          console.warn('Lucide icon render warning:', e);
        }
      }
    }

    // --- NAVIGATION ---
    navigateTo(viewName) {
      const validViews = ['home', 'services', 'questionnaire', 'checklist', 'assistant', 'faq', 'about'];
      if (!validViews.includes(viewName)) viewName = 'home';

      this.currentView = viewName;
      window.location.hash = viewName;

      // Update active nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Hide all views, display target
      document.querySelectorAll('.app-view').forEach(view => {
        view.style.display = 'none';
      });

      const targetView = document.getElementById(`view-${viewName}`);
      if (targetView) {
        targetView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      this.refreshIcons();
    }

    // --- LANGUAGE SWITCHING ---
    setLanguage(lang) {
      this.currentLang = lang;
      try {
        localStorage.setItem('docmate_lang', lang);
      } catch (e) { /* ignore storage error */ }
      
      this.aiAssistant.setLanguage(lang);
      this.applyLanguage(lang);
      this.renderServicesGrid();
      this.renderFAQs();
      this.renderNextSteps();
      this.renderOfficeQuestions();
      this.renderAIChips();
      this.populateServiceDropdown();
      
      if (this.selectedService) {
        this.renderChecklist();
      }

      this.refreshIcons();
    }

    applyLanguage(lang) {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

      const enLabel = document.getElementById('lang-label-en');
      const taLabel = document.getElementById('lang-label-ta');
      if (lang === 'ta') {
        if (enLabel) enLabel.classList.remove('lang-active');
        if (taLabel) taLabel.classList.add('lang-active');
      } else {
        if (enLabel) enLabel.classList.add('lang-active');
        if (taLabel) taLabel.classList.remove('lang-active');
      }

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const pair = el.getAttribute('data-i18n-attr').split(':');
        const attr = pair[0];
        const key = pair[1];
        if (dict[key]) {
          el.setAttribute(attr, dict[key]);
        }
      });
    }

    // --- FORM DATA POPULATION ---
    populateStatesAndDistricts() {
      const stateSelect = document.getElementById('form-state-select');
      const districtSelect = document.getElementById('form-district-select');
      if (!stateSelect || !districtSelect) return;

      stateSelect.innerHTML = '';
      const states = Object.keys(STATES_AND_DISTRICTS);
      states.forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        if (state === this.userContext.state) opt.selected = true;
        stateSelect.appendChild(opt);
      });

      const updateDistricts = () => {
        const selectedState = stateSelect.value;
        const districts = STATES_AND_DISTRICTS[selectedState] || [];
        districtSelect.innerHTML = '';
        districts.forEach(dist => {
          const opt = document.createElement('option');
          opt.value = dist;
          opt.textContent = dist;
          if (dist === this.userContext.district) opt.selected = true;
          districtSelect.appendChild(opt);
        });
      };

      stateSelect.addEventListener('change', updateDistricts);
      updateDistricts();
    }

    populateServiceDropdown() {
      const serviceSelect = document.getElementById('form-service-select');
      if (!serviceSelect) return;

      serviceSelect.innerHTML = '';
      SERVICES_DATA.forEach(service => {
        const opt = document.createElement('option');
        opt.value = service.id;
        opt.textContent = this.currentLang === 'ta' ? service.name_ta : service.name_en;
        if (this.selectedService && service.id === this.selectedService.id) {
          opt.selected = true;
        }
        serviceSelect.appendChild(opt);
      });
    }

    renderServicesGrid() {
      const container = document.getElementById('services-grid-container');
      if (!container) return;

      const searchTerm = (document.getElementById('service-search-input')?.value || '').toLowerCase();
      const activeCategory = document.querySelector('.category-pill.active')?.getAttribute('data-cat') || 'all';

      const filtered = SERVICES_DATA.filter(service => {
        const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
        const nameEn = service.name_en.toLowerCase();
        const nameTa = service.name_ta.toLowerCase();
        const descEn = service.desc_en.toLowerCase();
        const descTa = service.desc_ta.toLowerCase();
        const matchesSearch = !searchTerm || nameEn.includes(searchTerm) || nameTa.includes(searchTerm) || descEn.includes(searchTerm) || descTa.includes(searchTerm);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--neutral-300);">
            <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--neutral-400); margin-bottom: 12px;"></i>
            <h3>${this.currentLang === 'ta' ? 'சேவை எதுவும் கிடைக்கவில்லை' : 'No Services Found'}</h3>
            <p style="color: var(--neutral-500); margin-top: 6px;">
              ${this.currentLang === 'ta' ? 'வேறு தேடல் சொல்லைப் பயன்படுத்தி முயற்சிக்கவும் அல்லது AI உதவியாளரிடம் கேட்கவும்.' : 'Try another search keyword or ask DocMate Assistant directly.'}
            </p>
          </div>
        `;
        this.refreshIcons();
        return;
      }

      container.innerHTML = filtered.map(service => {
        const name = this.currentLang === 'ta' ? service.name_ta : service.name_en;
        const desc = this.currentLang === 'ta' ? service.desc_ta : service.desc_en;
        const authority = this.currentLang === 'ta' ? service.issuing_authority_ta : service.issuing_authority_en;
        const btnText = this.currentLang === 'ta' ? 'சரிபார்ப்பு பட்டியல்' : 'Generate Checklist';
        const authorityLabel = this.currentLang === 'ta' ? 'வழங்கும் துறை' : 'Issuing Authority';
        const estTimeLabel = this.currentLang === 'ta' ? 'ஆகும் காலம்' : 'Est. Timeline';
        const feeLabel = this.currentLang === 'ta' ? 'அரசு கட்டணம்' : 'Govt / e-Seva Fee';

        return `
          <div class="service-card" data-service-id="${service.id}">
            <div class="service-card-top">
              <div class="service-icon-box">
                <i data-lucide="${service.icon || 'file-text'}"></i>
              </div>
              <div>
                <h3 class="service-card-title">${name}</h3>
                <span class="preview-chip" style="font-size:0.7rem;">${service.category.toUpperCase()}</span>
              </div>
            </div>

            <p class="service-card-desc">${desc}</p>

            <div class="service-meta-grid">
              <div>
                <div class="meta-item-label">${authorityLabel}</div>
                <div class="meta-item-value">${authority}</div>
              </div>
              <div>
                <div class="meta-item-label">${estTimeLabel}</div>
                <div class="meta-item-value">${service.processing_days}</div>
              </div>
              <div style="grid-column: 1 / -1;">
                <div class="meta-item-label">${feeLabel}</div>
                <div class="meta-item-value" style="color: var(--emerald-dark);">${service.standard_fee}</div>
              </div>
            </div>

            <button class="btn-card-select" data-service-id="${service.id}">
              <span>${btnText}</span>
              <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
            </button>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.service-card, .btn-card-select').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = el.getAttribute('data-service-id');
          this.selectService(id, true);
        });
      });

      this.refreshIcons();
    }

    selectService(serviceId, navigateToQuestionnaire = true) {
      const service = SERVICES_DATA.find(s => s.id === serviceId) || SERVICES_DATA[0];
      this.selectedService = service;
      this.userContext.serviceId = service.id;

      this.checklistState = {};
      service.documents.forEach(doc => {
        this.checklistState[doc.id] = 'need';
      });

      const serviceSelect = document.getElementById('form-service-select');
      if (serviceSelect) serviceSelect.value = service.id;

      if (navigateToQuestionnaire) {
        this.navigateTo('questionnaire');
      }
    }

    // --- CHECKLIST & READINESS ---
    generateChecklistFromForm() {
      const form = document.getElementById('checklist-context-form');
      if (!form) return;

      const serviceId = document.getElementById('form-service-select').value;
      const state = document.getElementById('form-state-select').value;
      const district = document.getElementById('form-district-select').value;
      const applicantRelation = (form.elements['applicant_relation'] && form.elements['applicant_relation'].value) || 'self';
      const mode = document.getElementById('form-mode-select').value;
      const urgency = document.getElementById('form-urgency-select').value;
      const residenceType = document.getElementById('form-residence-type').value;

      this.userContext = {
        serviceId,
        state,
        district,
        applicantRelation,
        mode,
        urgency,
        residenceType
      };

      this.selectedService = SERVICES_DATA.find(s => s.id === serviceId) || SERVICES_DATA[0];
      
      this.checklistState = {};
      this.selectedService.documents.forEach(d => {
        this.checklistState[d.id] = 'need';
      });

      this.renderChecklist();
      this.navigateTo('checklist');
    }

    renderChecklist() {
      if (!this.selectedService) return;

      const isTamil = this.currentLang === 'ta';
      const serviceName = isTamil ? this.selectedService.name_ta : this.selectedService.name_en;
      const serviceDesc = isTamil ? this.selectedService.desc_ta : this.selectedService.desc_en;

      document.getElementById('checklist-service-name').textContent = serviceName;
      document.getElementById('checklist-service-desc').textContent = serviceDesc;
      document.getElementById('checklist-category-badge').textContent = this.selectedService.category.toUpperCase();

      const tagsContainer = document.getElementById('checklist-user-context-tags');
      tagsContainer.innerHTML = `
        <span class="meta-badge"><i data-lucide="map-pin" style="width:12px;height:12px;"></i> ${this.userContext.district}, ${this.userContext.state}</span>
        <span class="meta-badge"><i data-lucide="user" style="width:12px;height:12px;"></i> ${this.getRelationLabel(this.userContext.applicantRelation)}</span>
        <span class="meta-badge"><i data-lucide="building" style="width:12px;height:12px;"></i> ${this.getModeLabel(this.userContext.mode)}</span>
        ${this.userContext.urgency === 'urgent' ? '<span class="meta-badge" style="background:#fee2e2;color:#dc2626;"><i data-lucide="zap" style="width:12px;height:12px;"></i> Urgent / Tatkal</span>' : ''}
      `;

      const listContainer = document.getElementById('checklist-items-container');
      const filter = this.currentFilter;

      let itemsToRender = this.selectedService.documents.filter(doc => {
        const state = this.checklistState[doc.id] || 'need';
        if (filter === 'have') return state === 'have';
        if (filter === 'need') return state === 'need';
        return true;
      });

      if (itemsToRender.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align:center; padding: 40px; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--neutral-300);">
            <p style="color:var(--neutral-500); font-weight:600;">
              ${isTamil ? 'இந்த வடிகட்டலில் ஆவணங்கள் எதுவும் இல்லை.' : 'No documents match this filter.'}
            </p>
          </div>
        `;
      } else {
        listContainer.innerHTML = itemsToRender.map(doc => {
          const docState = this.checklistState[doc.id] || 'need';
          const docName = isTamil ? doc.name_ta : doc.name_en;
          const reason = isTamil ? doc.reason_ta : doc.reason_en;
          const note = isTamil ? doc.note_ta : doc.note_en;
          const formatLabel = isTamil ? doc.format_label_ta : doc.format_label_en;

          const haveActive = docState === 'have' ? 'active-have' : '';
          const needActive = docState === 'need' ? 'active-need' : '';
          const naActive = docState === 'na' ? 'active-na' : '';

          return `
            <div class="checklist-item-card state-${docState}" id="card-${doc.id}">
              <div class="item-main-header">
                <div class="item-title">
                  <span>${docName}</span>
                  ${doc.essential ? `<span class="essential-badge">${isTamil ? 'கட்டாயம்' : 'MANDATORY'}</span>` : ''}
                </div>

                <div class="item-status-buttons">
                  <button class="status-choice-btn ${haveActive}" data-doc-id="${doc.id}" data-set-state="have">
                    <i data-lucide="check-circle-2" style="width:14px;height:14px;"></i>
                    <span>${isTamil ? 'என்னிடம் உள்ளது' : 'I have this'}</span>
                  </button>
                  <button class="status-choice-btn ${needActive}" data-doc-id="${doc.id}" data-set-state="need">
                    <i data-lucide="clock" style="width:14px;height:14px;"></i>
                    <span>${isTamil ? 'இது தேவை' : 'I need this'}</span>
                  </button>
                  <button class="status-choice-btn ${naActive}" data-doc-id="${doc.id}" data-set-state="na">
                    <i data-lucide="minus-circle" style="width:14px;height:14px;"></i>
                    <span>${isTamil ? 'பொருந்தாது' : 'N/A'}</span>
                  </button>
                </div>
              </div>

              <div class="item-content-grid">
                <div class="item-reason">
                  <strong>${isTamil ? 'ஏன் தேவைப்படலாம்:' : 'Why it may be required:'}</strong>
                  <div>${reason}</div>
                  <div class="format-pill">
                    <i data-lucide="file-badge-2" style="width:12px;height:12px;vertical-align:middle;"></i>
                    ${formatLabel}
                  </div>
                </div>

                <div class="item-note">
                  <strong>${isTamil ? 'முக்கிய சரிபார்ப்பு குறிப்பு:' : 'Important Verification Note:'}</strong>
                  <div style="color:var(--neutral-700);">${note}</div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

      listContainer.querySelectorAll('.status-choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const docId = btn.getAttribute('data-doc-id');
          const newState = btn.getAttribute('data-set-state');
          this.setDocumentStatus(docId, newState);
        });
      });

      this.calculateReadinessScore();
      this.refreshIcons();
    }

    setDocumentStatus(docId, newState) {
      this.checklistState[docId] = newState;
      this.renderChecklist();
    }

    calculateReadinessScore() {
      if (!this.selectedService) return;

      const docs = this.selectedService.documents;
      let applicableDocs = 0;
      let haveDocs = 0;

      docs.forEach(doc => {
        const state = this.checklistState[doc.id] || 'need';
        if (state !== 'na') {
          applicableDocs++;
          if (state === 'have') {
            haveDocs++;
          }
        }
      });

      const percent = applicableDocs === 0 ? 100 : Math.round((haveDocs / applicableDocs) * 100);

      const textEl = document.getElementById('readiness-percent-text');
      if (textEl) textEl.textContent = `${percent}%`;

      const circle = document.getElementById('readiness-circle');
      if (circle) {
        const maxOffset = 263.89;
        const offset = maxOffset - (percent / 100) * maxOffset;
        circle.style.strokeDashoffset = offset;

        if (percent >= 80) {
          circle.style.stroke = '#10b981';
        } else if (percent >= 50) {
          circle.style.stroke = '#f59e0b';
        } else {
          circle.style.stroke = '#f43f5e';
        }
      }

      const feedbackEl = document.getElementById('readiness-status-feedback');
      const isTamil = this.currentLang === 'ta';
      if (feedbackEl) {
        if (percent >= 80) {
          feedbackEl.textContent = isTamil
            ? `அற்புதம்! உங்களிடம் ${haveDocs}/${applicableDocs} ஆவணங்கள் தயாராக உள்ளன. அலுவலகத்திற்குச் செல்லலாம்.`
            : `Great job! You have ${haveDocs} of ${applicableDocs} required documents. Ready to visit!`;
        } else if (percent >= 50) {
          feedbackEl.textContent = isTamil
            ? `நல்ல முன்னேற்றம். உங்களிடம் ${haveDocs}/${applicableDocs} உள்ளன; இன்னும் சிலவற்றை தயார் செய்ய வேண்டும்.`
            : `Moderate readiness: ${haveDocs} of ${applicableDocs} ready. Complete pending items before your visit.`;
        } else {
          feedbackEl.textContent = isTamil
            ? `தயாரிப்பு தேவை: உங்களிடம் ${haveDocs}/${applicableDocs} மட்டுமே உள்ளன. அலைச்சலைத் தவிர்க்க ஆவணங்களைச் சேர்க்கவும்.`
            : `Preparation needed: only ${haveDocs} of ${applicableDocs} ready. Gather missing paperwork to prevent rejection.`;
        }
      }
    }

    renderNextSteps() {
      const container = document.getElementById('next-steps-container');
      if (!container) return;

      const isTamil = this.currentLang === 'ta';
      container.innerHTML = NEXT_STEPS_GUIDE.map(item => `
        <div class="step-card">
          <div class="step-num-badge">${item.step}</div>
          <h4>${isTamil ? item.title_ta : item.title_en}</h4>
          <p>${isTamil ? item.desc_ta : item.desc_en}</p>
        </div>
      `).join('');
    }

    renderOfficeQuestions() {
      const container = document.getElementById('office-questions-container');
      if (!container) return;

      const isTamil = this.currentLang === 'ta';
      container.innerHTML = COMMON_QUESTIONS_AT_OFFICE.map(item => `
        <div class="question-card">
          <div>
            <div class="question-text">"${isTamil ? item.question_ta : item.question_en}"</div>
            <div class="question-tip">${isTamil ? item.tip_ta : item.tip_en}</div>
          </div>
          <button class="copy-btn" data-copy="${isTamil ? item.question_ta : item.question_en}">
            <i data-lucide="copy" style="width:12px;height:12px;vertical-align:middle;"></i>
            <span>${isTamil ? 'நகலெடு' : 'Copy Question'}</span>
          </button>
        </div>
      `).join('');

      container.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.getAttribute('data-copy');
          navigator.clipboard.writeText(text).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = `<i data-lucide="check" style="width:12px;height:12px;"></i> Copied!`;
            this.refreshIcons();
            setTimeout(() => {
              btn.innerHTML = original;
              this.refreshIcons();
            }, 2000);
          }).catch(() => {
            alert('Question copied to clipboard:\n' + text);
          });
        });
      });
    }

    renderFAQs() {
      const container = document.getElementById('faq-accordion-container');
      if (!container) return;

      const isTamil = this.currentLang === 'ta';
      container.innerHTML = FAQ_DATA.map((faq, idx) => `
        <div class="faq-item ${idx === 0 ? 'open' : ''}">
          <button class="faq-question">
            <span>${isTamil ? faq.q_ta : faq.q_en}</span>
            <i data-lucide="chevron-down" class="faq-icon"></i>
          </button>
          <div class="faq-answer">
            ${isTamil ? faq.a_ta : faq.a_en}
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const parent = btn.closest('.faq-item');
          parent.classList.toggle('open');
        });
      });
    }

    renderAIChips() {
      const container = document.getElementById('quick-prompt-chips');
      if (!container) return;

      const suggestions = this.aiAssistant.getSuggestions();
      container.innerHTML = suggestions.map(s => `
        <button type="button" class="prompt-chip" data-prompt="${s}">${s}</button>
      `).join('');

      container.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          this.sendChatMessage(prompt);
        });
      });
    }

    async sendChatMessage(userText) {
      if (!userText || !userText.trim()) return;

      const chatContainer = document.getElementById('chat-messages-container');
      const inputField = document.getElementById('chat-user-input');
      
      if (inputField) inputField.value = '';

      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = userText;
      chatContainer.appendChild(userBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      const typingBubble = document.createElement('div');
      typingBubble.className = 'chat-bubble typing';
      typingBubble.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:14px;height:14px;vertical-align:middle;"></i> DocMate AI is thinking...`;
      chatContainer.appendChild(typingBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      this.refreshIcons();

      const response = await this.aiAssistant.processQuery(userText);
      typingBubble.remove();

      const assistantBubble = document.createElement('div');
      assistantBubble.className = 'chat-bubble assistant';
      assistantBubble.innerHTML = this.formatMarkdown(response.text);

      if (response.followUp) {
        const followUpDiv = document.createElement('div');
        followUpDiv.style.marginTop = '12px';
        followUpDiv.style.paddingTop = '10px';
        followUpDiv.style.borderTop = '1px solid var(--neutral-200)';
        followUpDiv.style.fontSize = '0.85rem';
        followUpDiv.style.fontWeight = '600';
        followUpDiv.style.color = 'var(--primary)';
        followUpDiv.innerHTML = `💡 Follow-up: ${response.followUp}`;
        assistantBubble.appendChild(followUpDiv);
      }

      chatContainer.appendChild(assistantBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      this.refreshIcons();
    }

    formatMarkdown(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }

    printChecklist() {
      window.print();
    }

    downloadChecklist() {
      if (!this.selectedService) return;

      const isTamil = this.currentLang === 'ta';
      const serviceName = isTamil ? this.selectedService.name_ta : this.selectedService.name_en;
      
      let content = `========================================================\n`;
      content += ` DOCMATE AI - GOVERNMENT DOCUMENT CHECKLIST\n`;
      content += ` Student Educational Prototype - Verify with Local Office\n`;
      content += `========================================================\n\n`;
      content += `Service: ${serviceName}\n`;
      content += `Location: ${this.userContext.district}, ${this.userContext.state}\n`;
      content += `Applicant: ${this.getRelationLabel(this.userContext.applicantRelation)}\n`;
      content += `Mode: ${this.getModeLabel(this.userContext.mode)}\n`;
      content += `Date Generated: ${new Date().toLocaleDateString()}\n\n`;
      content += `--------------------------------------------------------\n`;
      content += `DOCUMENT PREPARATION STATUS:\n`;
      content += `--------------------------------------------------------\n`;

      this.selectedService.documents.forEach((doc, idx) => {
        const state = this.checklistState[doc.id] || 'need';
        const mark = state === 'have' ? '[✓ HAVE]' : state === 'need' ? '[○ NEED]' : '[— N/A]';
        const docName = isTamil ? doc.name_ta : doc.name_en;
        const format = isTamil ? doc.format_label_ta : doc.format_label_en;
        const note = isTamil ? doc.note_ta : doc.note_en;

        content += `${idx + 1}. ${mark} ${docName}\n`;
        content += `   Format: ${format}\n`;
        content += `   Verification Tip: ${note}\n\n`;
      });

      content += `--------------------------------------------------------\n`;
      content += `NEXT PRACTICAL STEPS BEFORE VISITING:\n`;
      content += `1. Carry original documents + 2 self-attested photocopies.\n`;
      content += `2. Keep 3 recent passport-size color photographs.\n`;
      content += `3. Fee: Approximately ${this.selectedService.standard_fee} at e-Seva.\n`;
      content += `4. Always collect your computer-printed acknowledgment slip with CAN tracking.\n\n`;
      content += `DISCLAIMER: DocMate AI is an educational project prototype.\n`;
      content += `Document requirements can change. Always verify with your local Tahsildar / e-Seva office.\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DocMate_${this.selectedService.id}_Checklist.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    resetChecklist() {
      if (!this.selectedService) return;
      this.selectedService.documents.forEach(doc => {
        this.checklistState[doc.id] = 'need';
      });
      this.renderChecklist();
    }

    getRelationLabel(key) {
      const dict = {
        self: this.currentLang === 'ta' ? 'எனக்காக (சுய விண்ணப்பம்)' : 'For Myself',
        minor: this.currentLang === 'ta' ? 'மைனர் குழந்தை' : 'Minor Child',
        parent: this.currentLang === 'ta' ? 'பெற்றோர் / முதியோர்' : 'Parent / Elderly',
        deceased: this.currentLang === 'ta' ? 'மறைந்த உறுப்பினர்' : 'Deceased Relative',
        spouse: this.currentLang === 'ta' ? 'கணவர் / மனைவி' : 'Spouse'
      };
      return dict[key] || key;
    }

    getModeLabel(key) {
      const dict = {
        eseva: this.currentLang === 'ta' ? 'அரசு இ-சேவை மையம்' : 'Arasu e-Seva Center',
        online: this.currentLang === 'ta' ? 'இணையதளம்' : 'Online Portal',
        office: this.currentLang === 'ta' ? 'வட்டாட்சியர் அலுவலகம்' : 'Direct Taluk Office'
      };
      return dict[key] || key;
    }

    bindEvents() {
      // Hash change listener for browser back/forward and direct links
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        this.navigateTo(hash);
      });

      // Nav link clicks
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const page = link.getAttribute('data-page');
          this.navigateTo(page);
        });
      });

      document.getElementById('nav-brand-btn')?.addEventListener('click', () => {
        this.navigateTo('home');
      });

      document.getElementById('lang-toggle')?.addEventListener('click', () => {
        const nextLang = this.currentLang === 'en' ? 'ta' : 'en';
        this.setLanguage(nextLang);
      });

      document.getElementById('hero-find-docs-btn')?.addEventListener('click', () => {
        this.navigateTo('services');
      });

      document.getElementById('hero-open-chat-btn')?.addEventListener('click', () => {
        this.navigateTo('assistant');
      });

      document.getElementById('floating-chat-btn')?.addEventListener('click', () => {
        this.navigateTo('assistant');
      });

      document.getElementById('service-search-input')?.addEventListener('input', () => {
        this.renderServicesGrid();
      });

      document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.renderServicesGrid();
        });
      });

      document.querySelectorAll('.radio-card').forEach(card => {
        card.addEventListener('click', () => {
          const input = card.querySelector('input[type="radio"]');
          if (input) {
            input.checked = true;
            document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
          }
        });
      });

      document.getElementById('checklist-context-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.generateChecklistFromForm();
      });

      document.getElementById('form-back-btn')?.addEventListener('click', () => {
        this.navigateTo('services');
      });

      document.querySelectorAll('.filter-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.filter-tab-btn').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.currentFilter = tab.getAttribute('data-filter');
          this.renderChecklist();
        });
      });

      document.getElementById('print-checklist-btn')?.addEventListener('click', () => this.printChecklist());
      document.getElementById('download-checklist-btn')?.addEventListener('click', () => this.downloadChecklist());
      document.getElementById('reset-checklist-btn')?.addEventListener('click', () => this.resetChecklist());

      document.getElementById('chat-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-user-input');
        if (input) this.sendChatMessage(input.value);
      });

      document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
        const navLinks = document.getElementById('desktop-nav-links');
        if (!navLinks) return;
        if (navLinks.style.display === 'flex') {
          navLinks.style.display = 'none';
        } else {
          navLinks.style.display = 'flex';
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '100%';
          navLinks.style.left = '0';
          navLinks.style.width = '100%';
          navLinks.style.background = 'white';
          navLinks.style.padding = '16px';
          navLinks.style.boxShadow = 'var(--shadow-md)';
        }
      });
    }
  }

  // Initialize immediately or on DOMContentLoaded
  function bootstrap() {
    if (!window.docMateAppInstance) {
      window.docMateAppInstance = new DocMateApp();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
