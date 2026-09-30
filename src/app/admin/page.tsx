import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingApprovalControl } from "@/components/admin/BookingApprovalControl";
import { StatCard } from "@/components/ui/StatCard";

export const metadata: Metadata = {
  title: "Admin Panel",
};

const TICKET_LABELS: Record<string, string> = {
  stem_tour: "Virtual / On-site STEM Tour",
  flight_simulator: "Flight Simulator Session",
  stargazing_expedition: "Stargazing Expedition",
  launch_viewing: "Launch Viewing",
  dark_sky_reserve: "Dark-Sky Reserve Visit",
};

export default async function AdminPanelPage() {
  const supabase = createClient();

  const [{ data: pendingBookings }, { count: pendingApplications }, { count: totalUsers }, { count: totalEvents }] =
    await Promise.all([
      supabase
        .from("science_center_bookings")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "submitted"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
    ]);

  const userIds = [...new Set((pendingBookings ?? []).map((b) => b.user_id))];
  const centerIds = [...new Set((pendingBookings ?? []).map((b) => b.center_id))];

  const [{ data: profiles }, { data: centers }] = await Promise.all([
    userIds.length
      ? supabase.from("profiles").select("id, full_name, email").in("id", userIds)
      : Promise.resolve({ data: [] }),
    centerIds.length
      ? supabase.from("science_centers").select("id, name, city").in("id", centerIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const centerById = new Map((centers ?? []).map((c) => [c.id, c]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of what needs your attention.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Bookings" value={pendingBookings?.length ?? 0} tone="amber" />
        <StatCard label="Pending Applications" value={pendingApplications ?? 0} tone="cyan" />
        <StatCard label="Total Users" value={totalUsers ?? 0} tone="emerald" />
        <StatCard label="Total Events" value={totalEvents ?? 0} tone="cyan" />
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle>Bookings Awaiting Approval ({pendingBookings?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!pendingBookings?.length && (
            <p className="py-8 text-center text-sm text-slate-500">No bookings awaiting approval.</p>
          )}
          {pendingBookings?.map((booking) => {
            const profile = profileById.get(booking.user_id);
            const center = centerById.get(booking.center_id);
            return (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-100">
                    {profile?.full_name ?? "Unknown user"}
                    <span className="ml-2 text-xs text-slate-500">{profile?.email ?? "no email"}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {TICKET_LABELS[booking.ticket_type] ?? booking.ticket_type} at{" "}
                    {center?.name ?? "Unknown center"}
                    {center?.city ? ` (${center.city})` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {new Date(booking.date).toLocaleDateString()} &middot; Party of {booking.party_size}
                  </p>
                  {booking.notes && <p className="mt-1 text-xs text-slate-500">{booking.notes}</p>}
                </div>
                <BookingApprovalControl bookingId={booking.id} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
