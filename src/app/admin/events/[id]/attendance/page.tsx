"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { EventAttendance, OsaiEvent } from "@/lib/types/database";

export default function EventAttendancePage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<OsaiEvent | null>(null);
  const [attendees, setAttendees] = useState<EventAttendance[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const attendanceUrl = event
    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/attendance/${event.attendance_token}`
    : null;

  const load = useCallback(async () => {
    const supabase = createClient();
    const [{ data: eventData }, { data: attendanceData }] = await Promise.all([
      supabase.from("events").select("*").eq("id", params.id).single(),
      supabase
        .from("event_attendance")
        .select("*")
        .eq("event_id", params.id)
        .order("marked_at", { ascending: false }),
    ]);
    setEvent(eventData);
    setAttendees(attendanceData ?? []);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!attendanceUrl) return;
    QRCode.toDataURL(attendanceUrl, { width: 240 }).then(setQrDataUrl);
  }, [attendanceUrl]);

  const copyLink = async () => {
    if (!attendanceUrl) return;
    await navigator.clipboard.writeText(attendanceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qrDataUrl || !event) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    a.click();
  };

  const removeAttendee = async (id: string) => {
    const supabase = createClient();
    await supabase.from("event_attendance").delete().eq("id", id);
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Reference", "Time"];
    const rows = attendees.map((a) => [
      a.full_name,
      a.email ?? "",
      a.phone ?? "",
      a.reference_number ?? "",
      new Date(a.marked_at).toLocaleString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.title.replace(/\s+/g, "-").toLowerCase() ?? "event"}-attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!event) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Attendance: {event.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {new Date(event.start_at).toLocaleString()} &middot; {attendees.length} attendee(s)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="border-slate-800 bg-black/30">
          <CardHeader>
            <CardTitle>Link &amp; QR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Attendance QR code" className="mx-auto rounded-md bg-white p-2" />
            )}
            <p className="break-all rounded-md border border-slate-800 bg-slate-900/60 p-2 text-xs text-slate-400">
              {attendanceUrl}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyLink} className="flex-1 gap-1.5">
                {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button size="sm" variant="outline" onClick={downloadQr} className="flex-1 gap-1.5">
                Download
              </Button>
            </div>
            <p className="text-center text-xs text-slate-500">
              Share this link or QR with attendees. No login required to mark attendance.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-black/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Records ({attendees.length})</CardTitle>
            <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1.5">
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {attendees.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No attendance marked yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Phone</th>
                      <th className="pb-2">Reference</th>
                      <th className="pb-2">Time</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {attendees.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2 text-slate-200">{a.full_name}</td>
                        <td className="py-2 text-slate-400">{a.email ?? "—"}</td>
                        <td className="py-2 text-slate-400">{a.phone ?? "—"}</td>
                        <td className="py-2 text-slate-400">{a.reference_number ?? "—"}</td>
                        <td className="py-2 text-slate-500">{new Date(a.marked_at).toLocaleTimeString()}</td>
                        <td className="py-2">
                          <button
                            onClick={() => removeAttendee(a.id)}
                            className="text-xs text-slate-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
