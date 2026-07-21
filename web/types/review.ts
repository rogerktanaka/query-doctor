export type ReviewCategory = {
  id: string;
  name: string;
  score: number;
  summary: string;
  observations: string[];
};

export type ReviewResult = {
  overallScore: number;
  summary: string;
  categories: ReviewCategory[];
  suggestions: string[];
  limitations: string[];
};