import { NextRequest, NextResponse } from "next/server";
import type { LandingContent } from "@/content/site-content";
import { getServerSession } from "next-auth";
import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";
import { apiError } from "@/lib/api-response";
import {
  ContentQuerySchema,
  ContentUpdateRequestSchema,
  ContentGetResponseSchema,
  ContentUpdateResponseSchema,
} from "@/shared/contracts";
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
    const queryParse = ContentQuerySchema.safeParse({ lang: searchParams.get("lang") ?? undefined });

    if (!queryParse.success) {
      return apiError(400, "Invalid language parameter.", "INVALID_QUERY");
    }

    if (queryParse.data.lang) {
      const data = await getLandingContent(queryParse.data.lang);
      return NextResponse.json(ContentGetResponseSchema.parse({ data }));
    }

    const data = await getAllLandingContent();
    return NextResponse.json(ContentGetResponseSchema.parse({ data }));
  } catch (error) {
    console.error("Content API GET error:", error);
    return apiError(500, "Failed to load content.", "INTERNAL_ERROR");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authOptions = getAuthOptions();
    if (!authOptions) {
      console.error("Content API PUT blocked:", NEXTAUTH_SECRET_ERROR);
      return apiError(500, NEXTAUTH_SECRET_ERROR, "AUTH_NOT_CONFIGURED");
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await request.json().catch(() => null);
    const parsedBody = ContentUpdateRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return apiError(400, "Payload must include a valid lang and content object.", "INVALID_PAYLOAD");
    }

    const { lang, content } = parsedBody.data as { lang: "en" | "es"; content: Partial<LandingContent> };

    const overrides = await readOverrides();
    const current = overrides[lang] ?? {};
    overrides[lang] = deepMerge(current, content);
    await writeOverrides(overrides);

    const data = await getLandingContent(lang);
    return NextResponse.json(ContentUpdateResponseSchema.parse({ data }));
  } catch (error) {
    console.error("Content API PUT error:", error);
    return apiError(500, "Failed to update content.", "INTERNAL_ERROR");
  }
}
