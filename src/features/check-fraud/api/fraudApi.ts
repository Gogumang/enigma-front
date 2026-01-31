import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { FraudCheckResult } from '@/entities/analysis';

interface FraudCheckResponse {
  success: boolean;
  data?: {
    status: 'safe' | 'danger';
    records: Array<{ type: string; date: string; description: string }>;
  };
  error?: string;
}

type CheckType = 'PHONE' | 'ACCOUNT' | 'EMAIL';

export function useFraudCheck() {
  return useMutation({
    mutationFn: async ({ type, value }: { type: CheckType; value: string }): Promise<FraudCheckResult> => {
      const response = await apiClient.post<FraudCheckResponse>('/api/fraud/check', {
        type,
        value: value.replace(/-/g, '').trim(),
      });

      if (response.success && response.data) {
        return {
          safe: response.data.status === 'safe',
          type,
          records: (response.data.records || []).map((r) => ({
            type: r.type,
            date: r.date,
            desc: r.description,
          })),
        };
      }

      throw new Error(response.error || '조회 실패');
    },
  });
}
