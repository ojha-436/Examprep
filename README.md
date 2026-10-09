# ⚡ ExamPrep AI — High-Yield Revision & Cheat-Sheet Engine

> **The Definitive 4-Pillar Study Desk & CBT Practice Test Generator for Government Competitive Exams (RRB JE, RRB ALP, SSC JE, SSC CHSL & State Engineering Exams).**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud-Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://examprep-ai-823065407403.asia-south1.run.app)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

### 🌐 Live Production URL
**[https://examprep-ai-823065407403.asia-south1.run.app](https://examprep-ai-823065407403.asia-south1.run.app)**  
*Deployed on Google Cloud Run in `asia-south1` (Mumbai) with auto-scaling and zero cold-start optimization.*

---

## 📖 Overview

**ExamPrep AI** is an intelligent pedagogy and revision platform purpose-built for aspirants preparing for high-stakes government competitive exams in India (Railway Recruitment Board & Staff Selection Commission). 

Moving away from generic AI summaries and textbook fluff, ExamPrep AI strictly synthesizes **4-Pillar Revision Cheat Sheets**, extracts question patterns from **uploaded Previous Year Question (PYQ) papers**, and simulates **real CBT examination sessions with official negative marking**.

---

## 🏛️ The 4-Pillar Revision Architecture

Every generated topic is constructed through a rigid pedagogical framework:

| Pillar | Focus | What It Delivers |
| :--- | :--- | :--- |
| **🧠 1. Core Knowledge Base** | Architecture & Logic | Fundamental principles, operational limitations, and high-clarity mental models without textbook fluff. |
| **⚡ 2. Shortcut Formulas & Hacks** | Time-Saving Calculation | All high-yield equations rendered in **LaTeX ($\KaTeX$)**, dimensional scaling rules, and 20-second speed hacks. |
| **🎯 3. Examiner Traps & Application** | Negative Marking Defense | Identifies deceptive distractor choices, sign errors, and trick questions where 80% of test-takers lose marks. |
| **📺 4. Top Video Marathons** | Search-Grounded Tutorials | Real-time **Google Search grounding** retrieving verified 2026 YouTube lecture series and marathon classes. |

---

## 🚀 Key Features

### 1. 📝 Multimodal PYQ Pattern Analyzer & Practice Generator
* Drop past shift PDF question papers, memory-based screenshots, or raw questions.
* Automatically identifies the question pattern, difficulty distribution, and topics tested.
* Generates authentic, pattern-matched practice tests with official CBT scoring heuristics (e.g. `+1` mark, `-0.33` 1/3rd penalty for RRB; `-0.25` for SSC).

### 2. 🗂️ "Top Ranker's Binder" Frontend Design System
* **Tactile Paper Canvas:** Off-white `#FDFBF7` canvas with solid `2px solid #0F172A` borders and hard drop shadows (`shadow-[6px_6px_0_0_#0F172A]`).
* **Highlighter Vocabulary:** Acid/Highlighter Yellow (`#D9F951`) highlights high-yield topics, and Correction Red (`#E11D48`) alerts students to negative marking traps.
* **Serif Study Typography:** Body content renders in classic serif type for reduced eye strain and superior long-form reading retention.
* **Math Typography:** In-browser LaTeX parsing via `remark-math` and `rehype-katex`.

### 3. 🏢 Enterprise-Grade Candidate Authentication (SSO)
* **Single Sign-On (SSO):** Google Workspace, Microsoft Entra ID (Azure AD), and **DigiLocker / Parichay National Govt SSO**.
* **Work & Aspirant Email Authentication:** Masked passwords, interactive entropy password strength meter, and session persistence.
* **Compliance Ready:** SOC-2 Type II, 256-Bit TLS encryption, and ISO 27001 standard badges.

### 4. 📄 Microsoft Word (.docx) & Physical Print Export
* Direct one-click export to formatted `.docx` files using the `docx` library.
* Custom `@media print` stylesheets optimized for physical A4 cheat-sheet printing with zero screen glare.

### 5. ⚡ Interactive Study Tools
* **Speed Calculator:** Quick interactive solvers for Incline Rolling (Physics), Quadratics, Bayes Probability, and TVM Compounding.
* **Ask a Doubt Drawer:** Real-time AI tutor drawer for targeted formula derivations and boundary condition queries.
* **Offline Revision Binder:** Save and organize generated cheat sheets locally in browser storage with JSON backup export.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti.
* **Typography & Math:** `react-markdown`, `remark-math`, `rehype-katex`, `katex`.
* **Export Engine:** `docx` (Word processing).
* **Backend:** Express.js, Node.js v24.
* **AI Model:** Google Gemini 3.8 Flash (`@google/genai`) with Google Search Grounding tool integration.

---

## 📦 Getting Started

### Prerequisites
* **Node.js** (v18.0 or higher)
* **npm** (v9.0 or higher)
* **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ojha-436/Examprep.git
   cd Examprep
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (do not commit this file):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key inside `.env`:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   PORT=3000
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security & Privacy

* **Zero Leakage:** All secrets, `.env`, `.env.*`, and sensitive keys are strictly excluded via `.gitignore`.
* **Rate Limiting:** Built-in sliding-window in-memory rate limiter (25 requests/min per IP) protects API quotas.
* **Prompt Injection Defense:** Strict input sanitizers prevent system prompt overrides and control character exploits.

---

## ☁️ Google Cloud Deployment (Cloud Run)

The application includes a production-ready container configuration for Google Cloud Run:

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project promptwar-501405

# 2. Deploy to Cloud Run from source
gcloud run deploy examprep-ai \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars "GEMINI_API_KEY=YOUR_GEMINI_API_KEY,NODE_ENV=production"
```

* **Live Service URL:** [https://examprep-ai-823065407403.asia-south1.run.app](https://examprep-ai-823065407403.asia-south1.run.app)
* **GCP Region:** `asia-south1` (Mumbai)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
