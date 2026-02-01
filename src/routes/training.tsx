import { createFileRoute } from '@tanstack/react-router';
import TrainingPage from '@/pages/training/TrainingPage';

type TrainingSearch = {
  personaId?: string;
};

export const Route = createFileRoute('/training')({
  component: TrainingPage,
  validateSearch: (search: Record<string, unknown>): TrainingSearch => {
    return {
      personaId: search.personaId as string | undefined,
    };
  },
});
