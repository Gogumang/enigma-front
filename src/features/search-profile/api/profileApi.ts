import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

interface ProfileResult {
  platform: string;
  name: string;
  username: string;
  profileUrl: string;
  imageUrl: string;
  matchScore: number;
}


interface ReverseSearchLink {
  platform: string;
  name: string;
  url: string;
  icon: string;
}

interface WebImageResult {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  platform: string;
  matchScore: number;
}

export interface SearchResult {
  totalFound: number;
  reverseSearchLinks: ReverseSearchLink[];
  webImageResults: WebImageResult[];
  uploadedImageUrl: string | null;
  results: {
    instagram: ProfileResult[];
    facebook: ProfileResult[];
    twitter: ProfileResult[];
    linkedin: ProfileResult[];
    google: ProfileResult[];
  };
}

interface ProfileSearchResponse {
  success: boolean;
  data?: SearchResult;
  error?: string;
}


export interface DetectedFace {
  index: number;
  imageBase64: string;
  facialArea: { x: number; y: number; w: number; h: number };
  confidence: number;
}

interface FaceDetectResponse {
  success: boolean;
  data?: { faces: DetectedFace[]; count: number; message?: string };
  error?: string;
}

export function useFaceDetect() {
  return useMutation({
    mutationFn: async (image: File): Promise<DetectedFace[]> => {
      const formData = new FormData();
      formData.append('image', image);

      const response = await apiClient.postFormData<FaceDetectResponse>(
        '/api/profile/detect-faces',
        formData,
      );

      if (response.success && response.data) {
        return response.data.faces;
      }

      throw new Error(response.error || '얼굴 감지 실패');
    },
  });
}

export function useProfileSearch() {
  return useMutation({
    mutationFn: async ({ image, query }: { image?: File; query?: string }): Promise<SearchResult> => {
      const formData = new FormData();
      if (image) formData.append('image', image);
      if (query) formData.append('query', query.trim());

      const response = await apiClient.postFormData<ProfileSearchResponse>('/api/profile/search', formData);

      if (response.success && response.data) {
        return {
          totalFound: response.data.totalFound ?? 0,
          reverseSearchLinks: response.data.reverseSearchLinks ?? [],
          webImageResults: response.data.webImageResults ?? [],
          uploadedImageUrl: response.data.uploadedImageUrl ?? null,
          results: {
            instagram: response.data.results?.instagram ?? [],
            facebook: response.data.results?.facebook ?? [],
            twitter: response.data.results?.twitter ?? [],
            linkedin: response.data.results?.linkedin ?? [],
            google: response.data.results?.google ?? [],
          },
        };
      }

      throw new Error(response.error || '검색 실패');
    },
  });
}

