# AI Field Writer Service ✍️

[Part of Resume Flow Ecosystem](..)

The **AI Field Writer Service** is the intelligence engine of Resume Flow, responsible for generating and optimizing resume content. It provides high-quality rewriting and generation capabilities to ensure every field in a user's resume is professional and impactful.

---

## 🚀 Service Role

This service specializes in:
- **AI Field Rewriting**: Transforming rough bullet points or descriptions into polished, professional content using industry-standard action verbs and metrics.
- **Intelligent Generation**: Creating initial drafts for summaries and descriptions based on minimal user input or specific instructions.
- **Tone & Format Control**: Ensuring consistency across the resume by adhering to specific tones (Professional, Confident, etc.) and formats (Bullets, Paragraph).

---

## 🧠 Model Details

We utilize **Qwen2.5-7B-Instruct** via the **HuggingFace Inference API**. 
- **Why Qwen2.5?**: It demonstrated superior instruction-following capabilities in our benchmarks, particularly for constrained formatting tasks like generating bulleted lists and maintaining specific professional tones.
- **Latency**: Optimized for real-time interaction, providing responses in sub-second intervals for most rewrite tasks.

---

## 🛠️ Tech Stack

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) **Node.js 18+**
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) **Express 5**
- ![HuggingFace](https://img.shields.io/badge/%F0%9F%A4%97%20HuggingFace-FFD21E?style=flat&logo=huggingface&logoColor=black) **HuggingFace Inference API**

---

## 📖 API Reference

### Base URL
- **Local**: `http://localhost:5000/api/v1`
- **Production**: `https://resume-flow-backend-9b1g.onrender.com/api/v1`

---

### Health Check
`GET /`

Returns server status and available endpoints.

---

### AI Field Writer
`POST /api/v1/ai/field`

Generate or rewrite resume content for a specific field.

**Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action` | `'REWRITE'` \| `'GENERATE'` | ✅ | Operation type |
| `fieldName` | `string` | ✅ | Field name (e.g., 'summary', 'description') |
| `originalText` | `string` | ✅ for REWRITE | Text to rewrite |
| `instruction` | `string` | ❌ | Custom instructions |
| `tone` | `'professional'` \| `'casual'` \| `'confident'` \| `'friendly'` | ❌ | Writing tone |
| `format` | `'bullets'` \| `'paragraph'` | ❌ | Output format |

**Response (Success)**:
```json
{
  "id": "resp_abc12345",
  "newText": "• Led development of 5 production applications...",
  "meta": {
    "processingTimeMs": 850,
    "action": "REWRITE",
    "fieldName": "description"
  }
}
```

**Errors**:
| Code | Error | Description |
| :--- | :--- | :--- |
| 400 | `INVALID_ACTION` | Action not REWRITE or GENERATE |
| 400 | `MISSING_FIELD` | fieldName not provided |
| 400 | `MISSING_TEXT` | originalText required for REWRITE |
| 500 | `PROVIDER_ERROR` | AI service error |

---

## 🔧 Local Setup

### 1. Installation
```bash
# Navigate to the service directory
cd resume-flow-backend

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root:
```env
HF_TOKEN=your_huggingface_api_token
PORT=5000
```

### 3. Running the Service
```bash
node index.js
```
The API will be available at `http://localhost:5000`.

---

## 📂 Project Structure
```
resume-flow-backend/
├── index.js                 # Express server entry
├── src/
│   ├── routes/
│   │   └── ai.routes.js     # Route definitions
│   ├── controllers/
│   │   └── ai.controller.js # Request handling
│   └── services/
│       └── llm.service.js   # LLM integration
├── package.json
├── Procfile                 # Render deployment
└── .env                     # Environment variables
```
