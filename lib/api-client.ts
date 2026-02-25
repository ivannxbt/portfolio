import { z } from "zod";
import {
  ApiErrorSchema,
  ChatRequestSchema,
  ChatResponseSchema,
  ContentGetResponseSchema,
  ContentUpdateRequestSchema,
  ContentUpdateResponseSchema,
  UploadResponseSchema,
} from "@/shared/contracts";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

const parseError = (payload: unknown): { error: string; code?: string } | null => {
  const result = ApiErrorSchema.safeParse(payload);
  return result.success ? result.data : null;
};

const parseJson = async <TSchema extends z.ZodTypeAny>(
  response: Response,
  schema: TSchema
): Promise<z.infer<TSchema>> => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = parseError(payload);
    throw new ApiClientError(
      parsedError?.error ?? `Request failed with status ${response.status}`,
      response.status,
      parsedError?.code
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiClientError("Invalid API response payload.", 500, "INVALID_RESPONSE");
  }

  return parsed.data;
};

export const apiClient = {
  async chat(input: z.input<typeof ChatRequestSchema>) {
    const request = ChatRequestSchema.parse(input);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    return parseJson(response, ChatResponseSchema);
  },

  async getContent(lang?: "en" | "es", options?: { signal?: AbortSignal }) {
    const query = new URLSearchParams();
    if (lang) {
      query.set("lang", lang);
    }

    const response = await fetch(`/api/content${query.size ? `?${query.toString()}` : ""}`, {
      next: { revalidate: 60 },
      signal: options?.signal,
    });

    return parseJson(response, ContentGetResponseSchema);
  },

  async updateContent(input: z.input<typeof ContentUpdateRequestSchema>) {
    const request = ContentUpdateRequestSchema.parse(input);
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    return parseJson(response, ContentUpdateResponseSchema);
  },

  async upload(file: File) {
    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    return parseJson(response, UploadResponseSchema);
  },
};
