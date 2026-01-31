import { createFileRoute } from '@tanstack/react-router';
import ProfileSearchPage from '@/pages/profile-search/ProfileSearchPage';

export const Route = createFileRoute('/profile-search')({
  component: ProfileSearchPage,
});
