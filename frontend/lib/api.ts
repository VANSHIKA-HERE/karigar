export interface ApiOptions extends RequestInit {
  useBaseUrl?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json"
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: Record<string, unknown> = await response.json().catch(() => ({}));
    throw new Error((error.message as string) || response.statusText);
  }

  return response.json();
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { useBaseUrl = true, headers, ...rest } = options;
  const url = useBaseUrl ? `${BASE_URL}${path}` : path;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...headers
    },
    ...rest
  });

  return parseResponse<T>(response);
}
