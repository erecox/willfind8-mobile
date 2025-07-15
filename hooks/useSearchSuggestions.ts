// hooks/useSearchSuggestions.ts
import { Suggestion } from '@/types';
import api from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['suggestions', query],
    queryFn: () => fetchSuggestions(query),
    enabled: !!query,
  });
}

async function fetchSuggestions(query: string): Promise<Suggestion[]> {
  const response = await api.get<Suggestion[]>(`/search`, {
    params: { q: query },
  });
  return response.data; // Make sure your backend returns an array of strings
}
