// Intelligent Conversational AI Engine for DocMate AI
// Supports natural language in English, Tamil (தமிழ்), and Tanglish.
// Strictly adheres to safety guardrails and educational disclaimers.

export class DocMateAIAssistant {
  constructor(servicesData, currentLang = "en") {
    this.servicesData = servicesData;
    this.currentLang = currentLang;
    this.chatHistory = [];
  }

  setLanguage(lang) {
    this.currentLang = lang;
  }

  // Common quick suggestion prompts depending on language
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

  // Process natural language input
  async processQuery(userInput, currentContext = {}) {
    const query = userInput.trim().toLowerCase();
    
    // Simulate natural AI thinking delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const isTamil = this.currentLang === "ta" || this.detectTamil(userInput);
    const disclaimer = isTamil 
      ? "\n\n⚠️ *குறிப்பு: இது கல்வி வழிகாட்டுதல் மட்டுமே. உங்கள் உள்ளூர் வட்டாட்சியர் அல்லது இ-சேவை அலுவலகத்தில் இறுதி தேவைகளை சரிபார்க்கவும்.*"
      : "\n\n⚠️ *Note: This is an educational guide. Please verify the final requirements with your local Taluk / e-Seva office.*";

    // 1. Missing Father's Community Certificate
    if (
      query.includes("father") || query.includes("தந்தை") || query.includes("appa") ||
      (query.includes("community") && (query.includes("without") || query.includes("miss") || query.includes("illai")))
    ) {
      if (isTamil) {
        return {
          text: `உங்கள் தந்தையின் சாதிச் சான்றிதழ் இல்லையென்றாலும் சாதிச் சான்றிதழ் பெற அரசு விதிகளில் வழிமுறைகள் உள்ளன:

1. **மாற்று குடும்ப ஆவணங்கள்:** உங்கள் தாயார், உடன்பிறந்த அண்ணன்/தம்பி/அக்கா/தங்கை அல்லது தந்தையின் நேரடி சகோதரரின் (சித்தப்பா/பெரியப்பா) சாதிச் சான்றிதழை சமர்ப்பிக்கலாம்.
2. **பள்ளி மாற்றுச் சான்றிதழ் (TC):** உங்கள் பள்ளி மாற்றுச் சான்றிதழில் சாதி மற்றும் சமூகம் தெளிவாகக் குறிப்பிடப்பட்டிருக்க வேண்டும்.
3. **நோட்டரி பிரமாணப் பத்திரம்:** தந்தையின் சான்றிதழ் கிடைக்காததற்கான காரணத்தைக் குறிப்பிட்டு வழக்கறிஞர்/நோட்டரி மூலம் உறுதிமொழி பத்திரம் பெற வேண்டும்.
4. **கிராம நிர்வாக அலுவலர் (VAO) களவிசாரணை:** VAO மற்றும் வருவாய் ஆய்வாளர் உங்கள் பூர்வீகம் குறித்து களவிசாரணை மேற்கொண்டு அறிக்கை அளிப்பார்கள்.${disclaimer}`,
          followUp: "உங்களுக்கு பள்ளி மாற்றுச் சான்றிதழ் (TC) நகல் ஏற்கனவே உள்ளதா?"
        };
      } else {
        return {
          text: `If your father's Community Certificate is not available, here are the accepted official alternative routes:

1. **Immediate Family Proof:** You can attach your mother's, biological siblings', or paternal uncle's (father's brother) community certificate.
2. **School Transfer Certificate (TC):** The applicant's school TC or 10th marksheet must have the caste/community category clearly recorded.
3. **Notarized Lineage Affidavit:** Submit a sworn affidavit explaining the genuine non-availability of the father's document with a family genealogical tree.
4. **VAO Field Verification:** The Village Administrative Officer (VAO) and Revenue Inspector (RI) will conduct a local resident enquiry.${disclaimer}`,
          followUp: "Do you have your school Transfer Certificate (TC) ready?"
        };
      }
    }

    // 2. DigiLocker validity
    if (query.includes("digilocker") || query.includes("டிஜிலாக்கர்") || query.includes("digital copy") || query.includes("soft copy")) {
      if (isTamil) {
        return {
          text: `ஆம், DigiLocker ஆவணங்கள் குறித்து தெரிந்து கொள்ள வேண்டியவை:

• தகவல் தொழில்நுட்பச் சட்டம் (IT Act, Rule 9A) படி, DigiLocker மூலம் சரிபார்க்கப்பட்ட டிஜிட்டல் ஆவணங்கள் அசல் ஆவணங்களுக்கு இணையாக சட்டப்பூர்வமாக அங்கீகரிக்கப்பட்டவை.
• போக்குவரத்து போலீஸ் மற்றும் RTO அலுவலகங்களில் DigiLocker ஓட்டுநர் உரிமம் மற்றும் RC புத்தகம் அதிகாரப்பூர்வமாக ஏற்கப்படுகிறது.
• **இ-சேவை மையங்களுக்கு குறிப்பு:** இ-சேவை மையங்களில் ஆவணங்களை கணினியில் ஸ்கேன் செய்ய வேண்டியிருப்பதால், உங்களுடன் காகித நகல்களையும் (Photocopies) எடுத்துச் செல்வது உங்கள் நேரத்தை மிச்சப்படுத்தும்.${disclaimer}`,
          followUp: "நீங்கள் எந்த சேவைக்காக விண்ணப்பிக்க திட்டமிட்டுள்ளீர்கள்?"
        };
      } else {
        return {
          text: `Yes! Here is how DigiLocker is treated at government offices:

• Under Rule 9A of the IT Rules 2016, digitally verified documents via DigiLocker (Aadhaar, Driving License, Vehicle RC, CBSE marksheet) are legally on par with original physical documents.
• RTO and Traffic authorities officially accept DigiLocker for vehicle documents.
• **Practical Tip for e-Seva:** Because operators scan physical documents into the portal scanner, keeping 2 paper photocopies will prevent delays at the counter.${disclaimer}`,
          followUp: "Which specific service are you preparing documents for?"
        };
      }
    }

    // 3. Birth Certificate
    if (query.includes("birth") || query.includes("பிறப்பு") || query.includes("pirappu") || query.includes("baby")) {
      if (isTamil) {
        return {
          text: `பிறப்புச் சான்றிதழ் பெற பொதுவாகத் தேவைப்படும் முக்கிய ஆவணங்கள்:

1. **மருத்துவமனை பிறப்பு அறிக்கை / படிவம் 1 (Discharge Summary):** குழந்தை பிறந்த மருத்துவமனையால் சீலிடப்பட்டு வழங்கப்பட்ட அசல் அறிக்கை.
2. **பெற்றோரின் ஆதார் அட்டைகள்:** தாய் மற்றும் தந்தை இருவரின் சுய சான்றொப்பமிட்ட நகல்கள்.
3. **முகவரி சான்று / குடும்ப அட்டை:** தற்போதைய வசிப்பிடத்தை உறுதி செய்ய.
4. **திருமணச் சான்றிதழ் (இருப்பின்):** பெற்றோரின் திருமண உறுதிக்கு.

📌 **காலக்கெடு:** குழந்தை பிறந்த 21 நாட்களுக்குள் பதிவு செய்வது இலவசம். 1 வருடத்திற்கு மேல் தாமதமானால் வருவாய் கோட்டாட்சியர் (RDO) அல்லது நீதிமன்ற ஆணை தேவைப்படும்.${disclaimer}`,
          followUp: "குழந்தை பிறந்து 21 நாட்களுக்குள் உள்ளதா அல்லது 1 வருடத்திற்கு மேலாகிவிட்டதா?"
        };
      } else {
        return {
          text: `For a Birth Certificate, you typically need the following verified documents:

1. **Hospital Discharge Report / Form 1:** Issued and stamped by the hospital medical superintendent where the child was born.
2. **Both Parents' Aadhaar Cards:** Self-attested photocopies (bring originals for spot check).
3. **Address Proof / Smart Ration Card:** Proving parents' residence within the local registrar jurisdiction.
4. **Marriage Certificate (Optional but helpful):** Supporting parental relationship proof.

📌 **Timeline Rule:** Registration within 21 days is direct and straightforward. If registration is delayed beyond 1 year, an order from the Revenue Divisional Officer (RDO) or Magistrate is mandated by law.${disclaimer}`,
          followUp: "Was the child born within the last 21 days, or is this a delayed registration?"
        };
      }
    }

    // 4. Income Certificate validity & rules
    if (query.includes("income") || query.includes("வருமானம்") || query.includes("varumanam") || query.includes("validity") || query.includes("செல்லுபடி")) {
      if (isTamil) {
        return {
          text: `வருமானச் சான்றிதழ் பற்றிய முக்கிய தகவல்கள்:

• **செல்லுபடி காலம்:** தமிழகத்தில் வருமானச் சான்றிதழ் பொதுவாக 6 மாதங்கள் அல்லது குறிப்பிட்ட நிதியாண்டுக்கு (April 1 to March 31) மட்டுமே செல்லுபடியாகும்.
• **தேவையான ஆவணங்கள்:**
  1. சம்பள ரசீது (Salary slip) அல்லது நோட்டரி வருமான பிரமாணப் பத்திரம்.
  2. ஸ்மார்ட் குடும்ப அட்டை (ரேஷன் கார்டு).
  3. ஆதார் அட்டை.
  4. சொத்து வரி அல்லது மின்கட்டண ரசீது.
• **அரசு கட்டணம்:** அரசு இ-சேவை மையத்தில் ₹60 மட்டுமே.${disclaimer}`,
          followUp: "விண்ணப்பதாரர் மாத சம்பளம் பெறுபவரா அல்லது சுயதொழில் செய்பவரா?"
        };
      } else {
        return {
          text: `Key requirements & validity for an Income Certificate:

• **Validity Period:** In most states (including Tamil Nadu), an Income Certificate is valid for 6 months or until the end of the ongoing financial year (March 31).
• **Required Checklist:**
  1. Salary Slip / Form 16 (for salaried) OR Notarized Income Affidavit (for self-employed/daily wage).
  2. Smart Family Ration Card (showing all household members).
  3. Applicant's Aadhaar Card.
  4. Recent Electricity Bill or Property Tax Receipt.
• **Official Fee:** Standard e-Seva service charge is ₹60.${disclaimer}`,
          followUp: "Are you applying as a salaried employee or self-employed/agricultural earner?"
        };
      }
    }

    // 5. Fees & Charges
    if (query.includes("fee") || query.includes("charge") || query.includes("cost") || query.includes("கட்டணம்") || query.includes("kattanam") || query.includes("panam")) {
      if (isTamil) {
        return {
          text: `அரசு இ-சேவை மைய கட்டண விவரங்கள்:

• **நிலையான இ-சேவை கட்டணம்:** சாதி, வருமானம், இருப்பிடம், முதல் பட்டதாரி, வாரிசுச் சான்றிதழ் போன்ற பெரும்பாலான வருவாய்த்துறை சான்றிதழ்களுக்கு அரசு நிர்ணயித்த கட்டணம் **₹60 மட்டுமே**.
• **ஸ்மார்ட் ரேஷன் கார்டு:** அட்டை அச்சிடும் கட்டணம் சுமார் ₹20 முதல் ₹30.
• **ஓட்டுநர் உரிமம் (RTO):** LLR கட்டணம் சுமார் ₹200 (வாகன வகையைப் பொறுத்து).

⚠️ **முக்கிய அறிவுரை:** கட்டணம் செலுத்தியவுடன் கணினியில் அச்சிடப்பட்ட ரசீதை (Acknowledgement Slip) பெறவும். கூடுதல் கட்டணம் கோரப்பட்டால் மாவட்ட ஆட்சியர் அலுவலக உதவி மையத்தில் தெரிவிக்கலாம்.${disclaimer}`,
          followUp: "உங்களுக்கு கணினி ரசீது பெறுவதில் ஏதேனும் சந்தேகம் உள்ளதா?"
        };
      } else {
        return {
          text: `Official Government & e-Seva Fee Structure:

• **Standard Revenue Certificates:** For Community, Income, Nativity, First Graduate, and Legal Heir certificates, the official authorized fee at Arasu e-Seva counters is **₹60 only**.
• **Smart Ration Card:** ₹20 - ₹30 for smart card PVC printing.
• **Driving License (RTO):** Approximately ₹200 for LLR test (depending on class of vehicle).

⚠️ **Important Advice:** Always insist on the printed computer acknowledgement receipt with the transaction ID. Never pay extra cash without a printed receipt.${disclaimer}`,
          followUp: "Would you like help calculating the exact readiness of your documents?"
        };
      }
    }

    // 6. Address proof alternatives (No ration card)
    if (query.includes("address proof") || query.includes("no ration") || query.includes("ration card illai") || query.includes("முகவரி சான்று")) {
      if (isTamil) {
        return {
          text: `ஸ்மார்ட் ரேஷன் கார்டு இல்லையெனில் ஏற்றுக்கொள்ளப்படும் மாற்று முகவரி சான்றுகள்:

1. **ஆதார் அட்டை:** தற்போதைய சரியான முகவரியுடன் கூடிய ஆதார் அட்டை.
2. **மின்கட்டண ரசீது (TANGEDCO EB Bill):** உங்கள் பெயர் அல்லது உங்கள் தந்தை/வீட்டு உரிமையாளர் பெயரில் உள்ள சமீபத்திய ரசீது.
3. **வாடகை ஒப்பந்தம் (Rental Agreement):** முத்திரைத்தாளில் பதிவு செய்யப்பட்ட நடப்பு வாடகை ஒப்பந்தம்.
4. **வங்கி கணக்குப் புத்தகம் (Bank Passbook):** புகைப்படம் மற்றும் முகவரியுடன் கூடிய தேசியமயமாக்கப்பட்ட வங்கியின் பாஸ்புக்.
5. **வாக்காளர் அடையாள அட்டை (Voter ID) / பாஸ்போர்ட்.**${disclaimer}`,
          followUp: "இவற்றில் எந்த மாற்று ஆவணம் தற்போது உங்களிடம் உள்ளது?"
        };
      } else {
        return {
          text: `If you do not have a Ration Card, here are recognized alternative proofs of address:

1. **Aadhaar Card:** With your updated current address.
2. **Electricity Bill (EB):** Recent bill receipt (within the last 3 months).
3. **Registered Rental Agreement:** If staying in rented accommodation, along with the landlord's recent EB or property tax receipt.
4. **Nationalized Bank Passbook:** First page stamped by the bank branch showing photograph and current residential address.
5. **Voter ID Card (EPIC) or Indian Passport.**${disclaimer}`,
          followUp: "Which of these alternate address proofs do you currently possess?"
        };
      }
    }

    // 7. General Service search or match
    for (const service of this.servicesData) {
      const matchEn = query.includes(service.id) || query.includes(service.name_en.toLowerCase());
      const matchTa = query.includes(service.name_ta);
      if (matchEn || matchTa) {
        const docsList = service.documents
          .map((d, i) => `${i + 1}. **${isTamil ? d.name_ta : d.name_en}** (${isTamil ? d.format_label_ta : d.format_label_en})`)
          .join("\n");

        if (isTamil) {
          return {
            text: `**${service.name_ta}** பெறுவதற்கான முக்கிய ஆவணங்களின் பட்டியல்:

${docsList}

• **வழங்கும் துறை:** ${service.issuing_authority_ta}
• **தோராயமான காலம்:** ${service.processing_days}
• **அரசு கட்டணம்:** ${service.standard_fee}${disclaimer}`,
            followUp: "இந்த ஆவணங்கள் அனைத்தும் உங்களிடம் உள்ளதா? சரிபார்ப்பு பட்டியலை உருவாக்க 'Find Required Documents' பொத்தானை கிளிக் செய்யலாம்."
          };
        } else {
          return {
            text: `Here are the primary documents required for **${service.name_en}**:

${docsList}

• **Issuing Authority:** ${service.issuing_authority_en}
• **Standard Timeline:** ${service.processing_days}
• **Official Fee:** ${service.standard_fee}${disclaimer}`,
            followUp: "Do you have all these documents ready, or would you like to review alternative proofs?"
          };
        }
      }
    }

    // Default intelligent conversational fallback
    if (isTamil) {
      return {
        text: `உங்கள் கேள்வி எனக்குப் புரிந்தது: "${userInput}".

அரசு சான்றிதழ்கள் அல்லது ஆவணங்கள் பெறுவது குறித்த பொதுவான வழிகாட்டுதல்கள்:
1. எப்போதுமே அசல் ஆவணங்களுடன் குறைந்தது 2 செட் சுய சான்றொப்பமிட்ட நகல்களை (Self-Attested Photocopies) தயாராக வைத்திருங்கள்.
2. 3 மாதங்களுக்குள் எடுக்கப்பட்ட 3 பாஸ்போர்ட் அளவு வண்ணப் புகைப்படங்களை கையில் வைத்திருங்கள்.
3. உங்கள் பகுதியில் உள்ள அங்கீகரிக்கப்பட்ட அரசு இ-சேவை மையத்தை அணுகினால் எளிதில் விண்ணப்பிக்கலாம்.

உங்கள் கேள்விக்கு மேலும் துல்லியமான விளக்கம் பெற, நீங்கள் எந்த சான்றிதழைப் பற்றி கேட்கிறீர்கள் (எ.கா: பிறப்பு, சாதி, வருமானம், இருப்பிடம் அல்லது ஓட்டுநர் உரிமம்) என்பதைக் குறிப்பிடவும்.${disclaimer}`,
        followUp: "நீங்கள் எந்த குறிப்பிட்ட அரசு சேவையை நாட விரும்புகிறீர்கள்?"
      };
    } else {
      return {
        text: `Thank you for your question: "${userInput}".

Here is general practical advice when preparing for government paperwork:
1. Always carry your **Original Documents** along with **2 sets of Self-Attested Photocopies**.
2. Keep **3 recent passport-size photographs** with a plain background.
3. Ensure your name and Date of Birth match across your Aadhaar, school marksheet, and ration card to prevent rejections.
4. For specific document requirements, tell me which certificate you need (e.g. Birth, Community, Income, Residence, Driving License, or Ration Card).${disclaimer}`,
        followUp: "Which specific service or document would you like me to inspect for you?"
      };
    }
  }

  detectTamil(text) {
    // Unicode range for Tamil: \u0B80 - \u0BFF
    return /[\u0B80-\u0BFF]/.test(text);
  }
}
