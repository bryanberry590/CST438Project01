import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import Index from '../app/index';

describe('Index screen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('navigates to /create_account when Create Account is pressed', async () => {
    const { getByText } = render(<Index />);
    await act(async () => {
      fireEvent.press(getByText('Create Account'));
    });
    expect(mockPush).toHaveBeenCalledWith('/create_account');
  });
});
