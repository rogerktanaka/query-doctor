import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(
  import.meta.url,
);

const evalsDirectory =
  path.dirname(currentFile);

const projectDirectory =
  path.dirname(evalsDirectory);

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

function parseIntegerHeader(
  response,
  headerName,
) {
  const value =
    response.headers.get(headerName);

  if (value === null) {
    return null;
  }

  const parsed = Number.parseInt(
    value,
    10,
  );

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return null;
  }

  return parsed;
}

function parseDecimalHeader(
  response,
  headerName,
) {
  const value =
    response.headers.get(headerName);

  if (value === null) {
    return null;
  }

  const parsed = Number.parseFloat(value);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return null;
  }

  return parsed;
}

function readApiMetrics(response) {
  const model =
    response.headers.get(
      "x-query-doctor-model",
    );

  const inputTokens =
    parseIntegerHeader(
      response,
      "x-query-doctor-input-tokens",
    );

  const cachedInputTokens =
    parseIntegerHeader(
      response,
      "x-query-doctor-cached-input-tokens",
    );

  const cacheWriteTokens =
    parseIntegerHeader(
      response,
      "x-query-doctor-cache-write-tokens",
    );

  const outputTokens =
    parseIntegerHeader(
      response,
      "x-query-doctor-output-tokens",
    );

  const reasoningTokens =
    parseIntegerHeader(
      response,
      "x-query-doctor-reasoning-tokens",
    );

  const totalTokens =
    parseIntegerHeader(
      response,
      "x-query-doctor-total-tokens",
    );

  const usageValues = [
    inputTokens,
    cachedInputTokens,
    cacheWriteTokens,
    outputTokens,
    reasoningTokens,
    totalTokens,
  ];

  const usage =
    usageValues.every(
      (value) =>
        typeof value === "number",
    )
      ? {
          inputTokens,
          cachedInputTokens,
          cacheWriteTokens,
          outputTokens,
          reasoningTokens,
          totalTokens,
        }
      : null;

  const estimatedCostUsd =
    parseDecimalHeader(
      response,
      "x-query-doctor-estimated-cost-usd",
    );

  const pricingEffectiveDate =
    response.headers.get(
      "x-query-doctor-pricing-effective-date",
    );

  return {
    model,
    usage,
    estimatedCostUsd,
    pricingEffectiveDate,
  };
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

  const sql = await readFile(
    sqlPath,
    "utf8",
  );

  const startedAt = performance.now();

  try {
    const response = await fetch(
      `${baseUrl}/api/review`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          sql,
          dialect: testCase.dialect,
        }),
      },
    );

    const durationMs = Math.round(
      performance.now() - startedAt,
    );

    const apiMetrics =
      readApiMetrics(response);

    const responseText =
      await response.text();

    let payload;

    try {
      payload = JSON.parse(
        responseText,
      );
    } catch {
      payload = {
        error:
          "Response was not valid JSON.",
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
      expectedScoreRange:
        testCase.scoreRange,
      actualScore:
        response.ok &&
        typeof payload.overallScore ===
          "number"
          ? payload.overallScore
          : null,
      apiMetrics,
      expectations: {
        requiredFindings:
          testCase.requiredFindings,
        forbiddenClaims:
          testCase.forbiddenClaims,
      },
      review:
        response.ok ? payload : null,
      error:
        response.ok ? null : payload,
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
      expectedScoreRange:
        testCase.scoreRange,
      actualScore: null,
      apiMetrics: null,
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
    const response = await fetch(
      baseUrl,
    );

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

function createMetricsSummary(
  successfulResults,
) {
  const meteredResults =
    successfulResults.filter(
      (result) =>
        result.apiMetrics?.usage !==
        null &&
        result.apiMetrics?.usage !==
        undefined,
    );

  const pricedResults =
    successfulResults.filter(
      (result) =>
        typeof result.apiMetrics
          ?.estimatedCostUsd ===
        "number",
    );

  const models = [
    ...new Set(
      successfulResults
        .map(
          (result) =>
            result.apiMetrics?.model,
        )
        .filter(Boolean),
    ),
  ];

  const pricingEffectiveDates = [
    ...new Set(
      successfulResults
        .map(
          (result) =>
            result.apiMetrics
              ?.pricingEffectiveDate,
        )
        .filter(Boolean),
    ),
  ];

  const tokenUsage =
    meteredResults.length > 0
      ? meteredResults.reduce(
          (total, result) => {
            const usage =
              result.apiMetrics.usage;

            return {
              inputTokens:
                total.inputTokens +
                usage.inputTokens,
              cachedInputTokens:
                total.cachedInputTokens +
                usage.cachedInputTokens,
              cacheWriteTokens:
                total.cacheWriteTokens +
                usage.cacheWriteTokens,
              outputTokens:
                total.outputTokens +
                usage.outputTokens,
              reasoningTokens:
                total.reasoningTokens +
                usage.reasoningTokens,
              totalTokens:
                total.totalTokens +
                usage.totalTokens,
            };
          },
          {
            inputTokens: 0,
            cachedInputTokens: 0,
            cacheWriteTokens: 0,
            outputTokens: 0,
            reasoningTokens: 0,
            totalTokens: 0,
          },
        )
      : null;

  const totalEstimatedCostUsd =
    pricedResults.length > 0
      ? Number(
          pricedResults
            .reduce(
              (total, result) =>
                total +
                result.apiMetrics
                  .estimatedCostUsd,
              0,
            )
            .toFixed(8),
        )
      : null;

  const averageEstimatedCostUsd =
    totalEstimatedCostUsd !== null
      ? Number(
          (
            totalEstimatedCostUsd /
            pricedResults.length
          ).toFixed(8),
        )
      : null;

  return {
    meteredResults:
      meteredResults.length,
    unmeteredResults:
      successfulResults.length -
      meteredResults.length,
    pricedResults:
      pricedResults.length,
    unpricedResults:
      successfulResults.length -
      pricedResults.length,
    models,
    pricingEffectiveDates,
    tokenUsage,
    totalEstimatedCostUsd,
    averageEstimatedCostUsd,
  };
}

function formatCostUsd(value) {
  return typeof value === "number"
    ? `$${value.toFixed(6)}`
    : "-";
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

  const unknownCaseIds =
    caseIds.filter(
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
            caseIds.includes(
              testCase.id,
            ),
        );

  await ensureServerAvailable();

  const startedAt = new Date();

  console.log(
    `Running ${expectations.length} evaluation cases against ${baseUrl}`,
  );

  console.log(
    `Run label: ${runLabel}`,
  );

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

    const result =
      await runCase(testCase);

    results.push(result);

    const score =
      result.actualScore === null
        ? "-"
        : result.actualScore.toFixed(1);

    const status =
      result.evaluation.passed
        ? "PASS"
        : "FAIL";

    const tokens =
      result.apiMetrics?.usage
        ?.totalTokens;

    const cost =
      result.apiMetrics
        ?.estimatedCostUsd;

    const metricsText =
      typeof tokens === "number"
        ? ` — tokens ${tokens} — cost ${formatCostUsd(cost)}`
        : "";

    console.log(
      `Completed in ${result.durationMs}ms — status ${result.httpStatus ?? "error"} — score ${score} — ${status}${metricsText}`,
    );

    for (
      const failure of
        result.evaluation.failures
    ) {
      console.log(
        `  - ${failure}`,
      );
    }

    console.log("");
  }

  const completedAt = new Date();

  const successfulResults =
    results.filter(
      (result) => result.success,
    );

  const passedResults =
    results.filter(
      (result) =>
        result.evaluation.passed,
    );

  const failedResults =
    results.filter(
      (result) =>
        !result.evaluation.passed,
    );

  const averageDurationMs =
    successfulResults.length > 0
      ? Math.round(
          successfulResults.reduce(
            (total, result) =>
              total +
              result.durationMs,
            0,
          ) /
            successfulResults.length,
        )
      : null;

  const metricsSummary =
    createMetricsSummary(
      successfulResults,
    );

  const run = {
    label: runLabel,
    baseUrl,
    projectDirectory,
    startedAt:
      startedAt.toISOString(),
    completedAt:
      completedAt.toISOString(),
    selectedCaseIds: caseIds,
    averageDurationMs,
    metricsSummary,
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
      result:
        result.evaluation.passed
          ? "PASS"
          : "FAIL",
      status:
        result.httpStatus ?? "error",
      durationMs: result.durationMs,
      score:
        result.actualScore ?? "-",
      tokens:
        result.apiMetrics?.usage
          ?.totalTokens ?? "-",
      costUsd:
        typeof result.apiMetrics
          ?.estimatedCostUsd ===
        "number"
          ? result.apiMetrics
              .estimatedCostUsd
              .toFixed(6)
          : "-",
      expected:
        `${result.expectedScoreRange.min}-${result.expectedScoreRange.max}`,
    })),
  );

  console.log(
    `Average duration: ${averageDurationMs ?? "-"}ms`,
  );

  if (
    metricsSummary.tokenUsage !==
    null
  ) {
    console.log(
      `Token usage: ${metricsSummary.tokenUsage.totalTokens} total ` +
        `(${metricsSummary.tokenUsage.inputTokens} input, ` +
        `${metricsSummary.tokenUsage.cachedInputTokens} cached input, ` +
        `${metricsSummary.tokenUsage.outputTokens} output, ` +
        `${metricsSummary.tokenUsage.reasoningTokens} reasoning).`,
    );
  } else {
    console.log(
      "Token usage: unavailable.",
    );
  }

  console.log(
    `Estimated cost: ${formatCostUsd(metricsSummary.totalEstimatedCostUsd)} total, ` +
      `${formatCostUsd(metricsSummary.averageEstimatedCostUsd)} average per priced review.`,
  );

  if (
    metricsSummary.unmeteredResults > 0
  ) {
    console.log(
      `Usage metrics unavailable for ${metricsSummary.unmeteredResults} successful result(s).`,
    );
  }

  if (
    metricsSummary.unpricedResults > 0
  ) {
    console.log(
      `Cost estimate unavailable for ${metricsSummary.unpricedResults} successful result(s).`,
    );
  }

  console.log(
    `Automated checks: ${passedResults.length} passed, ${failedResults.length} failed.`,
  );

  console.log(
    "Qualitative review of required findings and forbidden claims is still required.",
  );

  console.log(
    `Results saved to ${resultPath}`,
  );

  if (failedResults.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    "Evaluation run failed:",
    error,
  );

  process.exitCode = 1;
});