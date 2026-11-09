export async function fetchClient(
  endpoint: string,
  options: RequestInit = {}
) {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("rideshare_token") || "";
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(endpoint, config);

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rideshare_token");
      localStorage.removeItem("rideshare_user");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
