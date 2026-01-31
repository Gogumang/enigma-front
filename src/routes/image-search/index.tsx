import { createFileRoute } from '@tanstack/react-router';
import ImageSearchPage from '@/pages/image-search/ImageSearchPage';

export const Route = createFileRoute('/image-search/')({
  component: ImageSearchPage,
});
