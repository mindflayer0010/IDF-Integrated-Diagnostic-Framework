<div align="center">

# CareMate

Integrated Diagnostic Framework — privacy‑first triage orchestration

[![Privacy First](https://img.shields.io/badge/Privacy--First-22C55E?style=flat&logo=shield&logoColor=22C55E)](#)
[![Human in the Loop](https://img.shields.io/badge/Human--in--the--Loop-14B8A6?style=flat)](#)
[![Modular](https://img.shields.io/badge/Modular-3B82F6?style=flat)](#)

</div>

---

<details>
<summary><strong>Table of contents</strong></summary>

- Guiding principles
- Novelty & High‑Level Operation
- Visual: conceptual flow
- Model Overview (high‑level, sanitized)
- Usage Instructions (minimal)
- Local Execution & UI Interaction (non‑sensitive)

</details>

# CareMate

> A discreet, end‑to‑end framework for digital symptom intake and guided triage.

<div style="border-left: 4px solid #22c55e; padding: 8px 12px; background: #f0fdf4; color:#14532d; margin: 12px 0;">
<strong>At a glance</strong>
<ul>
<li>Captures symptoms and context through a focused UI.</li>
<li>Returns a calibrated urgency tier and concise guidance.</li>
<li>Keeps an auditable record for quality and compliance.</li>
<li>Protects sensitive logic; public docs remain high‑level.</li>
</ul>
</div>

## Guiding principles

- Privacy first — internals remain confidential by design
- Separation of concerns — thin coordinator, isolated core
- Resilience — components can be upgraded/swapped safely

## Usage snapshot
User submits symptoms → inputs are normalized → protected core evaluates → structured response is returned.

## Access & scope
This repository exposes only non‑sensitive integration points. Deeper details are available to authorized collaborators.

## Contributing
Issues welcome for general improvements. Requests touching protected logic are deferred.

## License
To be added.

## Contact
Open an issue titled “Access Request”.

## Novelty & High‑Level Operation

<div style="border-left:4px solid #3b82f6;padding:10px 14px;background:#eff6ff;color:#1e3a8a;margin:16px 0;">
<strong>Core differentiation</strong>: orchestrates triage end‑to‑end while insulating proprietary decision mechanics behind a stable boundary.
</div>

### What’s novel
- Audit‑ready orchestration from intake to structured output
- Stable boundary enables internal core evolution without surface churn
- Human‑in‑the‑loop posture (guidance, not diagnosis)
- Minimal necessary signals; privacy‑by‑design
- Flexible deployment with graceful degradation

### Conceptual flow
1. Intake
2. Normalization
3. Core evaluation
4. Packaging
5. Logging

*Description intentionally abstract to protect IP.*

## Model Overview (high‑level, sanitized)

This section provides a conceptual description of the learning approach without disclosing protected implementation details.

### Learning objectives
- Urgency estimation: supervised regression that maps collected signals to a calibrated urgency score, later discretized into tiers.
- Guidance classification: supervised multi‑class classifier that suggests a guidance category based on the same normalized signals.

### Inputs (abstracted)
- Structured symptom descriptors (presence, severity, onset/duration)
- Limited contextual attributes (e.g., basic demographics and modifiers)
- Optional free‑text notes processed into compact representations

All inputs are normalized into a minimal schema prior to learning.

### Training approach (conceptual)
- Supervised learning with cross‑validation and held‑out evaluation
- Class/target imbalance addressed via sampling and/or cost‑sensitive weighting
- Probabilistic calibration on outputs to improve decision thresholds
- Confidence gating and conservative fallbacks for low‑certainty predictions

### Model families (kept generic by design)
- Standard, well‑established supervised ML families for tabular signals (e.g., ensemble‑based regressors/classifiers and calibrated learners)
- Optional text representation layers to compress free‑text into features consumed by the tabular learners

Exact architectures, hyperparameters, feature engineering techniques, and training recipes are intentionally withheld to protect ongoing IP and patentable components.

### Outputs
- A calibrated urgency score mapped into human‑interpretable tiers
- A guidance label suitable for downstream triage workflows
- Internal feature‑attribution tooling informs explanations; user‑facing summaries are curated to avoid exposing sensitive internals

### Data notes
- Training data originates from curated and balanced corpora appropriate for the problem domain
- Specific sources, preprocessing pipelines, and selection criteria remain confidential

This overview is intentionally high‑level. Authorized collaborators can request deeper documentation under appropriate agreements.

## Usage Instructions (minimal)

These steps describe how to interact with the system at a high level without revealing protected internals.

<div style="border-left:4px solid #22c55e;padding:10px 14px;background:#f0fdf4;color:#14532d;margin:16px 0;">
<strong>Quick start (local)</strong>
<ol>
<li>Start the core services (UI, coordinator, optional decision core).</li>
<li>Open the UI in your browser.</li>
<li>Submit symptoms and basic context via the intake form.</li>
<li>Receive an urgency tier and a concise guidance summary.</li>
</ol>
</div>

### Conceptual API interaction
- Submit normalized symptom/context signals
- Receive: urgency tier, guidance, and a reference id

<details>
<summary><strong>Show illustrative request/response</strong></summary>

```json
{
  "signals": {
    "symptoms": ["fever", "cough"],
    "severity": "moderate",
    "onsetDays": 3,
    "modifiers": {"ageBand": "adult"}
  }
}
```

Response (conceptual):
```json
{
  "urgencyTier": "moderate",
  "guidance": "home-care + monitoring",
  "referenceId": "abc123"
}
```
</details>

Note: Exact endpoints, authentication, and schemas are intentionally omitted in the public README.

<details>
<summary><strong>Show illustrative request/response</strong></summary>

```json
{
  "signals": {
    "symptoms": ["fever", "cough"],
    "severity": "moderate",
    "onsetDays": 3,
    "modifiers": {"ageBand": "adult"}
  }
}
```

Response (conceptual):
```json
{
  "urgencyTier": "moderate",
  "guidance": "home-care + monitoring",
  "referenceId": "abc123"
}
```
</details>

## Local Execution & UI Interaction (non‑sensitive)

Below is a minimal guide to run the visible layers locally. Proprietary internals are abstracted away.

### 1) Clone repository
```powershell
git clone https://github.com/mindflayer0010/IDF.git CareMate
cd CareMate
```

### 2) Install client (UI)
```powershell
cd client
npm install
cd ..
```

### 3) Install server (coordinator)
```powershell
cd server
npm install
cd ..
```

### 4) Optional: start local Python component
```powershell
python server/pyservice/predict.py
```

### 5) Start services (separate terminals recommended)
```powershell
# Terminal A — server
cd server
npm run dev
```
```powershell
# Terminal B — client UI
cd client
npm run dev
```

### 6) Open the UI
Visit the client dev URL (e.g., http://localhost:5173). The server listens on its configured port (e.g., 4000).

### 7) Interact
Submit a small set of symptoms and context. Review the returned urgency tier and guidance.

### 8) Stop
```powershell
# In each terminal
Ctrl + C
```

### 9) Production build
```powershell
# Client
cd client
npm run build
cd ..

# Server
cd server
npm run build
```

### 10) Troubleshooting
<div style="border-left:4px solid #ef4444;padding:10px 14px;background:#fef2f2;color:#7f1d1d;margin:16px 0;">
<strong>Common issues</strong>
<ul>
<li><em>Port in use</em>: Adjust dev port via environment variable or client config.</li>
<li><em>Missing Python component</em>: System falls back; advanced guidance may be limited.</li>
<li><em>Large model binaries</em>: Use external storage or Git LFS with history cleanup.</li>
<li><em>ENV not loaded</em>: Ensure local <code>.env</code> exists; restart terminals after edits.</li>
</ul>
</div>

<div style="border-left:4px solid #f59e0b;padding:10px 14px;background:#fffbeb;color:#7c2d12;margin:16px 0;">
<strong>Notes</strong>: keep environment variables in a local .env; advanced guidance may degrade without the Python component; avoid committing large binaries.
</div>
