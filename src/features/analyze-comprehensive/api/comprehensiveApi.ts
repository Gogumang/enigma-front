import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

export interface ComprehensiveRequest {
  image?: File;
  chatMessages?: string[];
  chatScreenshot?: File;
  phone?: string;
  account?: string;
  url?: string;
}

export interface ComprehensiveResult {
  deepfake: Record<string, unknown> | null;
  profile: Record<string, unknown> | null;
  chat: Record<string, unknown> | null;
  fraud: {
    phone?: Record<string, unknown>;
    account?: Record<string, unknown>;
  } | null;
  url: Record<string, unknown> | null;
  errors?: Record<string, string>;
}

interface ComprehensiveResponse {
  success: boolean;
  data?: ComprehensiveResult;
  error?: string;
}

export function useComprehensiveAnalysis() {
  return useMutation({
    mutationFn: async (req: ComprehensiveRequest): Promise<ComprehensiveResult> => {
      const formData = new FormData();

      if (req.image) {
        formData.append('image', req.image);
      }
      if (req.chatMessages && req.chatMessages.length > 0) {
        formData.append('chat_messages', JSON.stringify(req.chatMessages));
      }
      if (req.chatScreenshot) {
        formData.append('chat_screenshot', req.chatScreenshot);
      }
      if (req.phone) {
        formData.append('phone', req.phone);
      }
      if (req.account) {
        formData.append('account', req.account);
      }
      if (req.url) {
        formData.append('url', req.url);
      }

      const response = await apiClient.postFormData<ComprehensiveResponse>(
        '/api/comprehensive/analyze',
        formData,
        180_000, // 180s — 가장 느린 분석 기준
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '종합 분석 실패');
    },
  });
}
