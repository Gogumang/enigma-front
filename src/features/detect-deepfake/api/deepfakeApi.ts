import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

interface Marker {
  id: number;
  x: number;
  y: number;
  label: string;
  description: string;
  intensity?: number;  // 의심 강도 (0-1)
}

interface DeepfakeAnalysisData {
  isDeepfake: boolean;
  confidence: number;
  riskLevel: string;
  mediaType: string;
  message: string;
  details: {
    simulation?: boolean;
    [key: string]: unknown;
  };
  analysisReasons?: string[];
  markers?: Marker[];
  technicalIndicators?: string[];
  overallAssessment?: string;
  heatmapImage?: string;  // 히트맵 이미지 (base64)
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
