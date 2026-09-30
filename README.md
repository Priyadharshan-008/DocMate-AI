# DocMate AI – Backend & AI Assistant

An intelligent citizen document preparation system and conversational AI assistant for Indian government and e-Seva services (focusing on Tamil Nadu Arasu e-Seva, Municipalities, and Revenue departments).

---

## 🚀 Quick Start (All-in-One Application)

You can launch the entire application (Backend API + Interactive Web App) with a single command:

```bash
python run.py
```

- **Web Application URL**: [http://127.0.0.1:8080](http://127.0.0.1:8080)
- **Interactive API Documentation (Swagger)**: [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs)
- **Alternative Redoc API Documentation**: [http://127.0.0.1:8080/redoc](http://127.0.0.1:8080/redoc)

---

## 📦 Architecture & Directory Structure

```
d:\docmate ai\
├── backend/
│   ├── __init__.py
│   ├── main.py               # FastAPI application, CORS, routers & static file mounting
│   ├── ai_assistant.py       # Conversational AI Assistant (LLM + Offline Expert System)
│   ├── checklist_engine.py   # Dynamic citizen document checklist generator
│   └── services_data.py      # Government service dataset & lookup utilities
├── js/
│   ├── app.js                # Frontend controller with automatic backend detection
│   ├── ai-assistant.js       # Client-side AI module
│   ├── data.js               # Service dataset
│   └── i18n.js               # Bilingual translations (English & Tamil)
├── index.html                # Main application UI
├── styles.css                # Civic-tech styling system & AI assistant UI
├── run.py                    # Root server launcher
├── requirements.txt          # Python dependencies
└── .env.example              # Environment variables template
```

---

## 🤖 AI Assistant Capabilities

The DocMate AI Assistant supports natural language queries in **English**, **Tamil (தமிழ்)**, and **Tanglish** (Tamil written in Latin script).

### Key Features:
1. **Intelligent Query Resolution**:
   - Resolves missing document dilemmas (e.g. missing father's community certificate, alternatives like sibling's proof, school TC, and notarized affidavits).
   - Validates DigiLocker digital documents under **IT Act Rule 9A** and gives practical e-Seva scanning tips.
   - Explains delayed birth registration rules (>21 days vs >1 year RDO sanction).
   - Clarifies income certificate validity periods (6 months / financial year) and proof for daily-wage or self-employed workers.
   - Transparent government fee structures (e.g. ₹60 standard fee at Arasu e-Seva) and warning against unreceipted extra charges.
   - Alternative address proofs when smart ration card is not available.
   - First Graduate certificate criteria, sibling rules, and tuition fee concessions.
   - Legal Heir certificate processes and deceased identification paperwork.
2. **Interactive Action Buttons in Chat**:
   - If a citizen asks about a certificate, the assistant provides one-click action buttons (e.g. `📋 Open Community Certificate Checklist`) that jump directly to the tailored checklist view.
3. **Interactive Follow-Up Suggestions**:
   - Relevant next-step questions appear as clickable chips beneath assistant responses.
4. **Hybrid Engine Architecture**:
   - **External LLM Mode**: Automatically connects to Google Gemini (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`) when an API key is specified in `.env`.
   - **High-Precision Offline Expert Mode**: Operates out-of-the-box with zero API keys required, zero latency, and 100% privacy.
5. **Resilient Auto-Discovery**:
   - Frontend automatically detects if the backend is running across candidate ports (8080, 8000, 5000) and displays a live connection badge (`🟢 AI Backend Active`). If the backend is offline, it seamlessly falls back to the browser's local engine without interruption.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check, version info, and active AI engine status |
| `GET` | `/api/services` | List all government services or search with `?q=...` |
| `GET` | `/api/services/{id}` | Detailed document requirements and rules for a service |
| `GET` | `/api/suggestions` | Get suggested prompt chips for English (`?lang=en`) or Tamil (`?lang=ta`) |
| `POST` | `/api/chat` | Send queries to the Conversational AI Assistant |
| `POST` | `/api/checklist/generate` | Generate customized checklist tailored to citizen's situation |

---

## ⚙️ Configuration (Optional)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Available variables:
- `PORT=8080` (Default server port)
- `GEMINI_API_KEY=your_gemini_key_here` (Optional Google Gemini API key)
- `OPENAI_API_KEY=your_openai_key_here` (Optional OpenAI API key)
