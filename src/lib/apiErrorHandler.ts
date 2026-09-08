/**
 * Utility to consistently parse validation and standard API errors from the backend.
 * 
 * @param data The JSON data returned from the API response
 * @param fallback The fallback message to use if a clear error cannot be extracted
 * @returns A formatted error string suitable for UI display (e.g., in a toast)
 */
export const parseApiError = (
  data: any,
  fallback: string = "Something went wrong. Please try again."
): string => {
  if (!data) return fallback;

  // Handle flat array of errors (e.g. validation errors: ["Password must contain..."])
  if (Array.isArray(data)) {
    const messages = data.filter((item) => typeof item === "string");
    return messages.length > 0 ? messages.join("\n") : fallback;
  }

  // Handle object structure
  if (typeof data === "object") {
    // e.g., { errors: ["Error 1", "Error 2"] }
    if (Array.isArray(data.errors)) {
      const messages = data.errors.filter((item) => typeof item === "string");
      if (messages.length > 0) return messages.join("\n");
    }

    // e.g., { message: "Invalid credentials" }
    if (data.message && typeof data.message === "string") {
      return data.message;
    }
  }

  // Handle pure string
  if (typeof data === "string") {
    return data;
  }

  return fallback;
};
