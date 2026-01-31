import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { AnalysisData } from '@/entities/analysis';

interface AnalyzeResponse {
  success: boolean;
  data?: {
    riskScore: number;
    riskCategory: string;
    aiAnalysis: string;
    warningSigns: string[];
    detectedPatterns: Array<{ keyword: string; category: string }>;
    recommendations: string[];
    interpretationSteps?: string[];
    parsedMessages?: Array<{ role: string; content: string }>;
    ragContext?: {
      matched_phrases: Array<{
        id: string;
        text: string;
        category: string;
        severity: number;
        usage_count: number;
      }>;
      similar_cases: Array<{
        id: string;
        title: string;
        description: string;
        damage_amount: number;
        platform: string;
      }>;
      risk_indicators: string[];
      total_reports: number;
    };
  };
  error?: string;
}

function transformResponse(data: AnalyzeResponse['data']): AnalysisData | undefined {
  if (!data) return undefined;

  const detectedPatterns = (data.detectedPatterns || []).map((p) => ({
    pattern: p.keyword || p.category,
    category: p.category,
    severity: 'medium',
  }));

  return {
    riskLevel: data.riskScore < 30 ? 'safe' : data.riskScore < 60 ? 'warning' : 'danger',
    riskScore: data.riskScore,
    summary: data.riskCategory || '분석 완료',
    analysis: data.aiAnalysis || '',
    reasons: data.warningSigns || [],
    detectedPatterns,
    recommendations: data.recommendations || [],
    savedToRag: false,
    interpretationSteps: data.interpretationSteps || [],
    parsedMessages: data.parsedMessages?.map((pm) => ({
      role: pm.role as 'sender' | 'receiver' | 'unknown',
      content: pm.content,
    })),
    ragContext: data.ragContext,
  };
}

export function useChatAnalysis() {
  return useMutation({
    mutationFn: async (messages: string[]): Promise<{ analysis?: AnalysisData; error?: string }> => {
      try {
        const response = await apiClient.post<AnalyzeResponse>('/api/chat/analyze', { messages });

        if (response.success && response.data) {
          return { analysis: transformResponse(response.data) };
        }

        return { error: response.error || '분석 실패' };
      } catch (err) {
        return { error: err instanceof Error ? err.message : '서버 연결에 실패했습니다' };
      }
    },
  });
}

export function useScreenshotAnalysis() {
  return useMutation({
    mutationFn: async (file: File): Promise<{ analysis?: AnalysisData; error?: string }> => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.postFormData<AnalyzeResponse>('/api/chat/analyze-screenshot', formData);

        if (response.success && response.data) {
          return { analysis: transformResponse(response.data) };
        }

        return { error: response.error || '분석 실패' };
      } catch (err) {
        return { error: err instanceof Error ? err.message : '서버 연결에 실패했습니다' };
      }
    },
  });
}
