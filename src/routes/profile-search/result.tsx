import { createFileRoute } from '@tanstack/react-router';
import ProfileSearchResultPage from '@/pages/profile-search/ProfileSearchResultPage';

export const Route = createFileRoute('/profile-search/result')({
  component: ProfileSearchResultPage,
});
