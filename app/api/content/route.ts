import { NextRequest, NextResponse } from "next/server";

import { createSessionValidator } from "@/backend/auth/session-validator";
import {
  parseContentGetQuery,
  parseContentPutRequest,
} from "@/backend/contracts/content";
import { fetchContent, updateContent } from "@/backend/services/content-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = parseContentGetQuery({ lang: searchParams.get("lang") });

    if (!query.ok) {
      return NextResponse.json({ error: query.error }, { status: query.status });
    }

    const response = await fetchContent(query.locale);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Content API GET error:", error);
    return NextResponse.json({ error: "Failed to load content." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await createSessionValidator().validateSession();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = parseContentPutRequest(await request.json());
    if (!body.ok) {
      return NextResponse.json({ error: body.error }, { status: body.status });
    }

    const response = await updateContent(body.lang, body.content);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Content API PUT error:", error);
    return NextResponse.json({ error: "Failed to update content." }, { status: 500 });
  }
}
