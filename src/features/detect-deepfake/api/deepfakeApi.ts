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

// 비디오에서 썸네일 추출
async function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      // 0.5초 지점으로 이동 (첫 프레임이 검은색일 수 있음)
      video.currentTime = Math.min(0.5, video.duration / 2);
    };

    video.onseeked = () => {
      // 캔버스에 비디오 프레임 그리기
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 이미지 데이터 URL로 변환
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

      // 정리
      URL.revokeObjectURL(video.src);
      resolve(thumbnailUrl);
    };

    video.onerror = () => {
      // 실패 시 기본 플레이스홀더
      resolve('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23333" width="400" height="300"/><text x="50%" y="50%" fill="%23fff" text-anchor="middle" dy=".3em">Video</text></svg>');
    };

    video.src = URL.createObjectURL(file);
  });
}

export function useDeepfakeAnalysis() {
  return useMutation({
    mutationFn: async ({ file, isVideo }: { file: File; isVideo: boolean }): Promise<DeepfakeResult> => {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = isVideo
        ? '/api/deepfake/analyze/video'
        : '/api/deepfake/analyze/image';

      // 비디오는 분석 시간이 오래 걸리므로 타임아웃 3분으로 설정
      const timeout = isVideo ? 180000 : 60000;
      const response = await apiClient.postFormData<DeepfakeResponse>(endpoint, formData, timeout);

      if (response.success && response.data) {
        let imageData: string;

        if (isVideo) {
          // 비디오: 첫 프레임을 썸네일로 추출
          imageData = await extractVideoThumbnail(file);
        } else {
          // 이미지: 그대로 읽기
          imageData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

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
