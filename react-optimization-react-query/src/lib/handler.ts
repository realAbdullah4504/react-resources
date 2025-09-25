type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestConfig = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
};

// Remove the custom ApiResponse type as React Query handles this internally

export const apiHandler = async <T = any>(
  endpoint: string,
  config: RequestConfig = { method: 'GET' }
): Promise<T> => {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const requestConfig: RequestInit = {
    method: config.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...(config.headers || {}),
    },
    credentials: config.credentials || 'same-origin',
    mode: config.mode || 'cors',
    cache: config.cache || 'default',
  };

  // Only include body for methods that support it
  if (config.body && !['GET', 'HEAD'].includes(config.method || 'GET')) {
    requestConfig.body = typeof config.body === 'string' 
      ? config.body 
      : JSON.stringify(config.body);
  }

  const response = await fetch(endpoint, requestConfig);
  
  // For 204 No Content responses
  if (response.status === 204) {
    return null as unknown as T;
  }

  // Let React Query handle non-200 responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// For backward compatibility
export const handler = apiHandler;