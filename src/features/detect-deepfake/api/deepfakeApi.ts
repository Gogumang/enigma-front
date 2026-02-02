import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

interface Marker {
  id: number;
  x: number;
  y: number;
  label: string;
  description: string;
  intensity?: number;  // 의심 강도 (0-1)
  algorithm_flags?: string[];  // 해당 영역에서 감지된 알고리즘 이상
}

interface AlgorithmCheck {
  name: string;
  passed: boolean;
  score: number;
  description: string;
}

interface EnsembleDetails {
  model_confidence?: number;
  algorithm_score?: number;
  suspicious_algorithm_count?: number;
  ensemble_confidence?: number;
}

interface DeepfakeAnalysisData {
  isDeepfake: boolean;
  confidence: number;
  riskLevel: string;
  mediaType: string;
  message: string;
  details: {
    simulation?: boolean;
    model_confidence?: number;
    algorithm_score?: number;
    [key: string]: unknown;
  };
  analysisReasons?: string[];
  markers?: Marker[];
  technicalIndicators?: Array<{
    name: string;
    description: string;
    score: number;
  }>;
  overallAssessment?: string;
  heatmapImage?: string;  // 히트맵 이미지 (base64)
  algorithmChecks?: AlgorithmCheck[];  // 알고리즘 검사 결과
  ensembleDetails?: EnsembleDetails;  // 앙상블 상세 정보
}

interface DeepfakeResponse {
  success: boolean;
  data?: DeepfakeAnalysisData;
  error?: string;
}

export interface DeepfakeResult {
  type: 'image' | 'video';
  data: DeepfakeAnalysisData;
  analyzedAt: string;
  imageData: string;
}

export function useDeepfakeAnalysis() {
  return useMutation({
    mutationFn: async ({ file, isVideo }: { file: File; isVideo: boolean }): Promise<DeepfakeResult> => {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = isVideo
        ? '/api/deepfake/analyze/video'
        : '/api/deepfake/analyze/image';

      const response = await apiClient.postFormData<DeepfakeResponse>(endpoint, formData);

      if (response.success && response.data) {
        // Read file as data URL
        const imageData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        return {
          type: isVideo ? 'video' : 'image',
          data: response.data,
          analyzedAt: new Date().toISOString(),
          imageData,
        };
      }

      throw new Error(response.error || '분석 실패');
    },
  });
}
