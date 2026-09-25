export type IdeaStatus = "Raw" | "Exploring" | "Defined" | "Planning" | "Building" | "Paused" | "Completed" | "Archived";

export type Idea = {
  id: string;
  title: string;
  rawText: string;
  description: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
  // derived enrichments
  problem?: string;
  audience?: string;
  valueProposition?: string;
  assumptions?: string[];
  risks?: string[];
  openQuestions?: string[];
};

export type ProductPlan = {
  overview: string;
  problem: string;
  targetUsers: string[];
  valueProposition: string;
  mvpFeatures: string[];
  v1Features: string[];
  futureFeatures: string[];
  risks: string[];
};

export type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  milestone: string;
};

export type ProjectPlan = {
  objective: string;
  milestones: { name: string; tasks: string[] }[];
};
