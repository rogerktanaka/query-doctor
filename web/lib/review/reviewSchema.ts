import { z } from "zod";

export const ObservationTypeSchema = z.enum([
  "positive",
  "issue",
  "risk",
]);

export const ObservationSeveritySchema = z.enum([
  "info",
  "low",
  "medium",
  "high",
]);

export const ObservationConfidenceSchema = z.enum([
  "low",
  "medium",
  "high",
]);

export const ReviewObservationSchema = z.object({
  type: ObservationTypeSchema,
  severity: ObservationSeveritySchema,
  confidence: ObservationConfidenceSchema,
  message: z.string().min(1),
});

export const ReviewCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  score: z.number().min(0).max(10),
  summary: z.string().min(1),
  observations: z.array(ReviewObservationSchema),
});

export const ReviewResultSchema = z.object({
  overallScore: z.number().min(0).max(10),
  summary: z.string().min(1),
  categories: z.array(ReviewCategorySchema).min(1),
  suggestions: z.array(z.string().min(1)),
  limitations: z.array(z.string().min(1)),
});

export type ReviewObservation = z.infer<
  typeof ReviewObservationSchema
>;

export type ReviewCategory = z.infer<
  typeof ReviewCategorySchema
>;

export type ReviewResult = z.infer<
  typeof ReviewResultSchema
>;

export function validateReviewResult(
  input: unknown,
): ReviewResult {
  return ReviewResultSchema.parse(input);
}