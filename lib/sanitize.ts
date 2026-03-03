const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/g;
const ZERO_WIDTH_PATTERN = /[\u200B-\u200D\uFEFF]/g;

const MAX_DEPTH = 50;

export type SanitizeOptions = {
  maxLength?: number;
  collapseWhitespace?: boolean;
};

export function sanitizePlainText(
  input: unknown,
  options: SanitizeOptions = {},
): string {
  const { maxLength, collapseWhitespace = false } = options;

  if (input === null || input === undefined) {
    return "";
  }

  let text = String(input);

  text = text.replace(/\r\n?/g, "\n");
  text = text.replace(CONTROL_CHAR_PATTERN, "");
  text = text.replace(ZERO_WIDTH_PATTERN, "");

  if (collapseWhitespace) {
    text = text.replace(/[ \t]+/g, " ");
  }

  text = text.trim();

  if (
    typeof maxLength === "number" &&
    maxLength > 0 &&
    text.length > maxLength
  ) {
    text = text.slice(0, maxLength);
  }

  return text;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function sanitizeStringRecord<T>(
  value: T,
  options?: SanitizeOptions,
  depth = 0,
): T {
  if (depth > MAX_DEPTH) {
    throw new Error(
      `Maximum sanitize depth (${MAX_DEPTH}) exceeded. This may indicate a circular reference or malicious input.`,
    );
  }

  if (typeof value === "string") {
    return sanitizePlainText(value, options) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      sanitizeStringRecord(item, options, depth + 1),
    ) as unknown as T;
  }

  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeStringRecord(val as unknown, options, depth + 1);
    }
    return result as T;
  }

  return value;
}
