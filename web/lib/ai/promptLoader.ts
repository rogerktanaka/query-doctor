import { readFile } from "node:fs/promises";
import path from "node:path";

const PROMPTS_DIRECTORY = path.resolve(
  process.cwd(),
  "prompts",
);

export async function loadPrompt(
  promptName: string,
): Promise<string> {
  const promptPath = path.join(
    PROMPTS_DIRECTORY,
    promptName,
  );

  const prompt = await readFile(
    promptPath,
    "utf-8",
  );

  return prompt.trim();
}