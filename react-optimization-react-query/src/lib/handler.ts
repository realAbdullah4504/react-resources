type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestConfig = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
};

type ApiResponse<T = any> = {
  data: T | null;
  error: Error | null;
  status: number | null;
};

export const apiHandler = async <T = any>(
  endpoint: string,
  config: RequestConfig = { method: 'GET' }
): Promise<ApiResponse<T>> => {
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

  try {
    const response = await fetch(endpoint, requestConfig);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return { data: null as unknown as T, error: null, status: 204 };
    }

    const data = await response.json().catch(() => ({}));
    
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('An unknown error occurred'),
      status: null,
    };
  }
};

// For backward compatibility
export const handler = apiHandler;
