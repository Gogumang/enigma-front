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

interface ScammerMatch {
  id: string;
  name: string;
  confidence: number;
  reportCount: number;
  reportedAt: Date;
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
  scammerMatches: ScammerMatch[];
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

interface ReportResponse {
  success: boolean;
  data?: { message: string };
  error?: string;
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
          scammerMatches: response.data.scammerMatches ?? [],
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

export function useScammerReport() {
  return useMutation({
    mutationFn: async ({ image, name }: { image: File; name: string }): Promise<{ message: string }> => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', name.trim());

      const response = await apiClient.postFormData<ReportResponse>('/api/profile/report', formData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || '신고 실패');
    },
  });
}
