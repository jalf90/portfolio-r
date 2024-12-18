import React from 'react';
import { render, screen } from '@testing-library/react';
import Autocomplete from './Autocomplete';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the `messages` object for testing purposes
const mockMessages = {};

const selectItem = jest.fn;

// Create a new QueryClient instance for the test
const queryClient = new QueryClient();

it('renders the input field', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <Autocomplete url={''} displayKeys={[]} selectedItem={selectItem} />
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
  const inputElement = screen.getByPlaceholderText('e.g. city');
  expect(inputElement).toBeInTheDocument();
});
