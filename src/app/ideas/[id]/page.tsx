"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadIdeas, upsertIdea, deleteIdea } from "@/lib/storage";
import { productPlan, projectPlan } from "@/lib/mock-ai";
import type { Idea } from "@/lib/types";

type Tab = "Idea" | "Product" | "Project" | "Roadmap" | "Tasks" | "Decisions";

export default function IdeaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [tab, setTab] = useState<Tab>("Idea");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const found = loadIdeas().find((i) => i.id === id) || null;
    setIdea(found);
    if (found && chat.length === 0) {
      setChat([{ role: "ai", text: `Let's clarify "${found.title}".\n\n${(found.openQuestions || []).map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nAnswer any, or say "assume for me" and I'll draft the product plan.` }]);
    }
  }, [id]);

  if (!idea) return <div className="p-10 text-sm">Idea not found. <Link href="/" className="underline">Back</Link></div>;

  const pp = productPlan(idea);
  const pj = projectPlan(idea);

  function save(patch: Partial<Idea>) {
    if (!idea) return;
    const next = { ...idea, ...patch, updatedAt: new Date().toISOString() };
    setIdea(next);
    upsertIdea(next);
  }

  function send() {
    if (!input.trim() || !idea) return;
    const userText = input.trim();
    setInput("");
    const nextChat: typeof chat = [...chat, { role: "user" as const, text: userText }];
    // ponytail: rule-based response, replace with /api/plan LLM call later
    let ai = "";
    if (/assume/i.test(userText)) {
      ai = `Assumed. Here's a draft Product Plan:\n\nProblem: ${pp.problem}\nValue: ${pp.valueProposition}\nMVP: ${pp.mvpFeatures.join(", ")}\n\nSwitch to Product tab to refine, or say "convert to project".`;
      if (idea.status === "Raw") save({ status: "Defined" });
    } else if (/convert|project/i.test(userText)) {
      ai = `Converted to Project: ${pj.objective}\nMilestones: ${pj.milestones.map((m) => m.name).join(" → ")}\nOpen Project tab.`;
      save({ status: "Planning" });
    } else if (/mvp/i.test(userText)) {
      ai = `MVP scope:\n${pp.mvpFeatures.map((f) => `• ${f}`).join("\n")}\nV1: ${pp.v1Features.join(", ")}`;
    } else {
      ai = `Noted: "${userText.slice(0, 80)}". I've updated the idea context. Want me to /challenge assumptions, /risks, or /roadmap?`;
      save({ description: idea.description + "\n\nUser note: " + userText });
    }
    setChat([...nextChat, { role: "ai", text: ai }]);
  }

  function exportJSON() {
    if (!idea) return;
    const blob = new Blob([JSON.stringify({ idea, product: pp, project: pj }, null, 2)], { type: "application/json" });
    dl(blob, `${idea.title.replace(/\W+/g, "-")}.json`);
  }
  function exportMD() {
    if (!idea) return;
    const md = `# ${idea.title}\n\n${idea.description}\n\n## Product Plan\nProblem: ${pp.problem}\n\nValue: ${pp.valueProposition}\n\nMVP: ${pp.mvpFeatures.join(", ")}\n\n## Project\n${pj.objective}\n${pj.milestones.map((m) => `### ${m.name}\n${m.tasks.map((t) => `- ${t}`).join("\n")}`).join("\n")}`;
    dl(new Blob([md], { type: "text/markdown" }), `${idea.title.replace(/\W+/g, "-")}.md`);
  }
  function dl(blob: Blob, name: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center gap-4 px-6 py-3">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">← Dashboard</Link>
          <span className="text-zinc-200">/</span>
          <span className="font-medium truncate">{idea.title}</span>
          <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${idea.status === "Raw" ? "bg-zinc-900 text-white" : "bg-emerald-100 text-emerald-800"}`}>{idea.status}</span>
          <div className="ml-auto flex gap-2">
            <button onClick={exportMD} className="rounded-full border bg-white px-3 py-1.5 text-xs hover:bg-zinc-50">Export MD</button>
            <button onClick={exportJSON} className="rounded-full border bg-white px-3 py-1.5 text-xs hover:bg-zinc-50">Export JSON</button>
            <button onClick={() => { deleteIdea(idea.id); router.push("/"); }} className="rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100">Delete</button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 flex gap-6 border-t bg-white">
          {(["Idea", "Product", "Project", "Roadmap", "Tasks", "Decisions"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`py-3 text-sm border-b-2 ${tab === t ? "border-zinc-900 font-medium" : "border-transparent text-zinc-500 hover:text-zinc-900"}`}>{t}</button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left: workspace */}
        <div className="space-y-6">
          {tab === "Idea" && (
            <div className="rounded-2xl border bg-white p-6">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Idea</label>
              <input value={idea.title} onChange={(e) => save({ title: e.target.value })} className="mt-2 w-full rounded-xl border px-3 py-2 font-medium" />
              <textarea value={idea.description} onChange={(e) => save({ description: e.target.value })} rows={5} className="mt-3 w-full rounded-xl border bg-zinc-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs font-medium text-amber-900">Assumptions</p>
                  <ul className="mt-1 text-xs text-amber-800 list-disc pl-4">{(idea.assumptions || []).map((a) => <li key={a}>{a}</li>)}</ul>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                  <p className="text-xs font-medium text-red-900">Risks</p>
                  <ul className="mt-1 text-xs text-red-800 list-disc pl-4">{(idea.risks || []).map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <select value={idea.status} onChange={(e) => save({ status: e.target.value as Idea["status"] })} className="rounded-full border bg-white px-3 py-1.5 text-xs">
                  {["Raw","Exploring","Defined","Planning","Building","Paused","Completed","Archived"].map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="text-xs text-zinc-400 self-center">Updated {new Date(idea.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}

          {tab === "Product" && (
            <div className="rounded-2xl border bg-white p-6 space-y-4">
              <h2 className="font-semibold">Product Plan</h2>
              <Field label="Overview" value={pp.overview} />
              <Field label="Problem" value={pp.problem} />
              <Field label="Target Users" value={pp.targetUsers.join(" • ")} />
              <Field label="Value Proposition" value={pp.valueProposition} />
              <div className="grid gap-3 sm:grid-cols-3">
                <List title="MVP (must)" items={pp.mvpFeatures} color="emerald" />
                <List title="V1" items={pp.v1Features} color="blue" />
                <List title="Future" items={pp.futureFeatures} color="zinc" />
              </div>
            </div>
          )}

          {tab === "Project" && (
            <div className="rounded-2xl border bg-white p-6 space-y-4">
              <h2 className="font-semibold">Project — {pj.objective}</h2>
              {pj.milestones.map((m) => (
                <div key={m.name} className="rounded-xl border bg-zinc-50 p-4">
                  <p className="text-sm font-medium">{m.name}</p>
                  <ul className="mt-2 space-y-1">{m.tasks.map((t) => <li key={t} className="flex gap-2 text-sm text-zinc-600"><span className="mt-1 h-3 w-3 rounded border bg-white shrink-0" />{t}</li>)}</ul>
                </div>
              ))}
            </div>
          )}

          {tab === "Roadmap" && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold">Roadmap</h2>
              <div className="mt-4 border-l-2 border-zinc-200 pl-6 space-y-6">
                {pj.milestones.map((m, i) => (
                  <div key={m.name} className="relative">
                    <div className="absolute -left-[29px] h-3 w-3 rounded-full bg-zinc-900 mt-1" />
                    <p className="text-xs text-zinc-500">MONTH {i + 1}</p>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-zinc-500">{m.tasks.join(" • ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Tasks" && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold">Tasks</h2>
              <div className="mt-4 space-y-2">
                {pj.milestones.flatMap((m) => m.tasks.map((t) => ({ t, m: m.name }))).map((row) => (
                  <div key={row.t} className="flex items-center gap-3 rounded-xl border px-3 py-2 hover:bg-zinc-50">
                    <input type="checkbox" className="h-4 w-4" />
                    <span className="text-sm flex-1">{row.t}</span>
                    <span className="text-xs text-zinc-400">{row.m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Decisions" && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold">Decision Log</h2>
              <p className="mt-2 text-sm text-zinc-500">Every scope change is recorded so the AI stays consistent.</p>
              <div className="mt-4 rounded-xl border bg-zinc-50 p-4 text-sm">
                <p className="font-medium">Example: Use web for MVP, not mobile</p>
                <p className="text-xs text-zinc-500 mt-1">Reason: faster dev + easier access • Sep 2026 • Active</p>
              </div>
              <p className="mt-3 text-xs text-zinc-400">Decisions are auto-logged when you change status/scope in chat.</p>
            </div>
          )}
        </div>

        {/* Right: AI Chat — Think With Me */}
        <div className="rounded-2xl border bg-white flex flex-col h-[640px] sticky top-[88px]">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="text-sm font-medium">Think With Me</p>
            <span className="text-xs text-zinc-500">AI planner • mock</span>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {chat.map((m, i) => (
              <div key={i} className={`rounded-2xl px-3 py-2.5 text-sm whitespace-pre-wrap ${m.role === "ai" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900 ml-8"}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Answer, or try: assume for me / mvp / convert to project" className="flex-1 rounded-full border bg-zinc-50 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900" />
            <button onClick={send} className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-black">Send</button>
          </div>
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {["assume for me","/mvp","/risks","convert to project","/roadmap"].map((c)=>(<button key={c} onClick={()=> setInput(c)} className="rounded-full border bg-white px-2.5 py-1 text-xs hover:bg-zinc-50">{c}</button>))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p><p className="mt-1 text-sm leading-6 bg-zinc-50 border rounded-xl p-3">{value}</p></div>;
}
function List({ title, items, color }: { title: string; items: string[]; color: string }) {
  const c = color === "emerald" ? "bg-emerald-50 border-emerald-200" : color === "blue" ? "bg-blue-50 border-blue-200" : "bg-zinc-50";
  return <div className={`rounded-xl border p-3 ${c}`}><p className="text-xs font-medium">{title}</p><ul className="mt-2 space-y-1 text-xs list-disc pl-4">{items.map(i=> <li key={i}>{i}</li>)}</ul></div>;
}
