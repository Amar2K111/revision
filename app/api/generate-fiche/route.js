import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMath3eDirectiveByTopic } from "../../../data/math3emeExpertDirectives";
import {
  buildGeminiUserMessage,
  GENERIC_EXPERT_DIRECTIVE,
  getFlashRevisSystemPrompt,
} from "../../../lib/flashRevisPrompt";

/** Modèle stable conseillé ; `gemini-1.5-flash` n’est plus disponible sur l’API v1beta. */
const DEFAULT_MODEL = "gemini-2.5-flash";

function examLabelFromClassId(classId) {
  if (classId === "term") return "Bac";
  if (classId === "bts2") return "BTS";
  return "Brevet";
}

function resolveExpertDeepening(classId, subjectId, topicLabel) {
  if (classId === "3e" && subjectId === "math") {
    const row = getMath3eDirectiveByTopic(topicLabel);
    if (row) {
      return { directive: row.directive, expertId: row.id };
    }
  }
  return { directive: GENERIC_EXPERT_DIRECTIVE, expertId: null };
}

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    return Response.json(
      { error: "Clé API absente (GEMINI_API_KEY dans .env.local)." },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const {
    classId,
    classLabel,
    subjectId,
    subjectName,
    topicLabel,
  } = body ?? {};

  if (!classId || !classLabel || !subjectId || !subjectName || !topicLabel) {
    return Response.json(
      { error: "Paramètres manquants (classe, matière, notion)." },
      { status: 400 },
    );
  }

  const { directive, expertId } = resolveExpertDeepening(
    classId,
    subjectId,
    topicLabel,
  );

  const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: getFlashRevisSystemPrompt(),
  });

  const userText = buildGeminiUserMessage({
    classLabel,
    subjectName,
    topicLabel,
    examLabel: examLabelFromClassId(classId),
    expertDirective: directive,
  });

  try {
    const result = await model.generateContent(userText);
    const markdown = result.response.text()?.trim() ?? "";

    if (!markdown) {
      return Response.json({
        error: "Réponse vide du modèle. Réessaie ou définis GEMINI_MODEL dans .env.local.",
      }, { status: 502 });
    }

    return Response.json({
      markdown,
      meta: {
        classLabel,
        subjectName,
        topicLabel,
        exam: classId === "term" ? "bac" : classId === "bts2" ? "bts" : "brevet",
        expertId,
        model: modelName,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erreur lors de la génération.";
    return Response.json({ error: message }, { status: 502 });
  }
}
