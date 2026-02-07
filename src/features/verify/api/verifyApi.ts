import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { VerifyResult } from '@/entities/analysis';

interface VerifyResponse {
  success: boolean;
  data?: VerifyResult;
  error?: string;
}

type VerifyType = 'URL' | 'PHONE' | 'ACCOUNT';

const typeEndpoints: Record<VerifyType, string> = {
  URL: '/api/verify/url',
  PHONE: '/api/verify/phone',
  ACCOUNT: '/api/verify/account',
};

export function useVerify() {
  return useMutation({
    mutationFn: async ({ type, value }: { type: VerifyType; value: string }): Promise<VerifyResult> => {
      const endpoint = typeEndpoints[type];
      const response = await apiClient.post<VerifyResponse>(endpoint, { value });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '검증 실패');
    },
  });
}
