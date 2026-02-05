import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { FraudCheckResult } from '@/entities/analysis';

interface FraudCheckResponse {
  success: boolean;
  data?: FraudCheckResult;
  error?: string;
}

type CheckType = 'PHONE' | 'ACCOUNT';

interface FraudCheckParams {
  type: CheckType;
  value: string;
  bankCode?: string;
}

export function useFraudCheck() {
  return useMutation({
    mutationFn: async ({ type, value, bankCode }: FraudCheckParams): Promise<FraudCheckResult> => {
      const response = await apiClient.post<FraudCheckResponse>('/api/fraud/check', {
        type,
        value: value.replace(/-/g, '').replace(/ /g, '').trim(),
        bank_code: bankCode,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '조회 실패');
    },
  });
}
