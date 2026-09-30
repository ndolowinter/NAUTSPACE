"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  from: "me" | "them";
  body: string;
}

const THREADS = ["Kenya Space Agency Liaison", "AU Defense Coordination", "SEA Capital"];

const SEED_MESSAGES: Message[] = [
  {
    id: "1",
    from: "them",
    body: "Manifest review complete for NautSpace International-SAT-03. Awaiting your sign-off.",
  },
  { id: "2", from: "me", body: "Reviewing now will confirm by EOD." },
];

/** UI mock only no real transport. In production this would sit behind a
 * Signal-protocol-style E2E layer with per-thread key exchange. */
export function SecureMessenger() {
  const [activeThread, setActiveThread] = useState(THREADS[0]);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: "me", body: draft.trim() }]);
    setDraft("");
  };

  return (
    <Card className="border-slate-800 bg-black/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Secure Internal Communications</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-emerald">End-to-end encrypted (mock)</span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <div className="space-y-1">
            {THREADS.map((thread) => (
              <button
                key={thread}
                onClick={() => setActiveThread(thread)}
                className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${
                  thread === activeThread
                    ? "bg-cyan/10 text-cyan"
                    : "text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                {thread}
              </button>
            ))}
          </div>

          <div className="flex h-72 flex-col rounded-md border border-slate-800 bg-slate-950/40">
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.from === "me"
                      ? "ml-auto bg-cyan/15 text-cyan-100"
                      : "bg-slate-800/60 text-slate-200"
                  }`}
                >
                  {m.body}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-slate-800 p-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={`Message ${activeThread}…`}
                className="h-9"
              />
              <Button size="sm" className="h-9" onClick={send}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
