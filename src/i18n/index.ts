import ar from "./ar";

type TranslationTree = typeof ar;

function getNestedValue(obj: TranslationTree, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  const value = getNestedValue(ar, key);
  if (!value) return key;

  if (!params) return value;

  return Object.entries(params).reduce(
    (str, [paramKey, paramValue]) =>
      str.split(`{${paramKey}}`).join(String(paramValue)),
    value
  );
}

export { ar };
