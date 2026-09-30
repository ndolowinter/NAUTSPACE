// Hand-authored mirror of supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once the project is linked.

export type UserRole =
  | "student"
  | "researcher"
  | "partner"
  | "government"
  | "executive"
  | "admin";

export type ApplicationTrack =
  | "space_systems"
  | "autonomous_uav"
  | "ai_data_fusion"
  | "cybersecurity"
  | "rf_engineering"
  | "astrotourism_management"
  | "pilot_license"
  | "drone_mapping"
  | "drone_building"
  | "videography_photography";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "interview"
  | "accepted"
  | "rejected";

export type TicketType =
  | "stem_tour"
  | "flight_simulator"
  | "stargazing_expedition"
  | "launch_viewing"
  | "dark_sky_reserve";

export type ProposalStatus =
  | "draft"
  | "active"
  | "passed"
  | "rejected"
  | "executed"
  | "overridden";

export type InquiryType =
  | "defense_agency"
  | "university"
  | "venture_partner"
  | "government"
  | "general_b2b";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export type MembershipStatus = "trial" | "active" | "expired" | "cancelled";

export type BookingStatus = "pending" | "approved" | "denied";

export type OpportunityType = "internship" | "competition" | "job" | "scholarship";

export type OpportunityStatus = "draft" | "published";

// NOTE: these are `type` aliases, not `interface`s, on purpose. TypeScript's
// "any object type may be assigned to an index-signature type like
// Record<string, unknown>" leniency only applies to type aliases an
// interface (kept "open" for declaration merging) is NOT considered
// assignable to Record<string, unknown>. @supabase/postgrest-js's
// GenericTable requires Row/Insert/Update to satisfy Record<string,
// unknown>, so declaring these as `interface` silently makes every table's
// Row/Insert/Update resolve to `never` throughout the app which is
// exactly the failure mode `supabase gen types typescript` avoids by always
// emitting `type`, never `interface`.

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  organization: string | null;
  is_2fa_enabled: boolean;
  totp_secret_encrypted: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ScienceCenter = {
  id: string;
  name: string;
  country: string;
  city: string | null;
  lat: number;
  lng: number;
  description: string | null;
  has_flight_simulator: boolean;
  created_at: string;
};

export type ScienceCenterBooking = {
  id: string;
  user_id: string;
  center_id: string;
  date: string;
  ticket_type: TicketType;
  party_size: number;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

export type Application = {
  id: string;
  applicant_id: string;
  track: ApplicationTrack;
  cover_note: string | null;
  resume_url: string;
  status: ApplicationStatus;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PartnershipInquiry = {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  inquiry_type: InquiryType;
  message: string;
  classified_priority: number;
  created_at: string;
};

export type DaoProposal = {
  id: string;
  title: string;
  description: string;
  proposed_by: string;
  votes_for: number;
  votes_against: number;
  status: ProposalStatus;
  gov_override_active: boolean;
  gov_override_reason: string | null;
  treasury_amount: number | null;
  treasury_asset: string | null;
  voting_opens_at: string | null;
  voting_closes_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DaoVote = {
  id: string;
  proposal_id: string;
  voter_id: string;
  weight: number;
  support: boolean;
  created_at: string;
};

export type OsaiEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string | null;
  category: string | null;
  banner_image_url: string | null;
  status: EventStatus;
  featured: boolean;
  attendance_token: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventAttendance = {
  id: string;
  event_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  reference_number: string | null;
  marked_at: string;
};

export type Opportunity = {
  id: string;
  title: string;
  type: OpportunityType;
  description: string | null;
  organization: string | null;
  location: string | null;
  application_deadline: string | null;
  application_link: string | null;
  requirements: string | null;
  banner_image_url: string | null;
  status: OpportunityStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Membership = {
  id: string;
  user_id: string;
  status: MembershipStatus;
  trial_ends_at: string;
  current_period_end: string | null;
  mpesa_checkout_request_id: string | null;
  last_payment_at: string | null;
  created_at: string;
  updated_at: string;
};

// @supabase/postgrest-js's GenericTable requires a `Relationships` array (used
// to type embedded-resource selects like `.select('*, other_table(*)')`). This
// hand-rolled schema doesn't model foreign-key relationships, so every table
// declares an empty one omitting it entirely fails to satisfy the generic
// constraint on SupabaseClient<Database>.
type NoRelationships = { Relationships: [] };

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> } & NoRelationships;
      science_centers: {
        Row: ScienceCenter;
        Insert: Partial<ScienceCenter>;
        Update: Partial<ScienceCenter>;
      } & NoRelationships;
      science_center_bookings: {
        Row: ScienceCenterBooking;
        Insert: Partial<ScienceCenterBooking>;
        Update: Partial<ScienceCenterBooking>;
      } & NoRelationships;
      applications: {
        Row: Application;
        Insert: Partial<Application>;
        Update: Partial<Application>;
      } & NoRelationships;
      partnership_inquiries: {
        Row: PartnershipInquiry;
        Insert: Partial<PartnershipInquiry>;
        Update: Partial<PartnershipInquiry>;
      } & NoRelationships;
      dao_proposals: {
        Row: DaoProposal;
        Insert: Partial<DaoProposal>;
        Update: Partial<DaoProposal>;
      } & NoRelationships;
      dao_votes: { Row: DaoVote; Insert: Partial<DaoVote>; Update: Partial<DaoVote> } & NoRelationships;
      events: { Row: OsaiEvent; Insert: Partial<OsaiEvent>; Update: Partial<OsaiEvent> } & NoRelationships;
      event_attendance: {
        Row: EventAttendance;
        Insert: Partial<EventAttendance>;
        Update: Partial<EventAttendance>;
      } & NoRelationships;
      memberships: {
        Row: Membership;
        Insert: Partial<Membership>;
        Update: Partial<Membership>;
      } & NoRelationships;
      opportunities: {
        Row: Opportunity;
        Insert: Partial<Opportunity>;
        Update: Partial<Opportunity>;
      } & NoRelationships;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** Roles permitted past the /executive gate. Kept in sync with middleware.ts. */
export const EXECUTIVE_ROLES: UserRole[] = ["government", "executive", "admin"];

/**
 * The single account allowed past the /admin gate. Unlike /executive (which
 * accepts any government/executive/admin profile), the Admin Panel is
 * intentionally restricted to this one email kept in sync with
 * middleware.ts and src/app/admin/layout.tsx.
 */
export const SUPERUSER_EMAIL = "winters.shadrack@gmail.com";

export function isSuperuserEmail(email: string | null | undefined): boolean {
  return (email ?? "").toLowerCase() === SUPERUSER_EMAIL.toLowerCase();
}
