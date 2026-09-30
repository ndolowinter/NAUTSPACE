import type { Application, ApplicationStatus } from "@/lib/types/database";
import { APPLICATION_TRACK_LABELS } from "@/lib/applicationTracks";

const STEPS = ["Submitted", "Under Review", "Interview", "Decision"] as const;
const ORDER: ApplicationStatus[] = ["submitted", "under_review", "interview"];

function stepState(status: ApplicationStatus, stepIndex: number): "done" | "rejected" | "pending" {
  const decisionMade = status === "accepted" || status === "rejected";
  const currentIndex = decisionMade ? 3 : ORDER.indexOf(status);

  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) {
    if (!decisionMade) return "pending";
    return status === "accepted" ? "done" : "rejected";
  }
  return "pending";
}

export function ApplicationStatusTracker({ application }: { application: Application }) {
  return (
    <div className="rounded-lg border border-slate-800 p-4">
      <p className="mb-3 text-sm font-medium text-slate-200">
        {APPLICATION_TRACK_LABELS[application.track] ?? application.track} Application
      </p>
      <div className="flex flex-wrap items-center gap-4">
        {STEPS.map((label, i) => {
          const state = stepState(application.status, i);
          return (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className={
                  state === "done"
                    ? "text-sm text-emerald"
                    : state === "rejected"
                      ? "text-sm text-red-400"
                      : "text-sm text-slate-500"
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
