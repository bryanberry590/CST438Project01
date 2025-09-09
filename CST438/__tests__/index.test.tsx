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

  it('navigates to /create_account when Create Account is pressed', () => {
    const { getByText } = render(<Index />);
    fireEvent.press(getByText('Create Account'));
    expect(mockPush).toHaveBeenCalledWith('/create_account');
  });
});
