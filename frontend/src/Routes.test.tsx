import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Welcome } from 'pages';

describe('Router', () => {
  test('renders the correct content when the route is /success', () => {
    const mainPath = '/';

    render(
      <MemoryRouter initialEntries={[mainPath]}>
        <Welcome />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Welcome/i)).toBeInTheDocument();
  });
});
