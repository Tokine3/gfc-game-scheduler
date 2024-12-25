import useSWR from 'swr';
import { client } from '../lib/api';

export function useCurrentUser() {
  const { data: currentUser } = useSWR('/users/me', () =>
    client.user.me.$get()
  );

  return { currentUser };
}
