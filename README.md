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

<p style="margin:4px 0 10px 0;color:#64748b;font-size:14px;">Integrated Diagnostic Framework — privacy-first triage orchestration with a <b>phenomenal 3D interface</b>.</p>

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
  <img src="https://img.shields.io/badge/Privacy--First-22C55E?style=flat&logo=shield&logoColor=white" alt="Privacy First" />
  <img src="https://img.shields.io/badge/Human--in--the--Loop-14B8A6?style=flat&logo=human&logoColor=white" alt="Human in the Loop" />
  <img src="https://img.shields.io/badge/3D--Enhanced-3B82F6?style=flat&logo=three.js&logoColor=white" alt="3D Enhanced" />
  <img src="https://img.shields.io/badge/AI--Powered-8B5CF6?style=flat&logo=openai&logoColor=white" alt="AI Powered" />
</p>

</div>

---

## 🌟 From Research to Reality

**CareMate** began as a research initiative exploring whether machine learning and homeopathy can intersect ethically. What started as a model predicting urgency from symptoms has evolved into a complete, privacy-first triage framework.

It combines **Explainable AI**, **Emotion Recognition**, and a **State-of-the-Art 3D UI** to provide a compassionate, intelligent, and visually stunning healthcare companion.

---

## ✨ Phenomenal UI Experience

CareMate isn't just functional; it's designed to be immersive and beautiful.

### 🧬 3D DNA Hero
A fully interactive, rotating **3D DNA Helix** greets users on the landing page, symbolizing the intersection of life and data. Built with `Three.js` and `@react-three/fiber`.

### 🧠 The Thinking Sphere
Gone are boring loading spinners. When CareMate analyzes symptoms, a **pulsing, 3D particle sphere** visualizes the AI's cognitive process, creating a mesmerizing wait experience.

### 🗂️ Smart Categorized Triage
A sleek, glassmorphic interface organizes symptoms into intuitive categories (General, Pain, Respiratory). **Smart Tiles** light up and expand upon selection, providing immediate visual feedback with severity indicators.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|:---|:---|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwind-css&logoColor=white) ![Three.js](https://img.shields.io/badge/-Three.js-black?logo=three.js&logoColor=white) ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) ![Mongoose](https://img.shields.io/badge/-Mongoose-880000?logo=mongoose&logoColor=white) |
| **AI & ML** | ![Ollama](https://img.shields.io/badge/-Ollama-white?logo=ollama&logoColor=black) ![TensorFlow](https://img.shields.io/badge/-TensorFlow-FF6F00?logo=tensorflow&logoColor=white) ![MediaPipe](https://img.shields.io/badge/-MediaPipe-00B0FF?logo=google&logoColor=white) |
| **Design** | **Glassmorphism**, **Neumorphism**, **Interactive Particles** |

---

## 🚀 Key Features

-   **🔒 Privacy-First**: All processing happens locally or on your private server. No data leaves your control.
-   **🤖 Explainable AI**: Every diagnosis comes with a "Why" — a human-readable rationale generated by a local LLM.
-   **❤️ Tone Adaptation**: The system detects user emotion (via text or voice) and adapts its response tone (Empathetic, Direct, Reassuring).
-   **📊 Smart Dashboard**: A glassmorphic dashboard to track patient history, urgency distribution, and logs.

---

## ⚡ Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/mindflayer0010/IDF.git CareMate
cd CareMate
```

### 2. Client (UI)
```bash
cd client
npm install
npm run dev
```

### 3. Server (Node)
```bash
cd server
npm install
npm run dev
```

### 4. Local LLM (Ollama)
Ensure [Ollama](https://ollama.com/) is installed and running.
```bash
ollama pull llama3.1
ollama serve
```

Open **http://localhost:5173** to experience the magic.

---

## 👨‍💻 Author & Vision

<div align="center">

**Soumesh Nanda**  
*AI & Robotics Engineer | B.Tech CSE (AI & ML)*  
Amity University Uttar Pradesh, Lucknow

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/soumeshnanda)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mindflayer0010)

Founder – **Machina Speculatrix Robotics Club**  
Organizer – **Protosphere Science Expo**  
*Inspire Awards ×3 | RMO Zonal | ISRO Chandrayaan‑2 Delegate*

> "Empathy and computation can coexist when design listens as much as it predicts."

</div>

---

## 🔮 Next Milestones

- [ ] **SPID Card Integration**: Portable patient identity.
- [ ] **Offline LLM Enhancements**: Smaller, faster models for edge devices.
- [ ] **PWA Deployment**: Install CareMate on any device.
- [ ] **Voice Interface**: Full voice-to-text triage with emotion analysis.

---

<div align="center">
  <sub>CareMate is a research prototype. Outputs serve as assistive guidance; final decisions remain with qualified practitioners.</sub>
</div>