"use client";
import type { Idea } from "./types";

const KEY = "nexplan:ideas:v1";

export function loadIdeas(): Idea[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveIdeas(ideas: Idea[]) {
  localStorage.setItem(KEY, JSON.stringify(ideas));
}

export function upsertIdea(idea: Idea) {
  const all = loadIdeas();
  const idx = all.findIndex((i) => i.id === idea.id);
  if (idx >= 0) all[idx] = idea;
  else all.unshift(idea);
  saveIdeas(all);
}

export function deleteIdea(id: string) {
  saveIdeas(loadIdeas().filter((i) => i.id !== id));
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}
