import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { API_URL } from '@/shared/config/env';
import type { Persona, SessionData, TrainingResult } from '@/entities/persona';

interface PersonasResponse {
  success: boolean;
  data?: { personas: Persona[] };
  error?: string;
}

interface StartSessionResponse {
  success: boolean;
  data?: SessionData;
  error?: string;
}

interface MessageResponse {
  success: boolean;
  data?: {
    scammerMessage: string;
    turnCount: number;
    hint?: string;
    imageUrl?: string;
    isCompleted?: boolean;
    completionReason?: string;
    userScore?: number;
  };
  error?: string;
}

interface EndSessionResponse {
  success: boolean;
  data?: TrainingResult;
  error?: string;
}

export function usePersonas() {
  return useQuery({
    queryKey: ['training', 'personas'],
    queryFn: async (): Promise<Persona[]> => {
      const response = await apiClient.get<PersonasResponse>('/api/training/personas');
      if (response.success && response.data) {
        // profile_photo를 전체 URL로 변환
        return response.data.personas.map(persona => ({
          ...persona,
          profile_photo: persona.profile_photo ? `${API_URL}${persona.profile_photo}` : '',
        }));
      }
      throw new Error(response.error || 'Failed to fetch personas');
    },
  });
}

export function useStartSession() {
  return useMutation({
    mutationFn: async (personaId: string): Promise<SessionData> => {
      const response = await apiClient.post<StartSessionResponse>('/api/training/start', {
        persona_id: personaId,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || 'Failed to start session');
    },
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }): Promise<{
      scammerMessage: string;
      turnCount: number;
      hint?: string;
      imageUrl?: string;
      isCompleted?: boolean;
      completionReason?: string;
      userScore?: number;
    }> => {
      const response = await apiClient.post<MessageResponse>('/api/training/message', {
        session_id: sessionId,
        message,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || 'Failed to send message');
    },
  });
}

export function useEndSession() {
  return useMutation({
    mutationFn: async ({
      sessionId,
      reason,
    }: {
      sessionId: string;
      reason: 'completed' | 'user_ended';
    }): Promise<TrainingResult> => {
      const response = await apiClient.post<EndSessionResponse>('/api/training/end', {
        session_id: sessionId,
        reason,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || 'Failed to end session');
    },
  });
}
