import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { VerifyResult } from '@/entities/analysis';

interface VerifyResponse {
  success: boolean;
  data?: VerifyResult;
  error?: string;
}

export function useVerify() {
  return useMutation({
    mutationFn: async (value: string): Promise<VerifyResult> => {
      const response = await apiClient.post<VerifyResponse>('/api/verify/check', { value });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '검증 실패');
    },
  });
}
