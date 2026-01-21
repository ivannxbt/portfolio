import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "@/components/admin-client";
import { getLandingContent } from "@/lib/content-store";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch content for English (default language) on the server.
  // AdminClient is responsible for fetching other languages via /api/content?lang=...
  const initialContent = await getLandingContent("en");

  return <AdminClient initialContent={initialContent} />;
}
