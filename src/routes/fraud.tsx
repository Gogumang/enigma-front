import { createFileRoute } from '@tanstack/react-router';
import FraudPage from '@/pages/fraud/FraudPage';

export const Route = createFileRoute('/fraud')({
  component: FraudPage,
});
