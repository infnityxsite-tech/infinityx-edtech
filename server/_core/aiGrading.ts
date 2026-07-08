/**
 * AI Auto-Grading Provider Layer
 * 
 * Uses Groq as primary provider (fast inference, good JSON mode)
 * Falls back to Gemini if Groq fails or hits rate limits
 */

import { z } from "zod";

// ─── ENVIRONMENT ──────────────────────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

// ─── GRADING RESULT SCHEMA ───────────────────────────────────────────────────

export const GradingResultSchema = z.object({
  score: z.number().min(0).max(100),
  maxScore: z.number().default(100),
  percentage: z.number().min(0).max(100),
  status: z.enum(["pass", "fail", "review"]),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  rubricBreakdown: z.array(z.object({
    criterion: z.string(),
    score: z.number(),
    maxScore: z.number(),
    comment: z.string(),
  })).optional().default([]),
});

export type GradingResult = z.infer<typeof GradingResultSchema>;

// ─── FILE PARSING ─────────────────────────────────────────────────────────────

export function parseFileContent(buffer: Buffer, fileName: string, mimeType: string): string {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  const MAX_CHARS = 20000;

  if (['txt', 'py', 'csv', 'js', 'ts', 'java', 'c', 'cpp', 'html', 'css', 'r', 'sql', 'md'].includes(ext)) {
    return buffer.toString('utf-8').substring(0, MAX_CHARS);
  }

  if (ext === 'ipynb') {
    try {
      const notebook = JSON.parse(buffer.toString('utf-8'));
      const cells = notebook.cells || [];
      const content = cells.map((cell: any) => {
        const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        return `[${cell.cell_type}]\n${source}`;
      }).join('\n\n---\n\n');
      return content.substring(0, MAX_CHARS);
    } catch {
      return buffer.toString('utf-8').substring(0, MAX_CHARS);
    }
  }

  if (ext === 'json') {
    return buffer.toString('utf-8').substring(0, MAX_CHARS);
  }

  // For unsupported types, attempt text extraction
  return buffer.toString('utf-8').substring(0, MAX_CHARS);
}

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────

export function buildGradingPrompt(params: {
  instructions: string;
  rubric: string;
  maxScore: number;
  studentContent: string;
  fileName: string;
}): string {
  return `You are an AI teaching assistant evaluating a student's assignment submission.

## Assignment Instructions (given to the student)
${params.instructions || "No specific instructions provided."}

## Grading Rubric (used for evaluation)
${params.rubric || "Evaluate overall quality, correctness, and effort."}

## Student Submission
File: ${params.fileName}
\`\`\`
${params.studentContent}
\`\`\`

## Your Task
Evaluate the student's work against the rubric. Be fair, constructive, and specific.
The maximum score is ${params.maxScore}.

Respond with a JSON object with this EXACT structure:
{
  "score": <number 0-${params.maxScore}>,
  "maxScore": ${params.maxScore},
  "percentage": <number 0-100>,
  "status": "<pass|fail|review>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "suggestions": ["<improvement suggestion 1>", "<suggestion 2>", ...],
  "rubricBreakdown": [
    {"criterion": "<name>", "score": <number>, "maxScore": <number>, "comment": "<feedback>"}
  ]
}

Status should be "pass" if percentage >= 60, "fail" if < 40, and "review" otherwise.
Respond ONLY with the JSON object, no markdown formatting or extra text.`;
}

// ─── PROVIDER: GROQ ──────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<{ content: string; model: string; promptTokens: number; completionTokens: number }> {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert AI teaching assistant. You evaluate student submissions and respond strictly in JSON format." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errorText}`);
  }

  const data: any = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || "",
    model: data.model || "llama-3.3-70b-versatile",
    promptTokens: data.usage?.prompt_tokens || 0,
    completionTokens: data.usage?.completion_tokens || 0,
  };
}

// ─── PROVIDER: GEMINI ─────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<{ content: string; model: string; promptTokens: number; completionTokens: number }> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

  const modelName = "gemini-2.0-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data: any = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return {
    content,
    model: modelName,
    promptTokens: data.usageMetadata?.promptTokenCount || 0,
    completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
  };
}

// ─── PROVIDER: DEEPSEEK ───────────────────────────────────────────────────────

async function callDeepSeek(prompt: string): Promise<{ content: string; model: string; promptTokens: number; completionTokens: number }> {
  if (!DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not configured");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert AI teaching assistant. Evaluate student submissions and respond strictly in JSON format." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
  }

  const data: any = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || "",
    model: data.model || "deepseek-chat",
    promptTokens: data.usage?.prompt_tokens || 0,
    completionTokens: data.usage?.completion_tokens || 0,
  };
}

// ─── MAIN EVALUATION FUNCTION ─────────────────────────────────────────────────

export async function evaluateSubmission(params: {
  instructions: string;
  rubric: string;
  maxScore: number;
  studentContent: string;
  fileName: string;
}): Promise<{ result: GradingResult; providerUsed: string; modelUsed: string; promptTokens: number; completionTokens: number }> {
  const prompt = buildGradingPrompt(params);

  // Provider chain: Groq → Gemini → DeepSeek
  const providers = [
    { name: "groq", call: callGroq },
    { name: "gemini", call: callGemini },
    { name: "deepseek", call: callDeepSeek },
  ].filter(p => {
    if (p.name === "groq") return !!GROQ_API_KEY;
    if (p.name === "gemini") return !!GEMINI_API_KEY;
    if (p.name === "deepseek") return !!DEEPSEEK_API_KEY;
    return false;
  });

  if (providers.length === 0) {
    throw new Error("No AI providers configured. Set GROQ_API_KEY, GEMINI_API_KEY, or DEEPSEEK_API_KEY.");
  }

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`[AI Grading] Trying provider: ${provider.name}`);
      const response = await provider.call(prompt);

      // Parse and validate the response
      let parsed: any;
      try {
        // Clean the response — some models wrap in markdown code blocks
        let cleaned = response.content.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
        if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
        if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
        parsed = JSON.parse(cleaned.trim());
      } catch (parseErr) {
        console.error(`[AI Grading] JSON parse failed for ${provider.name}:`, parseErr);
        lastError = new Error(`${provider.name} returned invalid JSON`);
        continue;
      }

      // Validate against Zod schema
      const validationResult = GradingResultSchema.safeParse(parsed);
      if (!validationResult.success) {
        console.error(`[AI Grading] Schema validation failed for ${provider.name}:`, validationResult.error.issues);
        lastError = new Error(`${provider.name} response failed schema validation`);
        continue;
      }

      console.log(`[AI Grading] ✅ Success with ${provider.name} — Score: ${validationResult.data.score}/${validationResult.data.maxScore}`);

      return {
        result: validationResult.data,
        providerUsed: provider.name,
        modelUsed: response.model,
        promptTokens: response.promptTokens,
        completionTokens: response.completionTokens,
      };

    } catch (err: any) {
      console.error(`[AI Grading] Provider ${provider.name} failed:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("All AI providers failed");
}
