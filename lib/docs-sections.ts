export const docsSectionIds = [
  "overview",
  "objective",
  "dataset",
  "pipeline",
  "leakage",
  "features",
  "architecture",
  "embeddings",
  "roles",
  "interactions",
  "numeric",
  "gate",
  "training",
  "regularization",
  "results",
  "deployment",
  "frontend",
  "future",
  "conclusion",
] as const;

export type DocsSectionId = (typeof docsSectionIds)[number];
