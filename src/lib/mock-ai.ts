import type { Idea, ProductPlan, ProjectPlan } from "./types";

// ponytail: naive heuristics, replace with real LLM via /api/plan when keys available
export function clarifyQuestions(raw: string): string[] {
  const qs: string[] = [];
  if (raw.length < 80) qs.push("Who is this for, specifically?");
  if (!/for |user|student|business|team/i.test(raw)) qs.push("Who experiences this problem most acutely?");
  qs.push("What problem does it solve and why does it matter now?");
  qs.push("How are people solving it today without this?");
  if (!/app|web|mobile|platform/i.test(raw)) qs.push("What platform should the MVP run on (web first?)");
  return qs.slice(0, 5);
}

export function exploreIdea(raw: string): Partial<Idea> {
  return {
    problem: `Problem inferred: ${raw.slice(0, 120)} — needs validation that this is a painful, frequent problem.`,
    audience: "Primary: early adopters who feel the pain directly. Secondary: adjacent users who benefit indirectly.",
    assumptions: [
      "Users will change behavior to use this",
      "The problem is frequent enough to sustain usage",
      "The proposed solution is 10x better than alternatives",
    ],
    risks: [
      "API/platform restrictions may limit imports/integrations",
      "Acquisition cost may exceed willingness to pay",
      "Scope creep before MVP validation",
    ],
    openQuestions: clarifyQuestions(raw),
  };
}

export function productPlan(idea: Idea): ProductPlan {
  return {
    overview: idea.description || idea.rawText,
    problem: idea.problem || `Solve: ${idea.rawText}`,
    targetUsers: ["Primary: motivated early adopter", "Secondary: broader audience post-validation"],
    valueProposition: idea.valueProposition || "Turn scattered intent into structured progress — faster than docs + chat alone.",
    mvpFeatures: ["Create account", "Create idea & refine with AI", "Generate product plan", "Generate milestones & tasks", "Export Markdown/JSON"],
    v1Features: ["Collaboration", "Templates", "Supabase sync", "Analytics"],
    futureFeatures: ["Marketplace", "AI agents", "Team workspaces"],
    risks: idea.risks || [],
  };
}

export function projectPlan(idea: Idea): ProjectPlan {
  return {
    objective: `Build MVP for "${idea.title}" and validate with 10 design partners`,
    milestones: [
      { name: "M1 — Research", tasks: ["Define target users", "Validate problem (5 interviews)", "Review alternatives", "Define MVP requirements"] },
      { name: "M2 — UX", tasks: ["Onboarding flow", "Dashboard & idea workspace", "Product/project views", "Clickable prototype"] },
      { name: "M3 — Development", tasks: ["Next.js + Supabase setup", "Auth & workspaces", "Idea CRUD + AI clarification", "Task generation & roadmap"] },
      { name: "M4 — Testing", tasks: ["Functional + UX testing", "Performance & security review", "Beta with 5 users"] },
      { name: "M5 — Launch", tasks: ["Deploy to Vercel", "Docs & feedback loop", "Iterate on top risk"] },
    ],
  };
}
