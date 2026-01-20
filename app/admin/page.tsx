import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { requireAuthOptions } from "@/lib/auth";
import { AdminClient } from "@/components/admin-client";
import { getLandingContent } from "@/lib/content-store";
import { type LandingContent } from "@/content/site-content";

export default async function AdminPage() {
  const authOptions = requireAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch content for English (default language)
  const initialContent = await getLandingContent("en");

  return <AdminClient initialContent={initialContent} />;
}
