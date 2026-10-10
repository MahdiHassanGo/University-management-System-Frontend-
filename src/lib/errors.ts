export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (typeof error === "object" && error !== null) {
    const data = "data" in error ? error.data : undefined;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    )
      return data.message;
    if ("message" in error && typeof error.message === "string")
      return error.message;
  }
  return fallback;
}
