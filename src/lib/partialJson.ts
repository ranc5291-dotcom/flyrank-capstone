// src/lib/partialJson.ts

// Best-effort parser for incomplete/streaming JSON.
function stripTrailingCommas(text: string): string {
  return text.replace(/,(\s*[}\]])/g, "$1");
}

export function tryParsePartialJson<T = unknown>(raw: string): T | null {
  let text = raw.trim();
  text = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  if (!text) return null;

  try {
    return JSON.parse(stripTrailingCommas(text)) as T;
  } catch {
    // fall through to the repair attempt below
  }

  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (const ch of text) {
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" && stack[stack.length - 1] === "{") stack.pop();
    else if (ch === "]" && stack[stack.length - 1] === "[") stack.pop();
  }

  let fixed = text;
  if (inString) fixed += '"';
  fixed = fixed.replace(/,\s*$/, "");
  for (let i = stack.length - 1; i >= 0; i--) {
    fixed += stack[i] === "{" ? "}" : "]";
  }

  try {
    return JSON.parse(stripTrailingCommas(fixed)) as T;
  } catch (err) {
    // DEBUG — only fires when the stack was empty (i.e. this looked
    // like a fully-closed, complete response) and it STILL failed to
    // parse. Remove once the real cause is found.
    if (stack.length === 0 && text.length > 20) {
      console.warn("[tryParsePartialJson] failed on what looked like complete JSON:", {
        error: (err as Error).message,
        text,
        fixed,
      });
    }
    return null;
  }
}