import { createFileRoute } from '@tanstack/react-router';
import VerifyPage from '@/pages/verify/VerifyPage';

export const Route = createFileRoute('/verify/')({
  component: VerifyPage,
});
