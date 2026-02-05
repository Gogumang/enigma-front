import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { UrlCheckResult } from '@/entities/analysis';

interface UrlCheckResponse {
  success: boolean;
  data?: UrlCheckResult;
  error?: string;
}

export function useUrlCheck() {
  return useMutation({
    mutationFn: async (url: string): Promise<UrlCheckResult> => {
      const response = await apiClient.post<UrlCheckResponse>('/api/url/check', { url });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '검사 실패');
    },
  });
}
