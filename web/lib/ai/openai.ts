import OpenAI from "openai";

let openAIClient: OpenAI | undefined;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured.",
    );
  }

  openAIClient ??= new OpenAI({
    apiKey,
  });

  return openAIClient;
}

export function getOpenAIModel(): string {
  const model = process.env.OPENAI_MODEL;

  if (!model) {
    throw new Error(
      "OPENAI_MODEL is not configured.",
    );
  }

  return model;
}