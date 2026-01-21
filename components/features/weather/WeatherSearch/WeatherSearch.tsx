import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { useCitySuggestions } from '@/hooks/useCitySuggestions';
import { DEBOUNCE_DELAY, MIN_SEARCH_LENGTH } from '@/lib/constants';

interface WeatherSearchProps {
  onCitySelect: (city: string) => void;
  isLoading: boolean;
}

export function WeatherSearch({ onCitySelect, isLoading }: WeatherSearchProps) {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(input, DEBOUNCE_DELAY);
  const { data: suggestions, isLoading: isLoadingSuggestions } =
    useCitySuggestions(debouncedSearch);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cityName: string) => {
    setInput(cityName);
    setIsOpen(false);
    onCitySelect(cityName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCitySelect(input);
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search city (e.g. Bangalore)..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          className="bg-white"
          data-testid="search-input"
        />
        <Button type="submit" disabled={isLoading} data-testid="search-button">
          {isLoading ? '...' : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {isOpen && debouncedSearch.length >= MIN_SEARCH_LENGTH && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-white shadow-lg z-50 overflow-hidden">
          {isLoadingSuggestions ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              Loading suggestions...
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto" data-testid="suggestions-list">
              {suggestions.map((city, index) => (
                <li key={`${city.name}-${city.lat}-${index}`}>
                  <button
                    onClick={() => handleSelect(city.name)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    type="button"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      <span className="font-medium">{city.name}</span>
                      <span className="text-gray-500 ml-1">
                        {city.state ? `, ${city.state}` : ''} ({city.country})
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No locations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
