import { createFileRoute } from '@tanstack/react-router';
import AnalyzePage from '@/pages/analyze/AnalyzePage';

export const Route = createFileRoute('/analyze/$id')({
  component: AnalyzePage,
});
