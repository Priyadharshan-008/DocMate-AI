"""
DocMate AI Assistant Core Service.
Combines an LLM reasoning engine (Gemini / OpenAI if API key provided) with a high-accuracy,
offline Knowledge & Semantic Reasoning Engine specialized in Indian Government citizen services.
Supports English, Tamil (தமிழ்), and Tanglish.
"""

import os
import re
from typing import Dict, Any, List, Optional
import httpx
from .services_data import SERVICES_DATA, get_service_by_id

DOCMATE_SYSTEM_PROMPT = """
You are DocMate AI, an expert, empathetic, and highly knowledgeable AI Assistant specialized in Indian Citizen Document Preparation, focusing on Arasu e-Seva, Municipalities, Revenue Departments, and State Portals (especially Tamil Nadu and neighboring states).

Your goals:
1. Explain exactly what physical and digital documents are required for government services (Birth, Community, Income, Residence/Nativity, First Graduate, Legal Heir, Driving License, Smart Ration Card, Death Certificate).
2. Clarify document formats: Original, Self-Attested Photocopy, Notarized Affidavit, Form 1, etc.
3. Solve common pain points (e.g. missing father's community certificate, no ration card for address proof, delayed birth registration after 1 year, daily-wage income declaration, DigiLocker validity under IT Act Rule 9A).
4. Emphasize citizen safety: State official government fees (e.g. ₹60 standard fee for Revenue certificates at e-Seva) and advise insisting on the printed CAN acknowledgement receipt.
5. Language: If the user asks in Tamil or Tanglish, respond in clear Tamil (தமிழ்) with key English terms in parentheses for clarity. If in English, respond in English.
6. Format your output with clear markdown: numbered steps, bullet points, and highlight important notices.
7. Always append an educational disclaimer indicating they should verify requirements at their local Taluk / e-Seva office.
"""

class DocMateAIAssistant:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")

    def detect_tamil(self, text: str) -> bool:
        """Detect if input text contains Tamil Unicode characters."""
        return bool(re.search(r'[\u0B80-\u0BFF]', text))

    def detect_tanglish(self, text: str) -> bool:
        """Detect common Tanglish terms."""
        t_words = ["enna", "panradhu", "illai", "appa", "amma", "thevai", "varum", "kedaikkuma", "irukka", "eppadi", "kattanam", "thara", "venduma"]
        words = text.lower().split()
        return any(w in words for w in t_words)

    async def query(self, user_message: str, history: Optional[List[Dict[str, str]]] = None, lang: str = "en", user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Main query entrypoint.
        First tries external LLM if key is present; otherwise falls back gracefully
        to the comprehensive Offline Expert System.
        """
        message = (user_message or "").strip()
        if not message:
            return {
                "text": "Please enter a question or choose one of the suggested prompts.",
                "followUp": "Which government service would you like to prepare documents for?",
                "source": "empty_query"
            }

        # Check for Gemini API key
        if self.gemini_api_key:
            try:
                gemini_resp = await self._call_gemini(message, history, lang)
                if gemini_resp:
                    return gemini_resp
            except Exception as e:
                # Log and fallback gracefully
                print(f"[DocMate AI] Gemini API call failed: {e}. Falling back to internal engine.")

        # Check for OpenAI API key
        if self.openai_api_key:
            try:
                openai_resp = await self._call_openai(message, history, lang)
                if openai_resp:
                    return openai_resp
            except Exception as e:
                print(f"[DocMate AI] OpenAI API call failed: {e}. Falling back to internal engine.")

        # Run high-accuracy Offline Expert System
        return self._run_offline_expert_system(message, lang, user_context)

    async def _call_gemini(self, message: str, history: Optional[List[Dict[str, str]]], lang: str) -> Optional[Dict[str, Any]]:
        """Call Google Gemini API using httpx."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        
        contents = [
            {"role": "user", "parts": [{"text": DOCMATE_SYSTEM_PROMPT}]}
        ]
        
        if history:
            for item in history[-4:]:
                role = "user" if item.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": item.get("content", "")}]})
                
        contents.append({"role": "user", "parts": [{"text": message}]})

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json={"contents": contents})
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                # Detect related service
                related_service = self._detect_service_match(message)
                actions = []
                if related_service:
                    actions.append({
                        "label": f"📋 Open {related_service['name_en']} Checklist",
                        "action": "open_service",
                        "serviceId": related_service["id"]
                    })
                return {
                    "text": text,
                    "followUp": "Would you like me to inspect your readiness for any specific document?",
                    "actionChips": actions,
                    "relatedService": related_service["id"] if related_service else None,
                    "source": "gemini-llm"
                }
        return None

    async def _call_openai(self, message: str, history: Optional[List[Dict[str, str]]], lang: str) -> Optional[Dict[str, Any]]:
        """Call OpenAI Chat Completions API."""
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json"
        }
        messages = [{"role": "system", "content": DOCMATE_SYSTEM_PROMPT}]
        if history:
            for item in history[-4:]:
                messages.append({"role": item.get("role", "user"), "content": item.get("content", "")})
        messages.append({"role": "user", "content": message})

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=headers, json={
                "model": "gpt-4o-mini",
                "messages": messages,
                "temperature": 0.3
            })
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                related_service = self._detect_service_match(message)
                actions = []
                if related_service:
                    actions.append({
                        "label": f"📋 Open {related_service['name_en']} Checklist",
                        "action": "open_service",
                        "serviceId": related_service["id"]
                    })
                return {
                    "text": text,
                    "followUp": "Do you need help with alternative documents or fees?",
                    "actionChips": actions,
                    "relatedService": related_service["id"] if related_service else None,
                    "source": "openai-llm"
                }
        return None

    def _detect_service_match(self, query: str) -> Optional[Dict[str, Any]]:
        """Identify if query references one of our 9 standard services."""
        q = query.lower()
        for s in SERVICES_DATA:
            if s["id"] in q or s["name_en"].lower() in q or s["name_ta"] in q:
                return s
        # Keyword mappings
        if any(w in q for w in ["birth", "baby", "pirappu", "பிறப்பு"]):
            return get_service_by_id("birth-certificate")
        if any(w in q for w in ["caste", "community", "jaathi", "சாதி", "obc", "sc", "st", "bc", "mbc"]):
            return get_service_by_id("community-certificate")
        if any(w in q for w in ["income", "salary", "varumanam", "வருமானம்", "poverty"]):
            return get_service_by_id("income-certificate")
        if any(w in q for w in ["residence", "nativity", "domicile", "இருப்பிடம்", "பிறப்பிடம்"]):
            return get_service_by_id("residence-certificate")
        if any(w in q for w in ["first graduate", "graduate", "muthal pattadhari", "பட்டதாரி", "college fee"]):
            return get_service_by_id("first-graduate-certificate")
        if any(w in q for w in ["legal heir", "varisu", "வாரிசு", "successor", "heir"]):
            return get_service_by_id("legal-heir-certificate")
        if any(w in q for w in ["license", "licence", "driving", "llr", "வாகனம்", "ஓட்டுநர்"]):
            return get_service_by_id("driving-license")
        if any(w in q for w in ["ration", "family card", "smart card", "ரேஷன்", "tnpds"]):
            return get_service_by_id("smart-ration-card")
        if any(w in q for w in ["death", "irappu", "இறப்பு", "demise"]):
            return get_service_by_id("death-certificate")
        return None

    def _run_offline_expert_system(self, message: str, lang: str, user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Advanced, deterministic AI expert system containing deep knowledge
        of government procedures, edge cases, alternatives, fees, and timelines.
        """
        q = message.lower().strip()
        is_tamil = lang == "ta" or self.detect_tamil(message) or self.detect_tanglish(message)
        disclaimer = (
            "\n\n⚠️ *குறிப்பு: இது கல்வி வழிகாட்டுதல் மட்டுமே. உங்கள் உள்ளூர் வட்டாட்சியர் அல்லது இ-சேவை அலுவலகத்தில் இறுதி தேவைகளை சரிபார்க்கவும்.*"
            if is_tamil
            else "\n\n⚠️ *Note: This is an educational guide. Please verify final requirements with your local Taluk / e-Seva office.*"
        )

        actions = []

        # 1. Missing Father's Community Certificate
        if (
            "father" in q or "தந்தை" in q or "appa" in q or
            ("community" in q and any(w in q for w in ["without", "miss", "illai", "not have", "death", "separated"]))
        ):
            service = get_service_by_id("community-certificate")
            if service:
                actions.append({"label": "📋 View Community Certificate Checklist", "action": "open_service", "serviceId": service["id"]})

            if is_tamil:
                return {
                    "text": f"""உங்கள் தந்தையின் சாதிச் சான்றிதழ் இல்லையென்றாலும் சாதிச் சான்றிதழ் பெற அரசு விதிகளின்படி சட்டப்பூர்வ வழிகள் உள்ளன:

1. **மாற்று குடும்ப ஆவணங்கள் (Alternative Lineage):**
   • உங்கள் தாயாரின் சாதிச் சான்றிதழ்
   • உடன் பிறந்த அண்ணன், தம்பி, அக்கா, தங்கை ஆகியோரின் சான்றிதழ்
   • தந்தையின் நேரடி சகோதரரின் (சித்தப்பா / பெரியப்பா) சாதிச் சான்றிதழ்

2. **பள்ளி மாற்றுச் சான்றிதழ் (School TC):**
   • விண்ணப்பதாரரின் பள்ளி மாற்றுச் சான்றிதழில் (TC) அல்லது 10-ஆம் வகுப்பு மதிப்பெண் பட்டியலில் சாதி மற்றும் சமூகம் தெளிவாகக் குறிப்பிடப்பட்டிருக்க வேண்டும்.

3. **நோட்டரி பிரமாணப் பத்திரம் (Notarized Affidavit):**
   • தந்தையின் சான்றிதழ் கிடைக்காததற்கான காரணத்தை (தந்தை இறப்பு, குடும்ப பிரிவினை அல்லது சான்றிதழ் பெறாத நிலை) குறிப்பிட்டு வழக்கறிஞர்/நோட்டரி மூலம் உறுதிமொழி பத்திரம் சமர்ப்பிக்க வேண்டும்.

4. **கிராம நிர்வாக அலுவலர் (VAO) களவிசாரணை:**
   • VAO மற்றும் வருவாய் ஆய்வாளர் (RI) உங்கள் பூர்வீகம் குறித்து உள்ளூர் விசாரணை நடத்தி அறிக்கை அளிப்பார்கள்.{disclaimer}""",
                    "followUp": "உங்களுக்கு பள்ளி மாற்றுச் சான்றிதழ் (TC) நகல் ஏற்கனவே உள்ளதா?",
                    "actionChips": actions,
                    "relatedService": "community-certificate",
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""If your father's Community Certificate is not available, here are the official government accepted alternative routes:

1. **Immediate Family Proof (Alternative Lineage):**
   • Mother's official Community Certificate.
   • Biological siblings' (brother/sister) Community Certificate.
   • Paternal uncle's (father's brother) Community Certificate accompanied by a family tree.

2. **School Transfer Certificate (TC):**
   • The applicant's school TC or 10th marksheet must have the caste/community category clearly recorded by the school headmaster.

3. **Notarized Lineage Affidavit:**
   • Submit a sworn legal affidavit on stamp paper explaining the genuine reason why the father's certificate is unavailable (e.g. demise, separated, or never availed).

4. **VAO & Revenue Inspector Field Verification:**
   • The Village Administrative Officer (VAO) conducts a local inquiry to confirm your origin and forwards recommendations to the Tahsildar.{disclaimer}""",
                    "followUp": "Do you have your school Transfer Certificate (TC) ready?",
                    "actionChips": actions,
                    "relatedService": "community-certificate",
                    "source": "docmate-expert-system"
                }

        # 2. DigiLocker Legitimacy & Physical Copies
        if "digilocker" in q or "டிஜிலாக்கர்" in q or "digital copy" in q or "soft copy" in q:
            if is_tamil:
                return {
                    "text": f"""ஆம், DigiLocker ஆவணங்கள் குறித்து அரசு விதிமுறைகள்:

• **சட்ட அங்கீகாரம்:** தகவல் தொழில்நுட்ப சட்டம் (IT Act 2016, Rule 9A) படி, DigiLocker மூலம் வழங்கப்பட்ட டிஜிட்டல் ஆவணங்கள் அசல் ஆவணங்களுக்கு இணையாக சட்டப்பூர்வமாக அங்கீகரிக்கப்பட்டவை.
• **RTO & காவல் துறை:** போக்குவரத்து காவல்துறை மற்றும் வட்டாரப் போக்குவரத்து அலுவலகங்கள் (RTO) DigiLocker ஓட்டுநர் உரிமம் மற்றும் RC புத்தகத்தை கட்டாயம் ஏற்க வேண்டும்.
• **இ-சேவை மையங்களுக்கு நடைமுறை குறிப்பு:** இ-சேவை மையங்களில் ஆவணங்கள் கணினி ஸ்கேனரில் ஸ்கேன் செய்யப்படுவதால், விரைவாக விண்ணப்பிக்க குறைந்தது 2 காகித நகல்களை (Photocopies) எடுத்துச் செல்வது அலைச்சலைத் தவிர்க்கும்.{disclaimer}""",
                    "followUp": "நீங்கள் எந்த குறிப்பிட்ட சேவைக்காக ஆவணங்களை தயார் செய்கிறீர்கள்?",
                    "actionChips": actions,
                    "relatedService": None,
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""Yes! Here is the legal status and practical guidance on DigiLocker:

• **Legal Standing:** Under Rule 9A of the Information Technology Rules 2016, documents issued in DigiLocker (Aadhaar, Driving License, Vehicle RC, Marksheets) are legally treated on par with physical original documents.
• **RTO & Traffic Police:** Traffic police and RTO offices are legally mandated to accept DigiLocker vehicle documents.
• **Practical Tip for e-Seva Centers:** Because e-Seva operators need to scan physical paper pages into the high-speed government scanner, always carry 2 self-attested photocopies to avoid counter queues.{disclaimer}""",
                    "followUp": "Which specific certificate or license are you preparing for?",
                    "actionChips": actions,
                    "relatedService": None,
                    "source": "docmate-expert-system"
                }

        # 3. Birth Certificate rules (>21 days or >1 year delay)
        if any(w in q for w in ["birth", "பிறப்பு", "pirappu", "baby", "infant"]):
            service = get_service_by_id("birth-certificate")
            if service:
                actions.append({"label": "📋 View Birth Certificate Checklist", "action": "open_service", "serviceId": service["id"]})

            if "delay" in q or "late" in q or "1 year" in q or "வருடம்" in q or "தாமதம்" in q:
                if is_tamil:
                    return {
                        "text": f"""1 வருடத்திற்கு மேல் தாமதமான பிறப்பு பதிவு செய்யும் வழிமுறைகள் (Section 13(3) of RBD Act):

1. **தடையில்லாச் சான்று (Non-Availability Certificate):** சம்பந்தப்பட்ட மாநகராட்சி/நகராட்சி பதிவாளரிடம் குழந்தை பிறப்பு இதுவரை பதிவு செய்யப்படவில்லை என்பதற்கான சான்றிதழ் பெற வேண்டும்.
2. **வருவாய் கோட்டாட்சியர் (RDO) அல்லது மாஜிஸ்திரேட் உத்தரவு:** 1 வருடத்திற்கு மேற்பட்ட பதிவுகளுக்கு RDO விசாரணை நடத்தி ஆணை பிறப்பிக்க வேண்டும்.
3. **தேவைப்படும் ஆவணங்கள்:**
   • மருத்துவமனை அசல் பிறப்பு அறிக்கை அல்லது கிராம நிர்வாக அலுவலர் (VAO) அறிக்கை.
   • பெற்றோரின் ஆதார் அட்டைகள் & குடும்ப அட்டை.
   • தாமதத்திற்கான காரணத்தை விளக்கும் நோட்டரி உறுதிமொழி பத்திரம்.{disclaimer}""",
                        "followUp": "குழந்தை பிறந்த மருத்துவமனையின் டிஸ்சார்ஜ் அறிக்கை உங்களிடம் உள்ளதா?",
                        "actionChips": actions,
                        "relatedService": "birth-certificate",
                        "source": "docmate-expert-system"
                    }
                else:
                    return {
                        "text": f"""Procedure for Delayed Birth Registration (Delayed beyond 1 year under Section 13(3) of RBD Act):

1. **Non-Availability Certificate (NAC):** First apply at your local municipal/taluk registrar office to get official confirmation that the birth is not already recorded.
2. **Order from Revenue Divisional Officer (RDO) / Magistrate:** Delayed registrations beyond 1 year legally require an official executive sanction order.
3. **Required Checklist:**
   • Hospital Discharge Summary / Medical Stamped Form 1.
   • Parents' Aadhaar Cards & Smart Ration Card.
   • Notarized Affidavit explaining the genuine reason for delay.
   • School admission record or Bonafide certificate if the child is schooling.{disclaimer}""",
                        "followUp": "Was the child born in a hospital, and do you have the discharge summary?",
                        "actionChips": actions,
                        "relatedService": "birth-certificate",
                        "source": "docmate-expert-system"
                    }

            if is_tamil:
                return {
                    "text": f"""பிறப்புச் சான்றிதழ் பெற தேவையான முக்கிய ஆவணங்கள்:

1. **மருத்துவமனை பிறப்பு அறிக்கை (Discharge Summary / Form 1):** குழந்தை பிறந்த மருத்துவமனையால் முத்திரையிடப்பட்ட அசல் அறிக்கை.
2. **பெற்றோரின் ஆதார் அட்டைகள்:** தாய் மற்றும் தந்தை இருவரின் சுய சான்றொப்பமிட்ட நகல்கள் (சரிபார்க்க அசல் தேவை).
3. **பெற்றோரின் முகவரி சான்று:** ஸ்மார்ட் குடும்ப அட்டை அல்லது மின்கட்டண ரசீது.
4. **திருமணச் சான்றிதழ் (இருப்பின்):** பெற்றோரின் திருமண உறவு உறுதிக்கு.

📌 **காலக்கெடு:** குழந்தை பிறந்த 21 நாட்களுக்குள் பதிவு செய்வது நேரடியானது மற்றும் இலவசமானது.{disclaimer}""",
                    "followUp": "குழந்தை பிறந்து 21 நாட்களுக்குள் உள்ளதா அல்லது 1 வருடத்திற்கு மேலாகிவிட்டதா?",
                    "actionChips": actions,
                    "relatedService": "birth-certificate",
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""Primary verified documents required for a Birth Certificate:

1. **Hospital Discharge Summary / Form 1:** Stamped and signed by the hospital medical superintendent.
2. **Both Parents' Aadhaar Cards:** Self-attested photocopies (carry originals for spot inspection).
3. **Parents' Residence Proof:** Smart Ration Card, Electricity bill, or Gas connection.
4. **Marriage Certificate (Optional):** Helpful for validating parental relationship.

📌 **Timeline:** Registration within 21 days is direct and free of government fees.{disclaimer}""",
                    "followUp": "Was the child born within the last 21 days, or is this a delayed registration?",
                    "actionChips": actions,
                    "relatedService": "birth-certificate",
                    "source": "docmate-expert-system"
                }

        # 4. Income Certificate validity & Self-employed / daily wage
        if any(w in q for w in ["income", "வருமானம்", "varumanam", "salary"]):
            service = get_service_by_id("income-certificate")
            if service:
                actions.append({"label": "📋 View Income Certificate Checklist", "action": "open_service", "serviceId": service["id"]})

            if is_tamil:
                return {
                    "text": f"""வருமானச் சான்றிதழ் பற்றிய முக்கிய தகவல்கள் மற்றும் விதிகள்:

• **செல்லுபடி காலம் (Validity):** தமிழகத்தில் வருமானச் சான்றிதழ் பொதுவாக 6 மாதங்கள் அல்லது நடப்பு நிதியாண்டுக்கு (ஏப்ரல் 1 முதல் மார்ச் 31 வரை) மட்டுமே செல்லும். கல்வி உதவித்தொகைக்கு ஆண்டுதோறும் புதுப்பிக்க வேண்டும்.
• **மாத சம்பளம் பெறுவோர்:** நிறுவன சம்பள ரசீது (Salary Slip) அல்லது Form 16.
• **சுயதொழில் / தினக்கூலி / விவசாயம்:** நோட்டரி பொது வழக்கறிஞரிடம் பெறப்பட்ட வருமான உறுதிமொழி பத்திரம் (Notarized Affidavit) அல்லது VAO சான்று.
• **குடும்ப அட்டை (Ration Card):** வீட்டில் உள்ள மொத்த உறுப்பினர்கள் மற்றும் சம்பாதிப்பவர்களின் எண்ணிக்கையை அறிய கட்டாயம்.
• **அரசு இ-சேவை கட்டணம்:** **₹60 மட்டுமே**.{disclaimer}""",
                    "followUp": "விண்ணப்பதாரர் மாத சம்பளம் பெறுபவரா அல்லது சுயதொழில்/விவசாயம் செய்பவரா?",
                    "actionChips": actions,
                    "relatedService": "income-certificate",
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""Key requirements & validity rules for an Income Certificate:

• **Validity Period:** In Tamil Nadu and most states, an Income Certificate is valid for 6 months or until March 31 of the financial year.
• **For Salaried Employees:** Recent Salary Slips (last 3 months) or Form 16 from employer.
• **For Self-Employed / Agricultural / Daily Wage:** Notarized Income Self-Declaration Affidavit on stamp paper.
• **Smart Family Ration Card:** Mandatory to prove total household dependents and co-earners.
• **Official e-Seva Fee:** **₹60 only**.{disclaimer}""",
                    "followUp": "Are you applying as a salaried employee or self-employed/daily wage earner?",
                    "actionChips": actions,
                    "relatedService": "income-certificate",
                    "source": "docmate-expert-system"
                }

        # 5. Address proof alternatives (No ration card)
        if any(w in q for w in ["address proof", "no ration", "ration card illai", "ration card missing", "முகவரி சான்று"]):
            if is_tamil:
                return {
                    "text": f"""ஸ்மார்ட் ரேஷன் கார்டு இல்லையெனில் ஏற்றுக்கொள்ளப்படும் அதிகாரப்பூர்வ மாற்று முகவரி சான்றுகள்:

1. **ஆதார் அட்டை (Aadhaar Card):** உங்கள் நடப்பு முகவரியுடன் புதுப்பிக்கப்பட்ட ஆதார் அட்டை.
2. **மின்கட்டண ரசீது (TANGEDCO EB Bill):** உங்கள் பெயர் அல்லது உங்கள் தந்தை/உரிமையாளர் பெயரில் உள்ள சமீபத்திய 3 மாத ரசீது.
3. **பதிவு செய்யப்பட்ட வாடகை ஒப்பந்தம் (Rental Agreement):** முத்திரைத்தாளில் எழுதப்பட்டு உரிமையாளரின் EB பில்லுடன் இணைக்கப்பட்டது.
4. **வங்கி கணக்குப் புத்தகம் (Bank Passbook):** புகைப்படம் மற்றும் நடப்பு முகவரியுடன் கூடிய தேசியமயமாக்கப்பட்ட வங்கியின் பாஸ்புக் (வங்கி மேலாளர் முத்திரையுடன்).
5. **வாக்காளர் அடையாள அட்டை (Voter ID) அல்லது இந்திய பாஸ்போர்ட்.**{disclaimer}""",
                    "followUp": "இவற்றில் எந்த மாற்று ஆவணம் தற்போது உங்களிடம் உள்ளது?",
                    "actionChips": actions,
                    "relatedService": None,
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""If you do not have a Ration Card, here are legally recognized alternative proofs of address:

1. **Aadhaar Card:** With your updated current residential address.
2. **Electricity Bill (EB):** Recent domestic bill receipt (within the last 3 months).
3. **Registered Rental Agreement:** If living in rented premises, along with the landlord's recent EB or property tax receipt.
4. **Nationalized Bank Passbook:** First page stamped with photograph and full residential address.
5. **Voter ID Card (EPIC) or Indian Passport.**{disclaimer}""",
                    "followUp": "Which of these alternate address proofs do you currently possess?",
                    "actionChips": actions,
                    "relatedService": None,
                    "source": "docmate-expert-system"
                }

        # 6. Fees and Charges
        if any(w in q for w in ["fee", "charge", "cost", "கட்டணம்", "kattanam", "panam", "bribe"]):
            if is_tamil:
                return {
                    "text": f"""அரசு இ-சேவை மைய கட்டண விபரங்கள் மற்றும் பாதுகாப்பு வழிமுறைகள்:

• **வருவாய்த்துறை சான்றிதழ்கள்:** சாதி, வருமானம், இருப்பிடம், முதல் பட்டதாரி, வாரிசுச் சான்றிதழ்களுக்கு அரசு நிர்ணயித்த கட்டணம் **₹60 மட்டுமே**.
• **ஸ்மார்ட் ரேஷன் கார்டு அச்சிடுதல்:** ₹20 முதல் ₹30 வரை மட்டுமே.
• **ஓட்டுநர் உரிமம் (RTO):** LLR தேர்வு கட்டணம் ₹200 (சாரதி இணையதள கட்டணம்).

⚠️ **முக்கிய அறிவுரை:**
1. எப்போதுமே பணப்பரிவர்த்தனைக்கு கணினியில் அச்சிடப்பட்ட அதிகாரப்பூர்வ ரசீதை (Acknowledgement Slip with CAN Number) கட்டாயம் கேட்டுப் பெறவும்.
2. ரசீது இல்லாமல் கூடுதல் கட்டணம் கோரப்பட்டால் மாவட்ட ஆட்சியர் அலுவலக உதவி மையத்தில் (Toll-Free 1100) புகார் தெரிவிக்கலாம்.{disclaimer}""",
                    "followUp": "உங்களுக்கு இ-சேவை ரசீது அல்லது CAN எண் பெறுவதில் சந்தேகம் உள்ளதா?",
                    "actionChips": actions,
                    "relatedService": None,
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""Official Government Fee Structure & Consumer Rights:

• **Standard Revenue Certificates:** For Community, Income, Nativity, First Graduate, and Legal Heir certificates, the official authorized fee at Arasu e-Seva counters is **₹60 only**.
• **Smart Ration Card:** ₹20 - ₹30 for PVC card printing.
• **Driving License (RTO):** Approximately ₹200 for LLR test online via Parivahan.

⚠️ **Citizen Protection Advice:**
1. Always demand the computer-printed payment receipt containing your application CAN number.
2. If operators demand unreceipted cash, you can report directly to the District Collectorate Grievance Cell or call the CM Helpline 1100.{disclaimer}""",
                    "followUp": "Would you like help calculating readiness for your specific certificate?",
                    "actionChips": actions,
                    "relatedService": None,
                    "source": "docmate-expert-system"
                }

        # 7. First Graduate Certificate
        if any(w in q for w in ["first graduate", "graduate", "muthal pattadhari", "பட்டதாரி"]):
            service = get_service_by_id("first-graduate-certificate")
            if service:
                actions.append({"label": "📋 View First Graduate Checklist", "action": "open_service", "serviceId": service["id"]})

            if is_tamil:
                return {
                    "text": f"""முதல் பட்டதாரி சான்றிதழ் (First Graduate) பெறுவதற்கான முக்கிய விதிகள்:

• **தகுதி:** குடும்பத்தில் (பெற்றோர், தாத்தா-பாட்டி, உடன்பிறந்த மூத்த சகோதரர்/சகோதரி) எவரும் பட்டப்படிப்பு முடித்திருக்கக் கூடாது.
• **சலுகை:** அரசு அல்லது அரசு உதவிபெறும் கல்லூரிகளில் பட்டப்படிப்பு கல்விக் கட்டணத்தில் ₹20,000 வரை சலுகை கிடைக்கும்.
• **முக்கிய ஆவணங்கள்:**
  1. பெற்றோரின் பள்ளி மாற்றுச் சான்றிதழ் (TC) அல்லது படிப்பறிவற்றவர் உறுதிமொழி பத்திரம்.
  2. உடன் பிறந்த சகோதரர்/சகோதரிகளின் TC அல்லது படிப்பு சான்றிதழ்.
  3. மாணவர் மற்றும் பெற்றோர் கையொப்பமிட்ட கூட்டு உறுதிமொழி படிவம் (Joint Declaration Form).
  4. குடும்ப அட்டை மற்றும் மாணவரின் 10, 12-ஆம் வகுப்பு மதிப்பெண் பட்டியல்.{disclaimer}""",
                    "followUp": "உங்கள் உடன்பிறந்த மூத்த சகோதரர்கள் தற்போது கல்லூரியில் படிக்கிறார்களா?",
                    "actionChips": actions,
                    "relatedService": "first-graduate-certificate",
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""Rules & Eligibility for First Graduate Certificate:

• **Eligibility:** No one in the applicant's immediate family (parents, grandparents, or elder siblings) should have completed a graduate degree.
• **Benefit:** Tuition fee waiver (up to ₹20,000 per academic year in professional and degree courses).
• **Key Checklist:**
  1. Parents' Transfer Certificates (TC) or notarized non-literate declaration if they did not attend school.
  2. Elder siblings' Transfer Certificates / Bonafide certificates.
  3. Joint Declaration Form signed by applicant and parent.
  4. Smart Family Ration Card and 10th/12th marksheets.{disclaimer}""",
                    "followUp": "Do you have any elder siblings currently pursuing higher education?",
                    "actionChips": actions,
                    "relatedService": "first-graduate-certificate",
                    "source": "docmate-expert-system"
                }

        # 8. Check against standard services
        matched = self._detect_service_match(q)
        if matched:
            actions.append({"label": f"📋 Open {matched['name_en']} Checklist", "action": "open_service", "serviceId": matched["id"]})
            docs_en = "\n".join([f"{i+1}. **{d['name_en']}** ({d['format_label_en']})" for i, d in enumerate(matched["documents"])])
            docs_ta = "\n".join([f"{i+1}. **{d['name_ta']}** ({d['format_label_ta']})" for i, d in enumerate(matched["documents"])])

            if is_tamil:
                return {
                    "text": f"""**{matched['name_ta']}** பெறுவதற்கான அதிகாரப்பூர்வ ஆவணங்களின் பட்டியல்:

{docs_ta}

• **வழங்கும் துறை:** {matched['issuing_authority_ta']}
• **தோராயமான காலம்:** {matched['processing_days']}
• **அரசு கட்டணம்:** {matched['standard_fee']}{disclaimer}""",
                    "followUp": f"இந்த ஆவணங்களை சரிபார்க்க '{matched['name_ta']} பட்டியல்' பொத்தானை கிளிக் செய்யலாம்.",
                    "actionChips": actions,
                    "relatedService": matched["id"],
                    "source": "docmate-expert-system"
                }
            else:
                return {
                    "text": f"""Primary required documents for **{matched['name_en']}**:

{docs_en}

• **Issuing Authority:** {matched['issuing_authority_en']}
• **Timeline:** {matched['processing_days']}
• **Official Fee:** {matched['standard_fee']}{disclaimer}""",
                    "followUp": f"Would you like to open the complete interactive checklist for {matched['name_en']}?",
                    "actionChips": actions,
                    "relatedService": matched["id"],
                    "source": "docmate-expert-system"
                }

        # Default intelligent response
        if is_tamil:
            return {
                "text": f"""உங்கள் கேள்வி எனக்குப் புரிந்தது: "{message}".

அரசு சான்றிதழ்கள் மற்றும் ஆவணங்களுக்கு விண்ணப்பிக்கும் போது நினைவில் கொள்ள வேண்டியவை:
1. எப்போதுமே **அசல் ஆவணங்களுடன் குறைந்தது 2 செட் சுய சான்றொப்பமிட்ட நகல்களை (Self-Attested Photocopies)** உடன் எடுத்துச் செல்லுங்கள்.
2. 3 மாதங்களுக்குள் எடுக்கப்பட்ட **3 பாஸ்போர்ட் அளவு வண்ணப் புகைப்படங்கள்** கைவசம் இருக்கட்டும்.
3. உங்கள் ஆதார், பள்ளி சான்றிதழ் மற்றும் ரேஷன் கார்டில் உங்கள் பெயர் மற்றும் பிறந்த தேதி ஒரே மாதிரியாக இருப்பதை உறுதி செய்யுங்கள்.
4. மேலும் துல்லியமான தகவலுக்கு, நீங்கள் எந்த சான்றிதழைப் பற்றி கேட்கிறீர்கள் (எ.கா: பிறப்பு, சாதி, வருமானம், இருப்பிடம், ஓட்டுநர் உரிமம், ரேஷன் கார்டு) என்பதைக் குறிப்பிடவும்.{disclaimer}""",
                "followUp": "நீங்கள் எந்த குறிப்பிட்ட அரசு சேவையை நாட விரும்புகிறீர்கள்?",
                "actionChips": [
                    {"label": "📋 பிறப்புச் சான்றிதழ்", "action": "open_service", "serviceId": "birth-certificate"},
                    {"label": "📋 சாதிச் சான்றிதழ்", "action": "open_service", "serviceId": "community-certificate"},
                    {"label": "📋 வருமானச் சான்றிதழ்", "action": "open_service", "serviceId": "income-certificate"}
                ],
                "relatedService": None,
                "source": "docmate-expert-system"
            }
        else:
            return {
                "text": f"""Thank you for your question: "{message}".

Here is essential practical guidance before visiting any government or e-Seva office:
1. Always carry your **Original Documents** along with **2 sets of Self-Attested Photocopies**.
2. Keep **3 recent color passport photographs** (plain background, taken within 3 months).
3. Verify that your name spelling and Date of Birth match across your Aadhaar, school TC, and smart ration card.
4. For service-specific document guidelines, tell me which certificate you need (e.g. Birth, Community, Income, Residence, Driving License, First Graduate, or Legal Heir).{disclaimer}""",
                "followUp": "Which specific government service would you like me to inspect for you?",
                "actionChips": [
                    {"label": "📋 Birth Certificate", "action": "open_service", "serviceId": "birth-certificate"},
                    {"label": "📋 Community Certificate", "action": "open_service", "serviceId": "community-certificate"},
                    {"label": "📋 Income Certificate", "action": "open_service", "serviceId": "income-certificate"}
                ],
                "relatedService": None,
                "source": "docmate-expert-system"
            }
