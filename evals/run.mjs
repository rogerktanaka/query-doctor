import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const evalsDirectory = path.dirname(currentFile);
const projectDirectory = path.dirname(evalsDirectory);

const casesDirectory = path.join(
  evalsDirectory,
  "cases",
);

const resultsDirectory = path.join(
  evalsDirectory,
  "results",
);

const expectationsPath = path.join(
  evalsDirectory,
  "expectations.json",
);

const baseUrl =
  process.env.EVAL_BASE_URL ??
  "http://localhost:3000";

const runLabel =
  process.argv[2] ?? "local";

async function loadExpectations() {
  const contents = await readFile(
    expectationsPath,
    "utf8",
  );

  return JSON.parse(contents);
}

async function runCase(testCase) {
  const sqlPath = path.join(
    casesDirectory,
    `${testCase.id}.sql`,
  );

  const sql = await readFile(sqlPath, "utf8");
  const startedAt = performance.now();

  try {
    const response = await fetch(
      `${baseUrl}/api/review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      },
    );

    const durationMs = Math.round(
      performance.now() - startedAt,
    );

    const responseText = await response.text();

    let payload;

    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = {
        error: "Response was not valid JSON.",
        rawResponse: responseText,
      };
    }

    return {
      id: testCase.id,
      name: testCase.name,
      dialect: testCase.dialect,
      durationMs,
      httpStatus: response.status,
      success: response.ok,
      expectedScoreRange: testCase.scoreRange,
      actualScore:
        response.ok &&
        typeof payload.overallScore === "number"
          ? payload.overallScore
          : null,
      expectations: {
        requiredFindings:
          testCase.requiredFindings,
        forbiddenClaims:
          testCase.forbiddenClaims,
      },
      review: response.ok ? payload : null,
      error: response.ok ? null : payload,
    };
  } catch (error) {
    const durationMs = Math.round(
      performance.now() - startedAt,
    );

    return {
      id: testCase.id,
      name: testCase.name,
      dialect: testCase.dialect,
      durationMs,
      httpStatus: null,
      success: false,
      expectedScoreRange: testCase.scoreRange,
      actualScore: null,
      expectations: {
        requiredFindings:
          testCase.requiredFindings,
        forbiddenClaims:
          testCase.forbiddenClaims,
      },
      review: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unknown evaluation error.",
      },
    };
  }
}

async function ensureServerAvailable() {
  try {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error(
        `Server returned HTTP ${response.status}.`,
      );
    }
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message
        : "Unknown connection error.";

    throw new Error(
      [
        `Query Doctor is not available at ${baseUrl}.`,
        "Start the development server with:",
        "cd web && npm run dev",
        `Reason: ${reason}`,
      ].join("\n"),
    );
  }
}


async function main() {
  
  await ensureServerAvailable();

  const expectations = await loadExpectations();
  const startedAt = new Date();

  console.log(
    `Running ${expectations.length} evaluation cases against ${baseUrl}`,
  );

  console.log(`Run label: ${runLabel}`);
  console.log("");

  const results = [];

  for (const testCase of expectations) {
    console.log(
      `Running ${testCase.id}: ${testCase.name}`,
    );

    const result = await runCase(testCase);
    results.push(result);

    const score =
      result.actualScore === null
        ? "-"
        : result.actualScore.toFixed(1);

    console.log(
      `Completed in ${result.durationMs}ms — status ${result.httpStatus ?? "error"} — score ${score}`,
    );

    console.log("");
  }

  const completedAt = new Date();

  const successfulResults = results.filter(
    (result) => result.success,
  );

  const averageDurationMs =
    successfulResults.length > 0
      ? Math.round(
          successfulResults.reduce(
            (total, result) =>
              total + result.durationMs,
            0,
          ) / successfulResults.length,
        )
      : null;

  const run = {
    label: runLabel,
    baseUrl,
    projectDirectory,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    averageDurationMs,
    results,
  };

  await mkdir(resultsDirectory, {
    recursive: true,
  });

  const timestamp = startedAt
    .toISOString()
    .replaceAll(":", "-")
    .replaceAll(".", "-");

  const resultPath = path.join(
    resultsDirectory,
    `${timestamp}-${runLabel}.json`,
  );

  await writeFile(
    resultPath,
    `${JSON.stringify(run, null, 2)}\n`,
    "utf8",
  );

  console.table(
    results.map((result) => ({
      id: result.id,
      status: result.httpStatus ?? "error",
      durationMs: result.durationMs,
      score: result.actualScore ?? "-",
      expected:
        `${result.expectedScoreRange.min}-${result.expectedScoreRange.max}`,
    })),
  );

  console.log(
    `Average duration: ${averageDurationMs ?? "-"}ms`,
  );

  console.log(`Results saved to ${resultPath}`);
}

main().catch((error) => {
  console.error("Evaluation run failed:", error);
  process.exitCode = 1;
});