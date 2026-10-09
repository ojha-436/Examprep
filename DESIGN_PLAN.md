# Design Plan: ExamPrep AI (Physical Binder & Highlighter Aesthetic)

## 1. Subject & Concept
**Subject:** High-stakes government exam preparation (RRB, SSC).
**Audience:** Dedicated aspirants studying long hours, valuing high-yield, no-nonsense, precise information over flashy SaaS dashboards. 
**Concept:** "The Top Ranker's Binder." Moving away from the generic "AI Dark Mode SaaS" (indigo/amber on black) to a tactile, high-contrast, physical study material aesthetic. It should feel like a neatly organized binder with yellow highlighter marks and red pen corrections.

## 2. Token System
**Color Palette (4-6 hex values):**
- **Background:** `#FDFBF7` (Off-white paper, easy on the eyes for long study sessions)
- **Ink (Text):** `#0F172A` (Deep Slate, softer than pure black but very high contrast)
- **Highlighter Yellow (Signature Accent):** `#D9F951` (Acid yellow/lime, used for high-yield marking, mimicking a physical highlighter)
- **Red Pen (Alert/Trap Accent):** `#E11D48` (Rose Red, used for examiner traps and warnings)
- **Official Blue (Action/Link):** `#2563EB` (Ballpoint pen blue, used for primary actions)

**Typography:**
- **Display/Headings:** `Plus Jakarta Sans` (Heavy, structured, authoritative)
- **Body / Cheat Sheet Text:** `ui-serif, Georgia, Cambria` (Textbook feel for long-form reading, drastically improving retention and legibility over sans-serif defaults)
- **Data/Formulas:** `JetBrains Mono` (Crisp, technical, perfect for LaTeX and technical terms)

**Layout:**
- **Structure:** Neobrutalist tactile cards. Containers have solid 2px borders (`border-slate-900`) and hard shadows (`shadow-[4px_4px_0_0_#0f172a]`) to mimic physical index cards or binder dividers. 
- **Organization:** Two-column split on desktop. A narrow, highly functional "Exam Strategy" sidebar (selectors, settings) on the left, and a massive "Study Desk" area on the right for the generated Cheat Sheet.

**Signature Element:**
- **The "High-Yield" Highlight:** Important elements, selected states, and key terms in the generated cheat sheet receive a thick `#D9F951` background block, visually identical to a student aggressively highlighting their notes. 

## 3. Self-Critique & Refinement
- *Is this just the standard #F4F1EA/Terracotta AI default?* No, the background is a cooler, brighter off-white and the accents are aggressive (Acid Yellow/Red) rather than warm clay, fitting the intensity of competitive exams.
- *Is it too minimal?* The neobrutalist borders and shadows add necessary structure to what could otherwise be a floaty white void.
- *Does the typography serve the content?* Using a serif for the actual cheat sheet content is a deliberate functional choice to reduce eye strain, separating the "app UI" (sans-serif) from the "study material" (serif).

Let's implement this!
