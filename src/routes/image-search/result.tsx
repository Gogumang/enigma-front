import { createFileRoute } from '@tanstack/react-router';
import ImageResultPage from '@/pages/image-search/ImageResultPage';

export const Route = createFileRoute('/image-search/result')({
  component: ImageResultPage,
});
