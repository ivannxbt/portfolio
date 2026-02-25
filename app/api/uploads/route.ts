import { NextRequest, NextResponse } from "next/server";

import { createSessionValidator } from "@/backend/auth/session-validator";
import { validateUploadFile } from "@/backend/contracts/uploads";
import { saveUpload } from "@/backend/services/upload-service";

export async function POST(request: NextRequest) {
  const auth = await createSessionValidator().validateSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const formData = await request.formData();
  const result = validateUploadFile(formData.get("file") as File | null);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const response = await saveUpload(result.file);
  return NextResponse.json(response);
}
