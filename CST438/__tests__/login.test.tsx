import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock expo-auth-session hook so it doesn't run real native code
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [null, null, jest.fn()],
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

import Login from '../app/login';

describe('Login screen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('navigates to /create_account when Create Account is pressed', () => {
    const { getByText } = render(<Login />);
    fireEvent.press(getByText('Create Account'));
    expect(mockPush).toHaveBeenCalledWith('/create_account');
  });

  it('replaces with / when Continue as Guest is pressed', () => {
    const { getByText } = render(<Login />);
    fireEvent.press(getByText('Continue as Guest'));
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
