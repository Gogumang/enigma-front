import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

interface IdentifierItem {
  type: string; // PHONE, ACCOUNT, SNS, URL
  value: string;
}

interface ReportRequest {
  overallScore: number;
  deepfakeScore: number;
  chatScore: number;
  fraudScore: number;
  urlScore: number;
  profileScore: number;
  reasons: string[];
  identifiers: IdentifierItem[];
  details: string;
}

interface ReportResponse {
  success: boolean;
  data?: {
    reportId: string;
    message: string;
  };
  error?: string;
}

interface CheckRequest {
  type: string;
  value: string;
}

interface CheckResponse {
  success: boolean;
  data?: {
    found: boolean;
    count: number;
    reports: Array<{
      id: string;
      overallScore: number;
      reportedAt: string;
    }>;
  };
  error?: string;
}

export function useScamReport() {
  return useMutation({
    mutationFn: async (request: ReportRequest): Promise<{ reportId: string; message: string }> => {
      const response = await apiClient.post<ReportResponse>('/api/report', request);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '신고 저장 실패');
    },
  });
}

export function useCheckExistingReports() {
  return useMutation({
    mutationFn: async (request: CheckRequest): Promise<{ found: boolean; count: number }> => {
      const response = await apiClient.post<CheckResponse>('/api/report/check', request);

      if (response.success && response.data) {
        return { found: response.data.found, count: response.data.count };
      }

      throw new Error(response.error || '조회 실패');
    },
  });
}

// ==================== Report Guide ====================

interface ReportGuideRequest {
  analysisResults: Record<string, unknown>;
  damageAmount?: number;
  damageDate?: string;
  userDescription?: string;
}

interface EmergencyAction {
  action: string;
  contact: string;
  isUrgent: boolean;
  deadlineHours: number | null;
  goldenTimeWarning: string | null;
}

interface ReportingStep {
  step: number;
  title: string;
  description: string;
  url: string | null;
  tip: string | null;
}

interface Agency {
  name: string;
  phone: string;
  url: string;
}

interface EvidenceSummary {
  category: string;
  riskLevel: string;
  summary: string;
}

export interface ReportGuideData {
  scamType: string;
  scamTypeLabel: string;
  dangerLevel: string;
  aiReportDraft: string;
  emergencyActions: EmergencyAction[];
  reportingSteps: ReportingStep[];
  agencies: Agency[];
  evidenceSummary: EvidenceSummary[];
}

export function useReportGuide() {
  return useMutation({
    mutationFn: async (req: ReportGuideRequest): Promise<ReportGuideData> => {
      const response = await apiClient.post<{ success: boolean; data?: ReportGuideData; error?: string }>(
        '/api/report/guide', req
      );
      if (response.success && response.data) return response.data;
      throw new Error(response.error || '신고 가이드 생성 실패');
    },
  });
}
