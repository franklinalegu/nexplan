# Nexplan
### Open Source AI Product & Project Planning Workspace

**Tagline:** Think it. Plan it. Build it.

**Formerly:** PlanText → rebranded to **Nexplan** (Next + Plan — your next plan, from thought to execution)

**Status:** Concept / MVP Definition
**License Direction:** Open Source
**Primary Platform:** Web
**AI Architecture:** Opensource / selfhostable AI

> An opensource AI workspace for turning raw ideas into products, projects, roadmaps, and actionable plans.



## 1. Executive Summary

**Nexplan** is an opensource AIpowered planning workspace designed to help individuals, founders, designers, developers, businesses, teams, and creators transform raw ideas into structured, actionable plans.

Most ideas begin as incomplete thoughts:
• "I want to build an app for students."
• "I want to launch a new service."
• "I want to organise a conference."
• "I have an idea for an AI tool."

The problem is rarely a lack of ideas. The problem is turning those ideas into something understandable, structured, and executable.

**Nexplan** addresses this gap. Instead of functioning primarily as an AI chatbot, Nexplan acts as an AI planning partner. It asks clarifying questions, identifies assumptions, structures the idea, develops product or project plans, creates roadmaps, breaks objectives into tasks, and provides a workspace for continuously refining the idea.

**Fundamental workflow:**
`Capture → Clarify → Explore → Plan → Break Down → Execute → Review → Improve`

## 2. Vision

To make structured planning accessible to everyone by giving every idea an intelligent path from thought to execution. Nexplan should become a generalpurpose AI thinking and planning environment.

Helps users answer: What am I building? Who is it for? What problem does it solve? Is it defined? What goes in v1? What to build first? Resources? Risks? Next actions? How to improve?

## 3. Mission

Nexplan helps people turn unstructured ideas into structured products, projects, and actionable plans using opensource AI. The goal is not to generate text — it's to improve thinking and planning.

## 4. The Problem

**4.1 Ideas are unstructured** — people don't know the problem, user, solution shape, MVP scope, work involved, or dependencies. Traditional PM tools assume the project exists. Nexplan begins before it exists.

**4.2 Existing AI tools generate rather than plan** — they output "Here's a business plan" without understanding. Nexplan operates through a structured process.

Example:
> User: "I want to build an AI tool for Nigerian businesses."
> Nexplan: "Promising but broad. Let's clarify: 1) Which businesses? 2) What problem? 3) What AI functionality?" → progressively constructs the plan.

## 5. Product Philosophy

1. Start simple — one sentence input
2. Clarify before generating
3. Structure information — ideas become data, not just chat
4. Preserve user ownership — export, modify, delete, selfhost
5. AI assists; humans decide

## 6. Core Concept

```
                 NEXPLAN
                     │
          ┌──────────┴──────────┐
          │                     │
        IDEAS                PROJECTS
          │                     │
          ▼                     ▼
       PRODUCTS             EXECUTION
          │                     │
          └──────────┬──────────┘
                     ▼
                AI PLANNER
```
Idea → Product → Project → Execution Plan

## 7 and 8 Core Workflow

**Stage 1 — Capture:** Raw idea saved as Idea. e.g. "I want to create a platform where people can organise YouTube learning playlists."

**Stage 2 — Clarify:** AI identifies missing info: Who is this for? What problem? Why does it matter? Current alternatives? Differentiation? Platform?

**Stage 3 — Explore:** AI generates Problem, Audience, Context, Alternatives, Opportunity, Assumptions, Risks.

## 9 to 11 Product Planning

Product Plan Structure:
```
Product
├── Overview / Problem / Target Users / Value Proposition
├── User Personas / Journeys
├── Features / MVP / Future Features
├── UX / Technical Requirements / Integrations
├── Monetisation / Risks / Open Questions
```

**Feature priorities:** MVP (essential), V1 (postvalidation), Future (don't distract).

Example MVP: Create account, Create project, Add idea, AI planning, Generate tasks. V1: Collaboration, Templates, Export, Analytics.

## 12 and 13 Project Planning

```
Project
├── Objective / Deliverables / Milestones
├── Tasks / Subtasks / Dependencies
├── Resources / Timeline / Budget / Risks / Owners / Status
```

AI breaks Objective into Milestones 1 to 5: Research → UX → Development → Testing → Launch.

## 14. "Think With Me" Mode

Defining feature. Instead of "Create a business plan," activate **Think With Me** — AI challenges assumptions, identifies gaps/contradictions, asks questions, suggests alternatives, exposes risks/dependencies, refines language. Does not pretend every idea is viable.

## 15. AI Commands

`/clarify` `/challenge` `/research` `/product` `/mvp` `/project` `/tasks` `/roadmap` `/risks` `/next` `/review`

## 16. Roadmap System

Translates strategy into time. Example: Month 1 Research, Month 2 Design, Month 3 Development, Month 4 Testing & Launch. Useradjustable.

## 17 and 18 Workspace and Decisions

**Workspace nav:** Overview / Idea / Product / Project / Roadmap / Tasks / Research / Documents / Decisions / AI Chat / Settings

**Decision Log:** Records Decision + Reason + Date + Status — so AI understands evolution.

## 19. Project Memory

Retrievalaugmented context instead of sending entire project each time:
`User → Question → Context Retrieval → Relevant Project Info → Model → Structured Response`

## 20 and 21 AI Architecture

```
               AI INTERFACE
                    ▼
              AI ORCHESTRATOR
        ┌─────────┼──────────┐
     Planner  Researcher   Critic
        └─────────┼──────────┘
                    ▼
              MODEL PROVIDER (Model A/B/C)
```

Modular, not tied to one model:
`AI Provider Interface → Local Model / SelfHosted / OpenAICompatible API / Other Provider`

If Meta Muse is suitable and licensing permits, evaluate as one supported backend — never a hard dependency.

## 22. Deployment Modes

**Mode A — Public hosted (nexplan.app):** Free with reasonable limits.
**Mode B — Selfhosted:** Clone → Configure → Run.
**Mode C — Private org deployment.**

Open source ≠ unlimited free inference — hosting models costs compute.

## 23. Open Source Philosophy

Repo contains: frontend, backend, DB schema, AI orchestration, prompts, planning logic, docs, deployment instructions, config examples. Goal: `Clone → Configure → Run`.

## 24. Tech Stack (v1)

• **Frontend:** Next.js + React
• **UI:** Tailwind CSS + shadcn/ui
• **Backend:** Next.js server actions / API routes
• **DB:** PostgreSQL (Supabase practical option)
• **Auth:** Supabase Auth (pluggable)
• **AI:** Opensource/selfhosted via OpenAIcompatible interface
• **Hosting:** Vercel
• **Repo:** GitHub

## 25. Database Concept

```
users → workspaces → ideas → products → projects
                     ├── tasks / milestones / documents / decisions / research / conversations
```

Entities: `users, workspaces, ideas(id, workspace_id, title, description, status), products(id, idea_id, name, problem, audience, value_proposition), projects(id, product_id, name, objective, status), tasks(id, project_id, title, status, priority, parent_task_id)`

## 26. Structured AI Output

AI returns JSON where possible for rendering as cards/tables/timelines:
```json
{
  "type": "product_plan",
  "problem": "...",
  "target_users": [],
  "value_proposition": "...",
  "mvp_features": [],
  "risks": [],
  "open_questions": []
}
```

## 27 and 28 UI

Feels like **Notion + Linear + AI thinking assistant**.

Dashboard: "Good morning. What are you working on? [+ New Idea]" + Recent Ideas cards.

New Idea flow: `+ New Idea → "What are you thinking about? [I want to build...]" → [Start Planning]`

## 29 to 32 Lifecycle and Export

**Idea status:** Raw → Exploring → Defined → Planning → Building → Paused → Completed → Archived

**Product:** Idea → Discovery → Validation → Definition → MVP → Build → Launch → Iterate
**Project:** Planning → Ready → In Progress → Review → Completed

**Export:** Markdown, JSON, PDF, CSV (tasks). Later: DOCX, Notion, GitHub Issues, Linear, Jira.

## 33 to 35 Templates / Research / Risks

**Templates:** SaaS, Mobile App, Website, AI Tool, etc. + Project templates.

**Research layer:** Distinguishes Known / Assumed / Needs Research / Validated. e.g. Assumption "Students want offline playlists" → Status: Needs Research.

**Risk register:** Description, Probability, Impact, Mitigation, Status, Owner.

## 36 and 37 Context and Privacy

**AI Context Hierarchy:** GLOBAL (user prefs) → WORKSPACE (projects) → PROJECT (product/tasks/decisions/docs) → CURRENT CONVERSATION

Security: encrypted connections, secure auth, RLS, data isolation, deletion/export/selfhosting.

## 38 and 39 MVP Scope

**Nexplan MVP:**
1. Auth (sign up/login/logout)
2. Idea Management (create/edit/delete/archive)
3. AI Clarification (Q&A, update idea)
4. Product Planning (problem/audience/value/features/MVP)
5. Project Planning (objectives/milestones/tasks/dependencies)
6. AI Workspace (chat/refine)
7. Export (Markdown/JSON)

**NOT in MVP:** complex permissions, billing, mobile apps, analytics, marketplace, integrations, agents, enterprise admin.

Core test: *Can Nexplan reliably take a raw idea and help turn it into a useful plan?*

## 40. Version Roadmap

• v0.1 Idea Engine — capture & clarify
• v0.2 Product Planner — idea → spec
• v0.3 Project Planner — product → execution
• v0.4 Roadmap — timelines/dependencies
• v0.5 Research — assumptions/validation
• v0.6 Documents — structured docs
• v0.7 Collaboration — teams/shared workspaces
• v0.8 Integrations — GitHub/Linear/Jira/Notion
• v1.0 Open AI Planning Platform — selfhosting + multibackend

## 41 Long Term Vision — AI Project OS

Nexplan understands WHAT (Product), WHY (Problem), WHO (Users), HOW (Solution), WHEN (Roadmap), WHAT NEXT (Tasks), WHY THIS DECISION (Log), WHAT CHANGED (History), WHAT NOW (Recommendations) → continuous planning loop.

## 42 End to End Example

`Idea "website for church volunteers" → Nexplan asks questions → Defined → Product Plan → "Define MVP" → MVP features → [Convert to Project] → Project Plan → [Generate Roadmap] → Milestones → [Generate Tasks] → Execute → "Remove attendance from MVP" → Plan updates + decision logged.`

## 43. Brand

• **Name:** Nexplan — Next + Plan
• **Meaning:** Your next plan starts as text. You write what you're thinking; Nexplan structures it.
• **Tagline:** Think it. Plan it. Build it.
• **Positioning:** From thought to execution.
• **Description:** Nexplan is an opensource AI workspace that turns ideas into structured products, projects, roadmaps, and actionable plans.

## 44. Repository

**GitHub:** `franklinalegu/nexplan`
**Description:** An opensource AI workspace for turning raw ideas into products, projects, roadmaps, and actionable plans.
**Domain:** `nexplan.app` (public hosted instance)

## 45. Core Principle

> What do I have, what am I trying to achieve, and what should I do next? — Nexplan answers all three.

## 46. Architecture

```
                         NEXPLAN
              Open Source AI Planning Workspace
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
      IDEA                  PRODUCT                PROJECT
       │                      │                      │
   Capture                Definition              Objective
   Clarify                Features                Milestones
   Explore                MVP                     Tasks
   Validate               UX                      Timeline
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                         AI PLANNER
                              │
             ┌────────────────┼────────────────┐
             │                │                │
          Think            Research          Execute
             │                │                │
        Questions         Assumptions         Tasks
        Challenges        Validation          Roadmap
        Decisions         Evidence            Progress
             │                │                │
             └────────────────┼────────────────┘
                              │
                       USER WORKSPACE
                              │
               ┌──────────────┼──────────────┐
               │              │              │
           Documents       Decisions       Export
```

**Core promise:** Nexplan doesn't just help you manage projects that already exist. It helps you figure out what the project should be in the first place.



### Rebrand Notes (PlanText → Nexplan)

| Old | New |
|||
| PlanText | Nexplan |
| Plan + Text | Next + Plan |
| plantext.app | nexplan.app |
| GitHub `plantext` | `franklinalegu/nexplan` |

All concepts, workflows, and architecture unchanged — only naming/branding updated. No code changes required beyond string replacement.



## Getting Started (MVP v0.1)

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

Stack: Next.js 16 + Tailwind 4 + TypeScript. Localfirst (localStorage) — Supabase + AI backend next (see `src/lib/mockai.ts`).

### Project Structure
```
src/app/page.tsx        → Dashboard (Capture → list + filter)
src/app/ideas/[id]/page → Workspace (Idea/Product/Project/Roadmap/Tasks + Think With Me)
src/lib/types.ts        → Core entities
src/lib/storage.ts      → localStorage CRUD
src/lib/mockai.ts      → ponytail: naive heuristics, replace with /api/plan LLM
```
