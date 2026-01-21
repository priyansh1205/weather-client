import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherSearch } from './WeatherSearch';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  return Wrapper;
};

describe('WeatherSearch', () => {
  const mockOnCitySelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(
      <WeatherSearch onCitySelect={mockOnCitySelect} isLoading={false} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('calls onCitySelect when form is submitted', () => {
    render(
      <WeatherSearch onCitySelect={mockOnCitySelect} isLoading={false} />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByTestId('search-input');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.submit(form!);

    expect(mockOnCitySelect).toHaveBeenCalledWith('London');
  });

  it('disables button when loading', () => {
    render(
      <WeatherSearch onCitySelect={mockOnCitySelect} isLoading={true} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByTestId('search-button');
    expect(button).toBeDisabled();
  });

  it('does not call onCitySelect with empty input', () => {
    render(
      <WeatherSearch onCitySelect={mockOnCitySelect} isLoading={false} />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByTestId('search-input');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form!);

    expect(mockOnCitySelect).not.toHaveBeenCalled();
  });
});
