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

function parseArguments(args) {
  let runLabel = "local";
  let argumentIndex = 0;
  const caseIds = [];

  if (
    args[0] &&
    !args[0].startsWith("--")
  ) {
    runLabel = args[0];
    argumentIndex = 1;
  }

  while (argumentIndex < args.length) {
    const argument = args[argumentIndex];

    if (argument !== "--case") {
      throw new Error(
        `Unknown argument: ${argument}`,
      );
    }

    const caseId =
      args[argumentIndex + 1];

    if (
      !caseId ||
      caseId.startsWith("--")
    ) {
      throw new Error(
        "--case requires an evaluation case ID.",
      );
    }

    caseIds.push(caseId);
    argumentIndex += 2;
  }

  return {
    runLabel,
    caseIds: [...new Set(caseIds)],
  };
}

async function loadExpectations() {
  const contents = await readFile(
    expectationsPath,
    "utf8",
  );

  return JSON.parse(contents);
}

function evaluateResult(result) {
  const failures = [];

  if (!result.success) {
    failures.push(
      result.httpStatus === null
        ? "The review request did not complete."
        : `The API returned HTTP ${result.httpStatus}.`,
    );
  }

  if (result.actualScore === null) {
    failures.push(
      "The response did not contain a numeric overall score.",
    );
  } else {
    const { min, max } =
      result.expectedScoreRange;

    if (
      result.actualScore < min ||
      result.actualScore > max
    ) {
      failures.push(
        `Score ${result.actualScore} is outside the expected range ${min}-${max}.`,
      );
    }
  }

  return {
    passed: failures.length === 0,
    failures,
    qualitativeReviewRequired: true,
  };
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
        body: JSON.stringify({sql,dialect: testCase.dialect,}),
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

    const result = {
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

    return {
      ...result,
      evaluation: evaluateResult(result),
    };
  } catch (error) {
    const durationMs = Math.round(
      performance.now() - startedAt,
    );

    const result = {
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

    return {
      ...result,
      evaluation: evaluateResult(result),
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
  const {
    runLabel,
    caseIds,
  } = parseArguments(
    process.argv.slice(2),
  );

  const allExpectations =
    await loadExpectations();

  const unknownCaseIds = caseIds.filter(
    (caseId) =>
      !allExpectations.some(
        (testCase) =>
          testCase.id === caseId,
      ),
  );

  if (unknownCaseIds.length > 0) {
    throw new Error(
      `Unknown evaluation case${
        unknownCaseIds.length === 1
          ? ""
          : "s"
      }: ${unknownCaseIds.join(", ")}`,
    );
  }

  const expectations =
    caseIds.length === 0
      ? allExpectations
      : allExpectations.filter(
          (testCase) =>
            caseIds.includes(testCase.id),
        );

  await ensureServerAvailable();

  const startedAt = new Date();

  console.log(
    `Running ${expectations.length} evaluation cases against ${baseUrl}`,
  );

  console.log(`Run label: ${runLabel}`);

  if (caseIds.length > 0) {
    console.log(
      `Selected cases: ${caseIds.join(", ")}`,
    );
  }

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

    const status = result.evaluation.passed
      ? "PASS"
      : "FAIL";

    console.log(
      `Completed in ${result.durationMs}ms — status ${result.httpStatus ?? "error"} — score ${score} — ${status}`,
    );

    for (const failure of result.evaluation.failures) {
      console.log(`  - ${failure}`);
    }

    console.log("");
  }

  const completedAt = new Date();

  const successfulResults = results.filter(
    (result) => result.success,
  );

  const passedResults = results.filter(
    (result) => result.evaluation.passed,
  );

  const failedResults = results.filter(
    (result) => !result.evaluation.passed,
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
    selectedCaseIds: caseIds,
    averageDurationMs,
    summary: {
      total: results.length,
      passed: passedResults.length,
      failed: failedResults.length,
      qualitativeReviewRequired: true,
    },
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
      result: result.evaluation.passed
        ? "PASS"
        : "FAIL",
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

  console.log(
    `Automated checks: ${passedResults.length} passed, ${failedResults.length} failed.`,
  );

  console.log(
    "Qualitative review of required findings and forbidden claims is still required.",
  );

  console.log(`Results saved to ${resultPath}`);

  if (failedResults.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Evaluation run failed:", error);
  process.exitCode = 1;
});