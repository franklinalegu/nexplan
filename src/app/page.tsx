"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadIdeas, saveIdeas, uid } from "@/lib/storage";
import type { Idea } from "@/lib/types";
import { clarifyQuestions, exploreIdea } from "@/lib/mock-ai";

const STATUSES: Idea["status"][] = ["Raw", "Exploring", "Defined", "Planning", "Building", "Paused", "Completed", "Archived"];

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [raw, setRaw] = useState("");
  const [filter, setFilter] = useState<Idea["status"] | "All">("All");

  useEffect(() => setIdeas(loadIdeas()), []);
  useEffect(() => saveIdeas(ideas), [ideas]);

  function createIdea() {
    if (!raw.trim()) return;
    const now = new Date().toISOString();
    const title = raw.trim().split("\n")[0].slice(0, 48) || "Untitled idea";
    const enriched = exploreIdea(raw.trim());
    const idea: Idea = {
      id: uid(),
      title,
      rawText: raw.trim(),
      description: raw.trim(),
      status: "Raw",
      createdAt: now,
      updatedAt: now,
      ...enriched,
    };
    setIdeas((prev) => [idea, ...prev]);
    setRaw("");
  }

  const filtered = filter === "All" ? ideas : ideas.filter((i) => i.status === filter);

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white grid place-items-center font-bold text-sm">N</div>
            <span className="font-semibold tracking-tight">NEXPLAN</span>
            <span className="hidden sm:inline text-xs text-zinc-500 border-l pl-3 ml-1">Think it. Plan it. Build it.</span>
          </div>
          <a href="https://github.com/franklinalegu/nexplan" className="text-sm text-zinc-500 hover:text-zinc-900">GitHub ↗</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Good morning.</h1>
          <p className="mt-2 text-zinc-500">What are you working on? Turn a one-line idea into a product, project, and plan.</p>
        </div>

        {/* New Idea */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <label className="text-sm font-medium">What are you thinking about?</label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="I want to build a platform where people can organise YouTube learning playlists..."
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-[15px] placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">Press Start Planning — we&apos;ll clarify before we generate. {raw.length > 0 && `${raw.length} chars`}</p>
            <button onClick={createIdea} className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-40" disabled={!raw.trim()}>
              Start Planning →
            </button>
          </div>
          {raw.trim() && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-medium text-amber-900">Nexplan will ask:</p>
              <ul className="mt-1 list-disc pl-5 text-xs text-amber-800 space-y-0.5">
                {clarifyQuestions(raw).map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Filters + List */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {["All" as const, ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filter === s ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}>
              {s}
            </button>
          ))}
          <span className="ml-auto text-xs text-zinc-500">{filtered.length} ideas</span>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed bg-white p-12 text-center">
            <p className="text-sm font-medium">No ideas yet</p>
            <p className="mt-1 text-sm text-zinc-500">Create your first idea above. It will appear here as Raw → Exploring → Defined.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-left max-w-2xl mx-auto">
              {[
                { t: "Playlist Vault", d: "Organise YouTube playlists into offline courses" },
                { t: "Church volunteer hub", d: "Manage volunteers, events, attendance" },
              ].map((ex) => (
                <button key={ex.t} onClick={() => setRaw(`I want to build ${ex.d.toLowerCase()} — ${ex.t}`)} className="rounded-xl border bg-zinc-50 p-4 text-left hover:bg-white">
                  <p className="text-sm font-medium">{ex.t}</p>
                  <p className="text-xs text-zinc-500 mt-1">{ex.d}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`} className="group rounded-2xl border bg-white p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium tracking-wide ${badge(idea.status)}`}>{idea.status.toUpperCase()}</span>
                  <span className="text-xs text-zinc-400">{new Date(idea.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="mt-3 font-medium leading-tight group-hover:underline line-clamp-2">{idea.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-3">{idea.description}</p>
                <div className="mt-4 flex gap-2 text-xs text-zinc-400">
                  <span>{idea.openQuestions?.length || 0} questions</span>
                  <span>•</span>
                  <span>{idea.risks?.length || 0} risks</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer spec */}
        <div className="mt-12 rounded-xl border bg-white p-4 text-xs text-zinc-500">
          <span className="font-medium text-zinc-900">Nexplan MVP</span> — v0.1 Idea Engine • v0.2 Product Planner • v0.3 Project Planner • Local-first (Supabase sync next) • <Link href="/VISION.md" className="underline">Read vision</Link>
        </div>
      </main>
    </div>
  );
}

function badge(s: Idea["status"]) {
  switch (s) {
    case "Raw": return "bg-zinc-100 text-zinc-700";
    case "Exploring": return "bg-amber-100 text-amber-800";
    case "Defined": return "bg-blue-100 text-blue-800";
    case "Planning": return "bg-violet-100 text-violet-800";
    case "Building": return "bg-emerald-100 text-emerald-800";
    default: return "bg-zinc-100 text-zinc-600";
  }
}
