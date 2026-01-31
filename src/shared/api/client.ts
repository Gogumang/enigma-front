import { API_URL } from '@/shared/config/env';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed', data);
    }

    return data;
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed', data);
    }

    return data;
  },

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed', data);
    }

    return data;
  },
};

export { ApiError };
