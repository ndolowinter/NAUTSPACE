import type { Metadata } from "next";
import { SecureDirectory } from "@/components/executive/SecureDirectory";
import { SecureMessenger } from "@/components/executive/SecureMessenger";

export const metadata: Metadata = {
  title: "Secure Internal Communications",
};

export default function SecureContactsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Secure Internal Communications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Restricted directory and encrypted messaging for cleared government, defense, and
          investor contacts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SecureDirectory />
        <SecureMessenger />
      </div>
    </div>
  );
}
