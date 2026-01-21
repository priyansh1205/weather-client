import { useQuery } from '@tanstack/react-query';
import { CitySuggestion } from '@/types';
import { fetchCitySuggestions } from '@/lib/api/endpoints';
import { QUERY_KEYS, STALE_TIME, MIN_SEARCH_LENGTH } from '@/lib/constants';

export function useCitySuggestions(query: string) {
  return useQuery<CitySuggestion[]>({
    queryKey: [QUERY_KEYS.CITY_SUGGESTIONS, query],
    queryFn: () => fetchCitySuggestions(query),
    enabled: query.length >= MIN_SEARCH_LENGTH,
    staleTime: STALE_TIME.SUGGESTIONS,
  });
}
