# Resume Flow Backend API

## Overview
AI-powered resume content generation API for the Resume Flow application.

## Quick Start
```bash
npm install
node index.js  # Runs on port 5000
```

## Environment Variables
Create a `.env` file:
```
HF_TOKEN=your_huggingface_api_token
PORT=5000  # Optional, defaults to 5000
```

---

## API Reference

### Base URL
- **Local**: `http://localhost:5000/api/v1`
- **Production**: `https://resume-flow-backend-9b1g.onrender.com/api/v1`

---

### Health Check
```
GET /
```
Returns server status and available endpoints.

**Response:**
```json
{
  "status": "online",
  "version": "1.0.0",
  "endpoints": {
    "field": "POST /api/v1/ai/field"
  }
}
```

---

### AI Field Writer
```
POST /api/v1/ai/field
```
Generate or rewrite resume content for a specific field.

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | `'REWRITE'` \| `'GENERATE'` | ✅ | Operation type |
| `fieldName` | `string` | ✅ | Field name (e.g., 'summary', 'description') |
| `originalText` | `string` | ✅ for REWRITE | Text to rewrite |
| `instruction` | `string` | ❌ | Custom instructions |
| `tone` | `'professional'` \| `'casual'` \| `'confident'` \| `'friendly'` | ❌ | Writing tone |
| `format` | `'bullets'` \| `'paragraph'` | ❌ | Output format |

#### Example: Generate
```json
{
  "action": "GENERATE",
  "fieldName": "summary",
  "instruction": "Software engineer with 3 years React experience",
  "tone": "professional",
  "format": "paragraph"
}
```

#### Example: Rewrite
```json
{
  "action": "REWRITE",
  "fieldName": "description",
  "originalText": "I worked on projects.",
  "instruction": "Make it impactful with metrics",
  "format": "bullets"
}
```

#### Response
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

#### Errors
| Code | Error | Description |
|------|-------|-------------|
| 400 | `INVALID_ACTION` | Action not REWRITE or GENERATE |
| 400 | `MISSING_FIELD` | fieldName not provided |
| 400 | `MISSING_TEXT` | originalText required for REWRITE |
| 500 | `PROVIDER_ERROR` | AI service error |

---

## Project Structure
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

---

## Deployment
Push to GitHub, connect to Render.com, set `HF_TOKEN` env var.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express 5
- **AI**: HuggingFace Inference API (Qwen2.5-7B-Instruct)
