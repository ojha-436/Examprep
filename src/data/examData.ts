export interface ExamItem {
  id: string;
  name: string;
  category: 'Govt & Railways' | 'SSC Exams' | 'Engineering' | 'Civil Services' | 'Medical' | 'Graduate';
  badge: string;
  stageInfo: string;
  markingScheme: string; // e.g. "+1, -0.33 (1/3rd Negative)"
  description: string;
  highYieldTopics: string[];
}

export const EXAM_CATEGORIES = [
  'All',
  'Govt & Railways',
  'SSC Exams',
  'Engineering',
  'Civil Services',
  'Medical',
  'Graduate',
] as const;

export const POPULAR_EXAMS: ExamItem[] = [
  {
    id: 'rrb_je',
    name: 'RRB JE (Junior Engineer)',
    category: 'Govt & Railways',
    badge: 'Indian Railways • CBT 1 & 2',
    stageInfo: 'CBT-1 (100 Qs / 90 Mins) & CBT-2 (150 Qs / 120 Mins)',
    markingScheme: '+1 mark, -0.33 (1/3rd Negative Marking)',
    description: 'Technical Engineering (Civil/Mech/Elec/EC/CS) + CBT-1 Math, Reasoning, General Science.',
    highYieldTopics: [
      'Basic Electrical: Ohm\'s Law, Kirchhoff\'s Laws & Thevenin Theorem',
      'Basic Science: Work, Power, Energy & Speed-Time Graphs',
      'Engineering Mechanics: Moment of Inertia & Centre of Gravity',
      'Thermodynamics: Heat Engines, Carnot Cycle & Heat Transfer',
      'Fluid Mechanics: Pascal Law, Continuity & Bernoulli Equation',
      'Digital Electronics: Logic Gates, Boolean Algebra & Flip-Flops',
      'CBT-1 Math: Time & Work, Speed Distance & Simplification Tricks',
      'Chemistry: Periodic Classification & Chemical Reactions in Railways',
    ],
  },
  {
    id: 'rrb_alp',
    name: 'RRB ALP (Assistant Loco Pilot & Tech)',
    category: 'Govt & Railways',
    badge: 'Loco Pilot • CBT 1 & 2 + Trade',
    stageInfo: 'CBT-1 (75 Qs / 60 Mins) • CBT-2 Part A (100 Qs) + Part B Trade (75 Qs)',
    markingScheme: '+1 mark, -0.33 (1/3rd Negative Marking)',
    description: 'Basic Science & Engineering (Engineering Drawing, Levers, Heat) + Relevant ITI/Diploma Trade.',
    highYieldTopics: [
      'Basic Science & Engg: Levers, Pulleys & Simple Machines (MA & VR)',
      'Basic Science & Engg: Heat, Temperature & Specific Heat Capacity',
      'Basic Science & Engg: Occupational Safety, Health & Hazard Symbols',
      'Basic Science & Engg: Engineering Drawing (Projections, Lines & Views)',
      'Basic Science & Engg: Density, Relative Density & Hydrometer',
      'Loco Trade Elect/Fitter: Resistors in Series-Parallel & Power Formula',
      'Math Aptitude: Pipes & Cisterns, Train Relative Speed Problems',
      'Reasoning: Mirror Images, Venn Diagrams & Statement Assumptions',
    ],
  },
  {
    id: 'ssc_je',
    name: 'SSC JE (Junior Engineer)',
    category: 'SSC Exams',
    badge: 'CPWD / MES / CWC • Paper 1 & 2',
    stageInfo: 'Paper-1 CBT (200 Qs / 120 Mins) • Paper-2 CBT (100 Qs / 300 Marks)',
    markingScheme: 'Paper 1: +1 / -0.25 (1/4th) • Paper 2: +3 / -1.00',
    description: 'General Engineering (Civil/Structural, Electrical, Mechanical) + General Intelligence & GK.',
    highYieldTopics: [
      'Civil: Soil Mechanics, Effective Stress & Mohr-Coulomb Failure',
      'Civil: Reinforced Concrete Design (Limit State Method & Neutral Axis)',
      'Civil: Surveying (Chain, Compass & Leveling Errors Correction)',
      'Electrical: AC Circuits, RLC Resonance & Power Factor Correction',
      'Electrical: DC Machines & Transformer EMF Equation / Losses',
      'Mechanical: Strength of Materials (Shear Force & Bending Moment Diagrams)',
      'Mechanical: IC Engines, Otto / Diesel Cycle Efficiency & Air Refrigeration',
      'General Intelligence: Coding-Decoding, Syllogisms & Number Analogies',
    ],
  },
  {
    id: 'ssc_chsl',
    name: 'SSC CHSL (10+2 Level)',
    category: 'SSC Exams',
    badge: 'LDC / JSA / DEO • Tier 1 & 2',
    stageInfo: 'Tier-1 (100 Qs / 200 Marks / 60 Mins) • Tier-2 (Paper 1 - 135 Qs)',
    markingScheme: 'Tier-1: +2 marks, -0.50 negative • Tier-2: +3 marks, -1.00 negative',
    description: 'Quantitative Aptitude, General Intelligence, English Language, and General Awareness.',
    highYieldTopics: [
      'Quant: Algebra Identities & $(a+b+c)^3$ Cyclicity Formulas',
      'Quant: Trigonometry Maxima-Minima & Height/Distance Shortcuts',
      'Quant: Geometry Circle Tangents, Chords & Angle Theorems',
      'Quant: Profit, Loss & Marked Price (Successive Discounts)',
      'English: Subject-Verb Agreement, Active-Passive & Narration',
      'English: High-Frequency Idioms, One-Word Substitutions & Cloze Test',
      'General Awareness: Indian Constitution Articles, Amendments & Writs',
      'Reasoning: Blood Relations, Direction Sense & Counting Figures',
    ],
  },
  {
    id: 'ssc_cgl',
    name: 'SSC CGL (Combined Graduate Level)',
    category: 'SSC Exams',
    badge: 'Inspector / ASO • Tier 1 & 2',
    stageInfo: 'Tier-1 (100 Qs / 200 Marks) • Tier-2 (130 Qs / 390 Marks + Computer)',
    markingScheme: 'Tier-1: +2 / -0.50 • Tier-2: +3 / -1.00 negative',
    description: 'Mathematical Abilities, Reasoning, English Comprehension, GA & Computer Module.',
    highYieldTopics: [
      'Quant: Number System, Remainder Theorem & Unit Digit Rules',
      'Quant: Compound Interest vs Simple Interest Difference ($CI - SI$ for 2 & 3 yrs)',
      'Quant: Time, Speed & Distance (Boats & Streams, Linear Races)',
      'Reasoning: Syllogisms (100-50 method vs Venn), Matrix & Series',
      'Computer: Memory Hierarchy (Cache, RAM), OSI Model & MS Excel Shortcuts',
      'General Awareness: Modern History Freedom Struggle 1905-1947',
    ],
  },
  {
    id: 'rrb_ntpc',
    name: 'RRB NTPC (Non-Technical Categories)',
    category: 'Govt & Railways',
    badge: 'Station Master / Guard • CBT 1 & 2',
    stageInfo: 'CBT-1 (100 Qs / 90 Mins) • CBT-2 (120 Qs / 90 Mins)',
    markingScheme: '+1 mark, -0.33 (1/3rd Negative Marking)',
    description: 'Mathematics, General Intelligence & Reasoning, and General Awareness for Railway operations.',
    highYieldTopics: [
      'Math: Trains Crossing Platforms & Opposite Direction Speed Formulas',
      'Math: Data Interpretation & Statistics (Mean, Median, Mode, Variance)',
      'General Awareness: Indian Railways Zones, History & Vande Bharat Tech',
      'General Science: Human Diseases, Vitamins & Environmental Biology',
      'Reasoning: Seating Arrangement (Circular & Linear with North/South)',
    ],
  },
  {
    id: 'state_ae_je',
    name: 'State AE / JE Exams',
    category: 'Govt & Railways',
    badge: 'UPPSC / RSMSSB / BPSC / WBPSC JE',
    stageInfo: 'Objective Technical CBT + Non-Tech Papers',
    markingScheme: '+1 mark, -0.33 or -0.25 (as per state rule)',
    description: 'State Public Service Commission & Electricity Board recruitment for Engineers.',
    highYieldTopics: [
      'Civil: Building Materials (Cement Clinker & Concrete Mix Design)',
      'Electrical: Power Systems (Transmission Line Parameters & Fault Analysis)',
      'Mechanical: Theory of Machines (Flywheel, Governors & Balancing)',
      'Non-Tech: State Geography, History, Culture & National Current Affairs',
    ],
  },
  {
    id: 'jee',
    name: 'JEE Main & Advanced',
    category: 'Engineering',
    badge: 'IIT / NIT Entrance',
    stageInfo: 'Paper 1 (90 Qs / 300 Marks / 180 Mins)',
    markingScheme: '+4 marks, -1.00 negative',
    description: 'Physics, Chemistry, and Advanced Mathematics for engineering admissions.',
    highYieldTopics: [
      'Rotational Dynamics & Moment of Inertia',
      'Electromagnetic Induction & Lenz Law',
      'Definite Integration & King\'s Rule',
      'Optics & Wave Interference (YDSE)',
    ],
  },
  {
    id: 'neet',
    name: 'NEET UG',
    category: 'Medical',
    badge: 'MBBS / BDS Entrance',
    stageInfo: 'Pen & Paper (200 Qs / 720 Marks / 200 Mins)',
    markingScheme: '+4 marks, -1.00 negative',
    description: 'Biology, Chemistry, and Physics for medical school admissions.',
    highYieldTopics: [
      'Genetics & Mendelian Inheritance Laws',
      'Chemical Equilibrium & Le Chatelier Principle',
      'Human Physiology & Cardiac Cycle',
    ],
  },
  {
    id: 'upsc',
    name: 'UPSC Civil Services (CSE)',
    category: 'Civil Services',
    badge: 'IAS / IPS / IFS',
    stageInfo: 'Prelims GS-1 (100 Qs / 200 Marks) & CSAT (80 Qs / 200 Marks)',
    markingScheme: 'GS-1: +2 / -0.66 • CSAT: +2.5 / -0.83',
    description: 'General Studies, Indian Polity, Economy, Geography, and Modern History.',
    highYieldTopics: [
      'Indian Polity: Fundamental Rights & Judicial Writs',
      'Macroeconomics: Monetary Policy Tools & RBI Inflation Targeting',
      'Modern Indian History: Non-Cooperation to Quit India Movement',
    ],
  },
];

export interface CheatSheetItem {
  id: string;
  exam: string;
  topic: string;
  mode: string;
  content: string;
  groundingSources: Array<{ title: string; url: string }>;
  searchQueries: string[];
  timestamp: string;
  favorite?: boolean;
}

// Initial High-Yield Sample specifically tailored for RRB JE / RRB ALP / SSC JE
export const INITIAL_FEATURED_SHEET: CheatSheetItem = {
  id: 'seed-rrb-je-electrical',
  exam: 'RRB JE (Junior Engineer)',
  topic: 'DC Circuits: Ohm\'s Law, Kirchhoff\'s Laws & Speed Theorems',
  mode: 'comprehensive',
  timestamp: new Date().toISOString(),
  searchQueries: [
    'RRB JE CBT 2 electrical DC circuits marathon revision youtube',
    'Kirchhoff laws and Thevenin theorem railway JE question tricks',
  ],
  groundingSources: [
    {
      title: 'Engineers Academy - RRB JE CBT-2 Electrical Network Theorems',
      url: 'https://www.youtube.com/results?search_query=RRB+JE+Electrical+DC+Circuits+Network+Theorems',
    },
    {
      title: 'Testbook SuperCoaching - RRB JE / SSC JE Circuit Theory One Shot',
      url: 'https://www.youtube.com/results?search_query=Testbook+RRB+JE+Electrical+Circuit+Theory',
    },
    {
      title: 'NPTEL Basic Electrical Technology - Circuit Laws',
      url: 'https://www.youtube.com/results?search_query=Basic+Electrical+Kirchhoff+Laws+NPTEL',
    },
  ],
  content: `## 1. 🧠 Core Knowledge Base (Architecture & Logic)

* **Ohm's Law & Operational Limitations in RRB JE / SSC JE:**
  * Fundamental statement: $V = I \\cdot R$ (Valid strictly for **bilateral, linear conductors at constant temperature**).
  * *Negative Marking Trap:* Ohm's law does **NOT** apply to non-linear devices (Diodes, BJTs, Vacuum tubes, Arc lamps) or unilateral elements!

* **Kirchhoff's Laws (Conservation Principles):**
  * **KCL (Kirchhoff's Current Law):** $\\sum I_{\\text{node}} = 0$
    * Direct physical manifestation of **Conservation of Electric Charge**.
    * Applicable to lumped parameter circuits (both planar and non-planar). Fails at extremely high frequencies where wavelength $\\lambda$ is comparable to circuit dimensions.
  * **KVL (Kirchhoff's Voltage Law):** $\\sum V_{\\text{loop}} = 0$
    * Direct physical manifestation of **Conservation of Energy**.
    * Applies only in conservative electric fields (where $\\oint \\vec{E} \\cdot d\\vec{l} = 0$).

* **Network Theorems High-Yield Matrix:**
  * **Thevenin's Theorem:** Any linear active two-terminal network can be replaced by an ideal voltage source $V_{\\text{th}}$ in series with internal resistance $R_{\\text{th}}$.
  * **Norton's Theorem:** Dual of Thevenin: Current source $I_{\\text{N}} = \\frac{V_{\\text{th}}}{R_{\\text{th}}}$ in parallel with $R_{\\text{th}}$.
  * **Maximum Power Transfer Theorem (MPTT):**
    * For purely resistive DC circuits: $R_L = R_{\\text{th}}$.
    * Maximum power transferred: $P_{\\text{max}} = \\frac{V_{\\text{th}}^2}{4 R_{\\text{th}}}$.
    * **Efficiency at maximum power:** Exactly $\\eta = 50\\%$. (Examiners test this frequently; in commercial power transmission we do **NOT** operate at MPTT because 50% power would be wasted as heat!).

---

## 2. ⚡ Shortcut Formulas & Time-Savers

* **Voltage Divider & Current Divider Speed Hacks (10-Second Mental Math):**
  * Two resistors in series: 
    $$V_1 = V_{\\text{total}} \\cdot \\left(\\frac{R_1}{R_1 + R_2}\\right)$$
  * Two resistors in parallel:
    $$I_1 = I_{\\text{total}} \\cdot \\left(\\frac{R_2}{R_1 + R_2}\\right) \\quad \\text{(Opposite resistor in numerator!)}$$

* **Delta-Star ($\\Delta \\longleftrightarrow Y$) Conversion Cheat Code:**
  * Symmetrical Case: If all delta resistors are $R$, the equivalent star resistance is:
    $$R_{\\text{star}} = \\frac{R}{3} \\quad \\text{and} \\quad R_{\\text{delta}} = 3 \\cdot R_{\\text{star}}$$
  * General Delta to Star formula:
    $$R_A = \\frac{R_{AB} \\cdot R_{CA}}{R_{AB} + R_{BC} + R_{CA}} \\quad \\text{(Product of adjacent sides / Perimeter sum)}$$

* **Symmetrical Cube of 12 Equal Resistors ($R$):**
  * Equivalent resistance across Body Diagonal: $R_{\\text{eq}} = \\frac{5}{6} R$
  * Equivalent resistance across Face Diagonal: $R_{\\text{eq}} = \\frac{3}{4} R$
  * Equivalent resistance across Single Edge: $R_{\\text{eq}} = \\frac{7}{12} R$
  * *RRB Speed Mnemonic:* **Edge (7/12) < Face (9/12 = 3/4) < Body (10/12 = 5/6)**.

---

## 3. 🎯 High-Frequency Application Patterns & Examiner Traps

* **Trap 1: Finding $R_{\\text{th}}$ with Dependent Sources Present:**
  * *The Trap:* Candidates turn off dependent sources like independent ones.
  * *RRB/SSC Rule:* **Never kill dependent sources!** To find $R_{\\text{th}}$, deactivate independent sources only, connect a test source $1\\text{V}$ (or $1\\text{A}$) at the load terminals, and calculate $R_{\\text{th}} = \\frac{V_{\\text{test}}}{I_{\\text{test}}}$.

* **Trap 2: Superposition Theorem Applicability to Power:**
  * Superposition applies **ONLY to linear quantities** (Current $I$ and Voltage $V$).
  * It does **NOT** apply to Power because power is quadratic: $P = I^2 R \\neq (I_1^2 + I_2^2) R$.
  * To find power, first calculate total current $I_{\\text{total}} = I_1 + I_2$, then compute $P = I_{\\text{total}}^2 R$.

* **Trap 3: Negative Marking Strategy in RRB CBT (1/3rd Penalty):**
  * In RRB JE & ALP, 3 wrong questions deduct 1 full positive mark!
  * Never make blind guesses. If you can eliminate 2 out of 4 options (leaving 50/50 probability), statistical expectation is positive:
    $$E = (0.50 \\times +1) - (0.50 \\times 0.33) = +0.335 \\text{ marks net gain!}$$

---

## 4. 📺 Top Video Resources (Search Grounded)

* **Engineers Academy:** *RRB JE Electrical Circuit Theory Marathon Class*
  * **Why it's the best:** Tailored specifically for Railway Recruitment Board CBT-2. Covers 200+ previous year questions with 30-second nodal analysis tricks.
  * [Watch on YouTube](https://www.youtube.com/results?search_query=RRB+JE+Electrical+DC+Circuits+Network+Theorems)

* **Testbook SuperCoaching:** *SSC JE / RRB JE Network Theorems Complete Revision*
  * **Why it's the best:** Rapid coverage of Maximum Power Transfer Theorem, Delta-Star conversions, and tricky multi-mesh questions.
  * [Watch on YouTube](https://www.youtube.com/results?search_query=Testbook+RRB+JE+Electrical+Circuit+Theory)

* **All India JE/AE Crash Series:** *Basic Electrical Engineering for Railway ALP & JE*
  * **Why it's the best:** Crystal-clear Hindi-English bilingual explanations emphasizing unit conversions, SI definitions, and railway exam traps.
  * [Watch on YouTube](https://www.youtube.com/results?search_query=RRB+ALP+Basic+Electrical+Engineering+PYQ+Revision)`,
};

// Curated Sample PYQ Question Sets that users can load for instant practice testing
export const SAMPLE_PYQ_TEMPLATES = [
  {
    title: 'RRB JE CBT-1 (Maths & General Science 2024 Memory Based)',
    exam: 'RRB JE (Junior Engineer)',
    stage: 'CBT-1',
    content: `Q1. A train running at 72 km/h crosses a 250 m long platform in 25 seconds. What is the length of the train?
Options: (A) 250 m (B) 200 m (C) 300 m (D) 150 m

Q2. What is the equivalent resistance between terminals A and B of a symmetrical circuit where three 6 ohm resistors are connected in delta?
Options: (A) 2 ohm (B) 4 ohm (C) 6 ohm (D) 18 ohm

Q3. The value of acceleration due to gravity 'g' is maximum at:
Options: (A) Equator (B) Poles (C) Center of Earth (D) An altitude of 100 km

Q4. If 12 men can complete a railway track maintenance work in 18 days, in how many days can 18 men complete the same work?
Options: (A) 10 days (B) 12 days (C) 14 days (D) 15 days

Q5. Which of the following is an example of a first-order lever?
Options: (A) Wheelbarrow (B) Pair of scissors (C) Nutcracker (D) Human arm lifting a weight`,
  },
  {
    title: 'RRB ALP CBT-2 (Basic Science & Engineering - Simple Machines & Heat)',
    exam: 'RRB ALP (Assistant Loco Pilot & Tech)',
    stage: 'CBT-2',
    content: `Q1. In a simple machine, a load of 600 N is lifted by an effort of 150 N. The velocity ratio of the machine is 5. What is the efficiency of the machine?
Options: (A) 75% (B) 80% (C) 85% (D) 90%

Q2. Convert -40 degrees Celsius to Fahrenheit scale:
Options: (A) -40°F (B) 0°F (C) 32°F (D) -32°F

Q3. What is the SI unit of specific heat capacity?
Options: (A) J/kg (B) J/(kg·K) (C) J·K/kg (D) W/(m·K)

Q4. Which projection method is officially adopted for Engineering Drawings in Indian Standards (BIS)?
Options: (A) First Angle Projection (B) Third Angle Projection (C) Isometric Projection only (D) Oblique Projection

Q5. If the mechanical advantage of a lever is greater than 1, it implies:
Options: (A) Effort arm > Load arm (B) Load arm > Effort arm (C) Velocity ratio < 1 (D) Efficiency > 100%`,
  },
  {
    title: 'SSC CHSL Tier-1 (Quantitative Aptitude & Reasoning 2024 Shift 2)',
    exam: 'SSC CHSL (10+2 Level)',
    stage: 'Tier-1',
    content: `Q1. If x + 1/x = 4, then find the value of x^3 + 1/x^3:
Options: (A) 52 (B) 64 (C) 48 (D) 56

Q2. The difference between compound interest and simple interest on a sum of Rs. 15,000 for 2 years at 10% per annum is:
Options: (A) Rs. 150 (B) Rs. 120 (C) Rs. 180 (D) Rs. 200

Q3. In a circle with center O, two tangents PA and PB are drawn from an external point P. If angle APB = 70 degrees, find angle AOB:
Options: (A) 110° (B) 120° (C) 140° (D) 90°

Q4. Select the letter-cluster that can replace the question mark (?) in the following series: BDF, CFI, DHL, ?
Options: (A) EJO (B) EKP (C) FLO (D) EMP

Q5. By selling an article for Rs. 720, a shopkeeper loses 10%. At what price should he sell it to gain 15%?
Options: (A) Rs. 920 (B) Rs. 880 (C) Rs. 900 (D) Rs. 950`,
  },
  {
    title: 'SSC JE Paper-1 (General Engineering Mechanics & Materials)',
    exam: 'SSC JE (Junior Engineer)',
    stage: 'Paper-1',
    content: `Q1. For a simply supported beam of length L carrying a central point load W, the maximum bending moment occurs at the mid-span and is equal to:
Options: (A) WL/4 (B) WL/8 (C) WL/2 (D) WL^2/8

Q2. According to Hooke's Law, stress is directly proportional to strain up to:
Options: (A) Proportional Limit (B) Elastic Limit (C) Yield Point (D) Ultimate Stress Point

Q3. The maximum efficiency of a screw jack with angle of friction phi is:
Options: (A) (1 - sin phi) / (1 + sin phi) (B) (1 + sin phi) / (1 - sin phi) (C) tan phi (D) 1 - tan phi

Q4. In an ideal transformer, which of the following remains constant from primary to secondary winding?
Options: (A) Frequency and Power (B) Voltage and Current (C) Resistance and Inductance (D) Magnetic Flux only

Q5. Slump test for concrete is used to measure its:
Options: (A) Workability (B) Compressive strength (C) Tensile strength (D) Durability`,
  },
];
