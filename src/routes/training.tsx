import { createFileRoute } from '@tanstack/react-router';
import TrainingPage from '@/pages/training/TrainingPage';

export const Route = createFileRoute('/training')({
  component: TrainingPage,
});
