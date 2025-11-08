<div align="center">

<!-- Animated gradient banner -->

<p>
  <svg width="700" height="80" viewBox="0 0 700 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CareMate">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#22C55E">
          <animate attributeName="stop-color" values="#22C55E;#3B82F6;#14B8A6;#22C55E" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stop-color="#3B82F6">
          <animate attributeName="stop-color" values="#3B82F6;#14B8A6;#22C55E;#3B82F6" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="700" height="80" rx="12" fill="url(#grad)" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" font-family="Inter,Segoe UI,Arial,sans-serif" fill="#ffffff" font-weight="600">CareMate</text>
  </svg>
</p>

<p style="margin:4px 0 10px 0;color:#64748b;font-size:14px;">Integrated Diagnostic Framework — privacy-first triage orchestration</p>

```bash

```

<!-- Typing effect -->

<p>
  <svg width="700" height="30" viewBox="0 0 700 30" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="orchestrating intake to guidance">
    <defs>
      <linearGradient id="gradText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
      <clipPath id="reveal">
        <rect x="0" y="0" width="0" height="30">
          <animate attributeName="width" values="0;700;0" keyTimes="0;0.7;1" dur="6s" repeatCount="indefinite" />
        </rect>
      </clipPath>
    </defs>
    <text x="350" y="20" text-anchor="middle" font-size="14" font-family="Inter,Segoe UI,Arial,sans-serif" fill="url(#gradText)" clip-path="url(#reveal)">orchestrating intake → normalization → guidance</text>
    <rect x="150" y="6" width="2" height="18" fill="#22C55E" opacity="1">
      <animate attributeName="x" values="150;550;150" keyTimes="0;0.7;1" dur="6s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;1;0;1" dur="0.8s" repeatCount="indefinite" />
    </rect>
  </svg>
</p>

<!-- Badges -->

<p>
  <img src="https://img.shields.io/badge/Privacy--First-22C55E?style=flat&logo=shield&logoColor=22C55E" alt="Privacy First" />
  <img src="https://img.shields.io/badge/Human--in--the--Loop-14B8A6?style=flat" alt="Human in the Loop" />
  <img src="https://img.shields.io/badge/Modular-3B82F6?style=flat" alt="Modular" />
</p>

</div>

---

## From Research to Reality

CareMate began as a research initiative exploring whether machine learning and homeopathy can intersect ethically. What started as a model predicting urgency from symptoms evolved into a complete triage framework integrating privacy, explainability, and tone.

---

## The Journey

- Stage 1 – Spark: Early Python CLI predicted urgency via ensemble ML.
- Stage 2 – Intelligence: Added classifiers, regressors, and balanced datasets (e.g., Balanced_SPID_Dataset.csv, Remedy_Composition_FINAL_Merged.csv).
- Stage 3 – Expansion:
   - Explainable AI (Ollama LLM)
   - Emotion sensing (MediaPipe / ONNX)
   - Doctor approval with SPID card for continuity

- Stage 4 – Prototype: Full stack running locally with no cloud dependency.

---

## Why Homeopathy?

| Challenge | CareMate’s Approach |
|----------|---------------------|
| Subjective case reading | Quantified symptom scoring |
| Manual repertory lookup | ML‑based dynamic mapping |
| Time‑intensive intake | Automated urgency triage |
| Static practice data | Continuous adaptive learning |

Note: This system is an assistive tool; it augments the clinician rather than replacing judgment.

---

---

## Model Overview

| Layer | Model Family | Output |
|-------|--------------|--------|
| Urgency Classifier | Balanced Random Forest | Low / Moderate / High |
| Urgency Regressor | Gradient Boosted | Score 1–10 |
| Remedy Predictor | Balanced Classifier | Remedy Name |
| Dosage Mapping | Rule + Dataset | Potency / Frequency |
| Explainability | LLM (Ollama) | Human‑readable rationale |
| Emotion Detection | ONNX / MediaPipe | Mood State |

---

## Privacy‑First Triage Flow

1. Intake → symptoms and context
2. Evaluation → models estimate urgency and candidate remedy
3. Explanation → LLM‑based rationale
4. Tone adaptation → emotion‑aware response
5. Logging → local records

Processing is local by default; no tracking or external calls are required.

---

## Setup Guide

```bash
git clone https://github.com/mindflayer0010/IDF.git CareMate
cd CareMate

```

### Client (UI)

```bash
cd client && npm install && npm run dev

```

### Server (Node)

```bash
cd server && npm install && npm run dev

```

### Optional Python Service

```bash
python server/pyservice/predict.py

```

### Local LLM (Ollama)

```bash
ollama pull llama3.1
ollama serve

```

Open http://localhost:5173

---

## Tone Adaptation Examples

| Emotion | System Tone |
|--------|-------------|
| Happy | “Let’s keep this quick and light.” |
| Sad | “I’ll guide you step by step.” |
| Anxious | “No rush — we’ll take it easy.” |
| Neutral | “Proceeding with triage now.” |

---

## Logs Dashboard

- Symptoms entered
- Urgency and remedy predictions
- Explanation summary
- Emotion context
- Timestamp and Reference ID
   Data is stored locally.

---

## Disclaimer

CareMate is a research prototype, not a licensed diagnostic tool. Outputs serve as assistive triage guidance; final decisions remain with qualified practitioners.

---

## Author & Vision

Soumesh Nanda  
AI & Robotics Engineer | B.Tech CSE (AI & ML)  
Amity University Uttar Pradesh, Lucknow

Founder – Machina Speculatrix Robotics Club  
Organizer – Protosphere Science Expo  
Inspire Awards ×3 | RMO Zonal | ISRO Chandrayaan‑2 Delegate

[LinkedIn](https://linkedin.com/in/soumeshnanda) • [GitHub](https://github.com/mindflayer0010)

---

## Next Milestones

- SPID Card integration
- Auto‑composition cross‑reference
- Offline LLM enhancements
- Progressive Web App deployment

“Empathy and computation can coexist when design listens as much as it predicts.”

### Feature Status Snapshot

| Area | Status | Notes |
|------|--------|-------|
| Urgency Prediction | Stable | Calibrated output tiers |
| Remedy Suggestion | Experimental | Continuous refinement |
| Dosage Guidance | Prototype | Rule/data hybrid |
| Explanation Layer | Active | LLM rationale generation |
| Emotion Adaptation | Beta | Improving accuracy |
| Local LLM | Optional | Ollama integration |
| SPID Card | Planned | Pending workflow design |
| PWA Support | Planned | Build pipeline review |

### Rapid Navigation

| Purpose | Link |
|---------|------|
| Issues / Enhancements | https://github.com/mindflayer0010/IDF-Integrated-Diagnostic-Framework/issues |
| Pull Requests | https://github.com/mindflayer0010/IDF-Integrated-Diagnostic-Framework/pulls |
| Repository | https://github.com/mindflayer0010/IDF-Integrated-Diagnostic-Framework |
| Author Profile | https://github.com/mindflayer0010 |

> Dynamic shields above reflect repository activity; they help present the README as a living document.