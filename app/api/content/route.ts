import { NextRequest, NextResponse } from "next/server";
import type { LandingContent } from "@/content/site-content";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getServerSession } from "next-auth";
import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";
import {
  deepMerge,
  getAllLandingContent,
  getLandingContent,
  readOverrides,
  writeOverrides,
} from "@/lib/content-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get("lang");
    if (langParam) {
      if (!isValidLocale(langParam)) {
        return NextResponse.json(
          { error: "Invalid language parameter." },
          { status: 400 }
        );
      }
      const locale = langParam as Locale;
      const data = await getLandingContent(locale);
      return NextResponse.json({ data });
    }

    const data = await getAllLandingContent();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Content API GET error:", error);
    return NextResponse.json(
      { error: "Failed to load content." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authOptions = getAuthOptions();
    if (!authOptions) {
      console.error("Content API PUT blocked:", NEXTAUTH_SECRET_ERROR);
      return NextResponse.json({ error: NEXTAUTH_SECRET_ERROR }, { status: 500 });
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lang, content } = body as {
      lang?: string;
      content?: Partial<LandingContent>;
    };

    if (!lang || !isValidLocale(lang) || !content || typeof content !== "object") {
      return NextResponse.json(
        { error: "Payload must include a valid lang and content object." },
        { status: 400 }
      );
    }

    const overrides = await readOverrides();
    const current = overrides[lang] ?? {};
    overrides[lang] = deepMerge(current, content);
    await writeOverrides(overrides);

    const data = await getLandingContent(lang);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Content API PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update content." },
      { status: 500 }
    );
  }
}
