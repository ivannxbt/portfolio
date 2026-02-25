export const API_ENDPOINTS = {
  content: "/api/content",
  chat: "/api/chat",
  uploads: "/api/uploads",
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
