import { createFileRoute } from '@tanstack/react-router';
import UrlPage from '@/pages/url/UrlPage';

export const Route = createFileRoute('/url')({
  component: UrlPage,
});
