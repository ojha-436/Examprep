import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json({ limit: '15mb' }));

// In-Memory Rate Limiting
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // 25 requests per minute

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return res.status(429).json({
      error: `Rate limit reached to protect API quotas. Please wait ${retryAfterSec} seconds before generating again.`,
    });
  }

  record.count += 1;
  next();
}

// Prompt Injection Sanitizer
function sanitizeInput(text: unknown, maxLength = 160): string {
  if (typeof text !== 'string') return '';
  let sanitized = text.trim();
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }
  // Strip control characters & dangerous injection phrases
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  const forbiddenPatterns = [
    /ignore (all )?previous instructions/gi,
    /disregard (all )?prior prompts/gi,
    /you are now a bypass/gi,
    /jailbreak/gi,
    /system prompt/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
  ];
  for (const pattern of forbiddenPatterns) {
    sanitized = sanitized.replace(pattern, '[sanitized]');
  }
  return sanitized;
}

// Curated Exam Data for Fallbacks & Quick Presets
export const EXAM_PRESETS = [
  { id: 'jee', name: 'JEE Main & Advanced', category: 'Engineering' },
  { id: 'neet', name: 'NEET UG', category: 'Medical' },
  { id: 'gate', name: 'GATE CSE / ECE / ME', category: 'Engineering' },
  { id: 'upsc', name: 'UPSC Civil Services (CSE)', category: 'Civil Services' },
  { id: 'sat', name: 'SAT Digital (Math & Reading)', category: 'College Board' },
  { id: 'gre', name: 'GRE General', category: 'Graduate' },
  { id: 'gmat', name: 'GMAT Focus Edition', category: 'Graduate' },
  { id: 'mcat', name: 'MCAT', category: 'Medical' },
  { id: 'cfa', name: 'CFA Level 1', category: 'Finance' },
  { id: 'ap_calc', name: 'AP Calculus BC', category: 'College Board' },
  { id: 'ap_phys', name: 'AP Physics C', category: 'College Board' },
  { id: 'ssc', name: 'SSC CGL', category: 'Govt & Banking' },
];

// POST /api/generate - Core AI Wrapper Engine
app.post('/api/generate', rateLimiter, async (req, res) => {
  try {
    const rawExam = req.body.exam;
    const rawTopic = req.body.topic;
    const mode = (req.body.mode as string) || 'comprehensive'; // 'cram' | 'comprehensive' | 'formulas' | 'traps'

    const exam = sanitizeInput(rawExam, 80);
    const topic = sanitizeInput(rawTopic, 120);

    if (!exam || exam.length < 2) {
      return res.status(400).json({ error: 'Please provide a valid exam name (e.g. JEE Main, NEET, SAT, UPSC).' });
    }
    if (!topic || topic.length < 2) {
      return res.status(400).json({ error: 'Please provide a specific topic or chapter (e.g. Rotational Motion, Bayes Theorem, Fundamental Rights).' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please check environment variables.',
      });
    }

    // High-yield Hidden System Prompt enforcing the 4 Core Pillars
    const systemInstruction = `You are a legendary top-percentile competitive exam tutor and senior pedagogy architect specializing in ${exam}.
Your task is to produce an ultra-high-yield, masterclass-level Revision Note and Cheat-Sheet for candidates preparing for ${exam} on the topic: "${topic}".

STRICT ARCHITECTURAL REQUIREMENTS:
You MUST structure the cheat sheet using EXACTLY these 4 pillars with their emojis and titles:

## 1. 🧠 Core Knowledge Base (Architecture & Logic)
- Break down the core foundational concepts, first principles, and operational rules governing this topic for ${exam}.
- Use structured mental models, bullet points, and high-clarity comparisons.
- Avoid vague textbook fluff; focus only on what is tested.

## 2. ⚡ Shortcut Formulas & Time-Savers
- Provide all must-memorize equations, scaling laws, mental calculation shortcuts, and speed tricks.
- FORMAT ALL MATHEMATICAL EQUATIONS IN LaTeX using standard single dollar signs for inline math ($E = mc^2$, $S \\propto \\frac{1}{T}$, $D = S \\times T$) and double dollar signs for block equations ($$\\int_a^b f(x) dx$$).
- Include variable definitions, SI units/dimensional checks, and boundary condition shortcuts (e.g. what happens when $t \\to \\infty$ or $x=0$).

## 3. 🎯 High-Frequency Application Patterns & Examiner Traps
- Detail the exact question prototypes and standard patterns that appear repeatedly in ${exam}.
- Scoring traps: explicitly point out deceptive options, sign errors, units traps, and common misconceptions where 80% of test-takers lose marks.
- Strategy & Elimination rules for this specific topic to save 30-60 seconds per problem.

## 4. 📺 Top Video Resources (Search Grounded)
- Recommend 3 to 4 best-in-class, top-rated YouTube tutorials, marathon lectures, or animated concept explainers specifically for "${exam} ${topic}".
- For each recommendation, provide:
  - **Video/Channel Title**: exact creator or course (e.g. Khan Academy, 3Blue1Brown, Physics Galaxy, Mohit Tyagi, CrashCourse, Organic Chemistry Tutor, etc.)
  - **Why it's the best**: concise 1-2 sentence justification.
  - **Direct search or video URL**: formatted as a markdown link [Watch on YouTube](https://www.youtube.com/results?search_query=...).

ADDITIONAL MODE DIRECTIVE:
${
  mode === 'cram'
    ? 'TARGET DEPTH: ⚡ Ultra 3-Minute Pre-Exam Cram Sheet. Extreme conciseness, telegraphic style, bulleted summaries, zero filler.'
    : mode === 'formulas'
    ? 'TARGET DEPTH: 📐 Formula & Math Speed Sheet. Heavily emphasize equations in LaTeX, derivative shortcuts, mnemonics, and dimension analysis.'
    : mode === 'traps'
    ? 'TARGET DEPTH: ⚠️ Examiner Traps & Error Buster. Focus 60% of the content on deceptive trick questions, edge cases, and option elimination heuristics.'
    : 'TARGET DEPTH: 🏆 Complete High-Yield Master Revision Sheet. Balanced, rigorous, comprehensive, with deep conceptual clarity.'
}`;

    const userPrompt = `Generate the definitive competitive exam revision note for:
Exam: ${exam}
Topic: ${topic}
Mode: ${mode}

Leverage Google Search to verify recent ${exam} question trends and top YouTube revision tutorials for this exact topic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.35,
      },
    });

    const markdownContent = response.text || '';
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract grounding search queries and web sources if available
    const webSources: Array<{ title: string; url: string }> = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          webSources.push({
            title: chunk.web.title || 'Related Resource',
            url: chunk.web.uri,
          });
        }
      }
    }

    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];

    res.json({
      success: true,
      exam,
      topic,
      mode,
      content: markdownContent,
      groundingSources: webSources.slice(0, 6),
      searchQueries,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate revision cheat-sheet. Please try again.',
    });
  }
});

// POST /api/quiz - Generate 5 High-Yield Diagnostic Multiple Choice Questions
app.post('/api/quiz', rateLimiter, async (req, res) => {
  try {
    const rawExam = req.body.exam;
    const rawTopic = req.body.topic;
    const exam = sanitizeInput(rawExam, 80);
    const topic = sanitizeInput(rawTopic, 120);

    if (!exam || !topic) {
      return res.status(400).json({ error: 'Exam and topic are required.' });
    }

    const systemInstruction = `You are an elite item writer and examiner for ${exam}.
Generate exactly 5 authentic, exam-level multiple-choice questions (MCQs) for the topic "${topic}".
Each question must test high-frequency concepts, real exam traps, or shortcut calculation speed.
Questions must be realistic, challenging, and strictly adhere to ${exam} difficulty.
Format math formulas with standard LaTeX notation ($...$).`;

    const prompt = `Create 5 MCQs for ${exam} on ${topic} with 4 options (A, B, C, D), correct option index (0 for A, 1 for B, 2 for C, 3 for D), and an in-depth step-by-step explanation including the shortcut solution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  examTrap: { type: Type.STRING, description: 'The trap or misconception that leads to the wrong option' },
                  difficulty: { type: Type.STRING, description: 'Easy | Medium | Hard | Trap-Heavy' },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'examTrap', 'difficulty'],
              },
            },
          },
          required: ['quizTitle', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate quiz. Please try again.',
    });
  }
});

// POST /api/ask-doubt - Targeted Doubt Clearing on Specific Formula or Concept
app.post('/api/ask-doubt', rateLimiter, async (req, res) => {
  try {
    const rawExam = req.body.exam;
    const rawTopic = req.body.topic;
    const rawDoubt = req.body.doubt;
    const cheatSheetSnippet = typeof req.body.snippet === 'string' ? req.body.snippet.slice(0, 1000) : '';

    const exam = sanitizeInput(rawExam, 80);
    const topic = sanitizeInput(rawTopic, 120);
    const doubt = sanitizeInput(rawDoubt, 400);

    if (!doubt || doubt.length < 3) {
      return res.status(400).json({ error: 'Please enter your doubt or question.' });
    }

    const systemInstruction = `You are a brilliant ${exam} tutor. A student is asking a doubt about the topic "${topic}".
Answer directly, concisely, and with maximum clarity.
Provide intuition, step-by-step mathematical breakdown in LaTeX ($...$), and an example or mnemonic if applicable.
Keep your answer under 250 words so the student can absorb it immediately during revision.`;

    const prompt = `Context snippet from revision sheet:
"""${cheatSheetSnippet}"""

Student Doubt:
"${doubt}"

Explain with crystal-clear logic, formula derivations if required, and a quick mnemonic or trick.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({
      success: true,
      answer: response.text || 'Unable to generate an answer at this time.',
    });
  } catch (error: any) {
    console.error('Error in /api/ask-doubt:', error);
    res.status(500).json({
      error: error?.message || 'Failed to resolve doubt.',
    });
  }
});

// POST /api/analyze-pyq - Multimodal / Text Previous Year Question (PYQ) Pattern Extractor & Practice Generator
app.post('/api/analyze-pyq', rateLimiter, async (req, res) => {
  try {
    const rawExam = req.body.exam || 'RRB JE';
    const rawStage = req.body.stage || 'CBT-1';
    const rawTopic = req.body.topic || '';
    const questionCount = Math.min(Math.max(Number(req.body.questionCount) || 5, 3), 15);
    const pyqText = typeof req.body.pyqText === 'string' ? req.body.pyqText.slice(0, 8000) : '';
    const fileBase64 = typeof req.body.fileBase64 === 'string' ? req.body.fileBase64 : null;
    const fileMimeType = typeof req.body.fileMimeType === 'string' ? req.body.fileMimeType : 'image/jpeg';

    const exam = sanitizeInput(rawExam, 80);
    const stage = sanitizeInput(rawStage, 40);
    const topic = sanitizeInput(rawTopic, 120);

    if (!fileBase64 && (!pyqText || pyqText.trim().length < 10)) {
      return res.status(400).json({
        error: 'Please provide either Previous Year Question text or upload a PYQ paper image/PDF.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const systemInstruction = `You are a Senior Question Paper Setter and Chief Evaluator for Indian Government Competitive Examinations: ${exam} (${stage}).
Your job is:
1. Thoroughly parse and inspect the provided Previous Year Question (PYQ) text or uploaded question paper image/document.
2. Determine:
   - Topic distribution and recurrent syllabus concepts tested
   - Difficulty level (Easy, Moderate, High-Trap)
   - Official CBT marking scheme (e.g. RRB JE/ALP: +1 correct, -0.33 negative marking; SSC CHSL: +2 correct, -0.50 negative; SSC JE Paper 1: +1 correct, -0.25 negative)
3. Generate an authentic, official CBT Practice Test of exactly ${questionCount} questions meticulously calibrated to the EXACT style, phrasing, calculations, options, and distractor traps found in these PYQs.
Format all equations with standard LaTeX ($...$).`;

    const promptText = `Analyze these Previous Year Questions (PYQs) for ${exam} (${stage}${topic ? ` - Topic: ${topic}` : ''}):
${pyqText ? `"""\n${pyqText}\n"""` : 'Refer to the attached PYQ document/image.'}

Synthesize a comprehensive PYQ pattern analysis and generate ${questionCount} authentic exam-accurate practice questions with 4 options, the exact official negative marking penalty, step-by-step solution, shortcut speed-method, and the specific examiner trap that causes negative marks.`;

    // Construct contents (multimodal if file provided, text otherwise)
    let contentsPayload: any;
    if (fileBase64) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: fileMimeType,
            },
          },
          { text: promptText },
        ],
      };
    } else {
      contentsPayload = promptText;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pyqAnalysis: {
              type: Type.OBJECT,
              properties: {
                paperIdentified: { type: Type.STRING },
                patternSummary: { type: Type.STRING },
                topicsDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                markingScheme: {
                  type: Type.OBJECT,
                  properties: {
                    positiveMarks: { type: Type.NUMBER },
                    negativeMarks: { type: Type.NUMBER },
                    timeLimitMinutes: { type: Type.NUMBER },
                  },
                  required: ['positiveMarks', 'negativeMarks', 'timeLimitMinutes'],
                },
              },
              required: ['paperIdentified', 'patternSummary', 'topicsDetected', 'markingScheme'],
            },
            practiceSet: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  topic: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  shortcutMethod: { type: Type.STRING },
                  examinerTrap: { type: Type.STRING },
                },
                required: [
                  'id',
                  'question',
                  'options',
                  'correctIndex',
                  'topic',
                  'difficulty',
                  'explanation',
                  'shortcutMethod',
                  'examinerTrap',
                ],
              },
            },
          },
          required: ['pyqAnalysis', 'practiceSet'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      exam,
      stage,
      ...parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-pyq:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze PYQ and generate practice set.',
    });
  }
});

// GET /api/health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ExamPrep AI Server] Listening on port ${PORT} (isProduction=${isProduction})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
