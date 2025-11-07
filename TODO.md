# CareMate MERN Integration TODO

## Phase 1: Setup Directory Structure and Move Artifacts

- [x] Create artifacts/ directory and move data/ and model/ into it
- [x] Create server/ and client/ directories with subfolders (src/models, src/routes, etc.)

## Phase 2: Server Setup (Node/Express)

- [x] Create server/package.json
- [x] Create server/tsconfig.json
- [x] Create server/src/env.ts
- [x] Create server/src/db.ts
- [x] Create server/src/models/User.ts
- [x] Create server/src/models/TriageLog.ts (modified for new fields)
- [x] Create server/src/services/triageEngine.ts (modified to call Python)
- [x] Create server/src/services/llm.ts
- [x] Create server/src/utils/validation.ts (modified for new schema)
- [x] Create server/src/routes/triage.ts (modified for new request/response)
- [x] Create server/src/routes/chat.ts
- [x] Create server/src/routes/logs.ts
- [x] Create server/src/routes/metadata.ts (new)
- [x] Create server/src/index.ts
- [x] Create server/pyservice/predict.py (new Python script)
- [x] Install server dependencies

## Phase 3: Client Setup (React/Vite)

- [ ] Create client/package.json
- [ ] Create client/index.html
- [ ] Create client/tailwind.config.js
- [ ] Create client/postcss.config.js
- [ ] Create client/.env
- [ ] Create client/src/main.tsx
- [ ] Create client/src/index.css
- [ ] Create client/src/App.tsx
- [ ] Create client/src/pages/Chat.tsx (modified)
- [ ] Create client/src/pages/Dashboard.tsx
- [ ] Create client/src/components/ChatBox.tsx (if needed)
- [ ] Create client/src/components/SymptomForm.tsx (modified)
- [ ] Create client/src/components/UrgencyGauge.tsx (modified)
- [ ] Create client/src/components/ExplanationCard.tsx (modified)
- [ ] Create client/src/lib/api.ts

## Phase 4: Install Dependencies and Test

- [ ] Install server dependencies (pnpm i express cors mongoose zod dotenv morgan typescript ts-node-dev @types/express @types/cors @types/node @types/morgan)
- [ ] Install client dependencies (pnpm i react react-dom @types/react @types/react-dom tailwindcss postcss autoprefixer)
- [ ] Test server API endpoints (/api/triage, /api/metadata/symptoms, etc.)
- [ ] Test client build and run
- [ ] Verify predictions match CLI output
- [ ] Handle edge cases (no symptoms, single symptom, invalid inputs)

## Phase 5: Final Touches

- [ ] Add disclaimer modal or banner
- [ ] Add red-flag warnings for specific symptoms
- [ ] Update .gitignore to exclude artifacts/
- [ ] Create README.md with setup instructions
