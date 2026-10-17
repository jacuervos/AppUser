/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {it} from '@jest/globals';
import renderer, {act} from 'react-test-renderer';
import pushNotificationService from '../src/services/pushNotificationService';
import {authApiService} from '../src/services/authApiService';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return {
    BottomSheetModalProvider: ({children}: {children: React.ReactNode}) => children,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    GestureHandlerRootView: ({children}: {children: React.ReactNode}) => children,
  };
});

jest.mock('react-native-toast-message', () => 'Toast');
jest.mock('../src/navigations/Navigation', () => 'Navigation');

jest.mock('../src/services/pushNotificationService', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
  },
}));

jest.mock('../src/services/authApiService', () => ({
  authApiService: {
    isAuthenticated: jest.fn(),
    updateFirebaseToken: jest.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly, skips token sync when unauthenticated, and unsubscribes on unmount', async () => {
    const unsubscribeMock = jest.fn();
    let capturedOnToken: ((token: string) => Promise<void>) | undefined;

    (pushNotificationService.initialize as unknown as jest.Mock).mockImplementation(
      async ({onToken}: {onToken: (token: string) => Promise<void>}) => {
        capturedOnToken = onToken;
        return unsubscribeMock;
      },
    );
    (authApiService.isAuthenticated as unknown as jest.Mock).mockResolvedValue(false);

    let tree: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<App />);
    });

    if (capturedOnToken) {
      await capturedOnToken('fcm-token-1');
    }
    expect(authApiService.updateFirebaseToken).not.toHaveBeenCalled();

    act(() => {
      tree!.unmount();
    });
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('syncs firebase token when authenticated and handles sync errors gracefully', async () => {
    let capturedOnToken: ((token: string) => Promise<void>) | undefined;
    (pushNotificationService.initialize as unknown as jest.Mock).mockImplementation(
      async ({onToken}: {onToken: (token: string) => Promise<void>}) => {
        capturedOnToken = onToken;
        return undefined;
      },
    );
    (authApiService.isAuthenticated as unknown as jest.Mock).mockResolvedValue(true);
    (authApiService.updateFirebaseToken as unknown as jest.Mock).mockResolvedValueOnce(undefined);

    let tree: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<App />);
    });

    if (capturedOnToken) {
      await capturedOnToken('fcm-token-2');
    }
    expect(authApiService.updateFirebaseToken).toHaveBeenCalledWith('fcm-token-2');

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (authApiService.updateFirebaseToken as unknown as jest.Mock).mockRejectedValueOnce(
      new Error('Sync error'),
    );
    if (capturedOnToken) {
      await capturedOnToken('fcm-token-3');
    }
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();

    act(() => {
      tree!.unmount();
    });
  });
});
