export function containsStoragePath(value: unknown, storagePath: string): boolean {
  if (typeof value === "string") return value === storagePath;
  if (Array.isArray(value)) {
    return value.some((item) => containsStoragePath(item, storagePath));
  }
  if (value && typeof value === "object") {
    return Object.values(value).some((item) =>
      containsStoragePath(item, storagePath),
    );
  }
  return false;
}
