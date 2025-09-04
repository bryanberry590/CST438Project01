import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import Index from '../app/index';

describe('Index screen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('navigates to /login when Login button is pressed', () => {
    const { getByText } = render(<Index />);
    fireEvent.press(getByText('Login'));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
