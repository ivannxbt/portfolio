import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getAuthOptions } from "@/lib/auth";
import { AdminClient } from "@/components/admin-client";
import { getLandingContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authOptions = getAuthOptions();

  if (!authOptions) {
    redirect("/admin/login?error=config");
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch content for English (default language) on the server.
  // AdminClient is responsible for fetching other languages via /api/content?lang=...
  const initialContent = await getLandingContent("en");

  return <AdminClient initialContent={initialContent} />;
}
