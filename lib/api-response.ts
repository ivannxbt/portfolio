import { NextResponse } from "next/server";
import type { ApiError } from "@/shared/contracts";

export const apiError = (status: number, error: string, code?: string) =>
  NextResponse.json<ApiError>({ error, code }, { status });
