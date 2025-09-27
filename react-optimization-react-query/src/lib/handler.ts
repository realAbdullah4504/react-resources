type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig<TBody = unknown> = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
};

export const apiHandler = async <TResponse = unknown, TBody = undefined>(
  endpoint: string,
  config: RequestConfig<TBody> = { method: "GET" }
): Promise<TResponse> => {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const requestConfig: RequestInit = {
    method: config.method || "GET",
    headers: {
      ...defaultHeaders,
      ...(config.headers || {}),
    },
    credentials: config.credentials || "same-origin",
    mode: config.mode || "cors",
    cache: config.cache || "default",
  };

  // Only include body for methods that support it
  if (
    config.body !== undefined &&
    !["GET", "HEAD"].includes(config.method || "GET")
  ) {
    requestConfig.body =
      typeof config.body === "string"
        ? config.body
        : JSON.stringify(config.body);
  }

  const response = await fetch(endpoint, requestConfig);

  if (response.status === 204) {
    return null as unknown as TResponse;
  }

  if (!response.ok) {
    const error = await response.json() as { message: string };
    throw new Error(
      (error as { message: string }).message ||
        `HTTP error! status: ${response.status}`
    );
  }

  return response.json() as Promise<TResponse>;
};
