import { createFileRoute } from '@tanstack/react-router';
import VerifyResultPage from '@/pages/verify/VerifyResultPage';

export const Route = createFileRoute('/verify/result')({
  component: VerifyResultPage,
});
