import { createFileRoute } from '@tanstack/react-router';
import ComprehensiveAnalyzePage from '@/pages/analyze/ComprehensiveAnalyzePage';

export const Route = createFileRoute('/analyze/')({
  component: ComprehensiveAnalyzePage,
});
