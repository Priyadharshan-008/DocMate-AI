"""
Checklist Engine for DocMate AI.
Computes tailored document requirements, personalized warnings, alternative proofs,
fee calculations, and practical office visit checklists.
"""

from typing import Dict, Any, List, Optional
from .services_data import get_service_by_id

def generate_custom_checklist(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a dynamic, customized document preparation checklist based on citizen context:
    - service_id: str
    - applicant_relation: 'self' | 'minor' | 'parent' | 'deceased' | 'spouse'
    - residence_type: 'own' | 'rent' | 'rural'
    - state: str
    - district: str
    - mode: 'eseva' | 'online' | 'office'
    - urgency: 'normal' | 'urgent'
    - lang: 'en' | 'ta'
    """
    service_id = params.get("service_id", "birth-certificate")
    service = get_service_by_id(service_id)
    if not service:
        return {"error": f"Service '{service_id}' not found."}

    lang = params.get("lang", "en")
    is_tamil = lang == "ta"
    relation = params.get("applicant_relation", "self")
    residence = params.get("residence_type", "own")
    mode = params.get("mode", "eseva")
    urgency = params.get("urgency", "normal")
    district = params.get("district", "Chennai")
    state = params.get("state", "Tamil Nadu")

    items: List[Dict[str, Any]] = []
    special_notes: List[str] = []

    for doc in service.get("documents", []):
        item = {
            "id": doc["id"],
            "name": doc["name_ta"] if is_tamil else doc["name_en"],
            "category": doc["category"],
            "format": doc["format_label_ta"] if is_tamil else doc["format_label_en"],
            "reason": doc["reason_ta"] if is_tamil else doc["reason_en"],
            "note": doc["note_ta"] if is_tamil else doc["note_en"],
            "essential": doc["essential"],
            "status": "need"
        }

        # Contextual adaptations
        # 1. Rented house: clarify rental agreement requirements
        if residence == "rent" and "address" in doc["category"]:
            if is_tamil:
                item["note"] += " (வாடகை வீடு: நடப்பு வாடகை ஒப்பந்தம் + உரிமையாளர் மின்கட்டண ரசீது கட்டாயம்)."
            else:
                item["note"] += " (Rented house: Registered rental agreement + Landlord's latest EB bill required)."

        # 2. Minor applicant
        if relation == "minor" and "identity" in doc["category"]:
            if is_tamil:
                item["note"] += " (மைனர் விண்ணப்பதாரர்: பெற்றோரின் அடையாள ஆவணங்கள் மற்றும் பள்ளி ID தேவை)."
            else:
                item["note"] += " (Minor applicant: Attach parent/guardian Aadhaar and student School ID)."

        # 3. Urgency guidance
        if urgency == "urgent" and doc.get("conditional"):
            item["essential"] = True

        items.append(item)

    # Tailored checklist alerts
    if mode == "eseva":
        if is_tamil:
            special_notes.append("இ-சேவை மையத்திற்கு செல்லும்போது அசல் ஆவணங்களுடன் குறைந்தது 2 செட் நகல்களை கையில் வைத்திருக்கவும்.")
            special_notes.append("கட்டணம் செலுத்தியவுடன் கணினியில் அச்சிடப்பட்ட விண்ணப்ப ரசீதை (CAN/Acknowledgement) கட்டாயம் பெறவும்.")
        else:
            special_notes.append("Always carry originals for physical scanning along with 2 sets of self-attested photocopies.")
            special_notes.append("Demand the computer-generated Acknowledgement receipt with CAN/Application reference number.")
    elif mode == "online":
        if is_tamil:
            special_notes.append("ஆவணங்களை ஸ்கேன் செய்து PDF வடிவில் (200 KB க்குள்) தயாராக வைக்கவும்.")
        else:
            special_notes.append("Ensure documents are clearly scanned in PDF format under 200 KB before starting the portal upload.")

    return {
        "service_id": service["id"],
        "service_name": service["name_ta"] if is_tamil else service["name_en"],
        "authority": service["issuing_authority_ta"] if is_tamil else service["issuing_authority_en"],
        "estimated_fee": service["standard_fee"],
        "processing_days": service["processing_days"],
        "portal_url": service.get("official_portal", "https://tnega.tn.gov.in/"),
        "context": {
            "state": state,
            "district": district,
            "relation": relation,
            "residence": residence,
            "mode": mode,
            "urgency": urgency
        },
        "checklist": items,
        "special_instructions": special_notes,
        "readiness_summary": {
            "total_documents": len(items),
            "mandatory_count": sum(1 for i in items if i["essential"]),
            "optional_count": sum(1 for i in items if not i["essential"])
        }
    }
