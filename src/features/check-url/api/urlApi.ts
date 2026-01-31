import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { UrlCheckResult } from '@/entities/analysis';

interface UrlCheckResponse {
  success: boolean;
  data?: {
    status: 'safe' | 'warning' | 'danger';
    domain: string;
    isHttps: boolean;
    suspiciousPatterns: string[];
  };
  error?: string;
}

export function useUrlCheck() {
  return useMutation({
    mutationFn: async (url: string): Promise<UrlCheckResult | null> => {
      const response = await apiClient.post<UrlCheckResponse>('/api/url/check', { url });

      if (response.success && response.data) {
        return {
          status: response.data.status,
          domain: response.data.domain,
          https: response.data.isHttps,
          warnings: response.data.suspiciousPatterns || [],
        };
      }

      throw new Error(response.error || '검사 실패');
    },
  });
}
