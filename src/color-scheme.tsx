import React, { useEffect, createContext, useContext } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useAppColorScheme, useDeviceContext, type TailwindFn } from 'twrnc';
import type {
  ColorScheme,
  ColorSchemeContextValue,
  ColorSchemePreference,
  ProviderProps,
} from './types';
import {
  notifyColorScheme,
  pauseColorSchemeNotifications,
  useColorSchemeSnapshot,
} from './scheme-store';

const STORAGE_KEY = 'tw:color-scheme';

function isColorSchemePreference(
  value: unknown
): value is ColorSchemePreference {
  return value === 'light' || value === 'dark' || value === 'device';
}

/** Build a `Provider` and `useColorScheme` pair bound to one twrnc instance. */
export function createColorScheme(twrnc: TailwindFn) {
  const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(
    null
  );

  function Provider({
    children,
    initialColorScheme = 'device',
    storage,
  }: ProviderProps) {
    const [userColorScheme, setUserColorScheme] =
      React.useState<ColorSchemePreference>(initialColorScheme);
    const [twrnColorScheme, , twrnSetColorScheme] = useAppColorScheme(twrnc);

    const deviceColorScheme = useDeviceColorScheme();

    // `useDeviceContext` sets the scheme while this component renders. The
    // effect below notifies the styled components once that is committed.
    const resume = pauseColorSchemeNotifications(twrnc);
    useDeviceContext(
      twrnc,
      userColorScheme === 'device'
        ? undefined
        : {
            observeDeviceColorSchemeChanges: false,
            initialColorScheme: userColorScheme,
          }
    );
    resume();

    useEffect(() => {
      if (userColorScheme === 'device' && deviceColorScheme) {
        if (twrnColorScheme !== deviceColorScheme) {
          twrnSetColorScheme(deviceColorScheme);
        }
      }
    }, [
      deviceColorScheme,
      userColorScheme,
      twrnColorScheme,
      twrnSetColorScheme,
    ]);

    useEffect(() => {
      if (storage) {
        storage.getItem(STORAGE_KEY).then(value => {
          if (isColorSchemePreference(value)) {
            setUserColorScheme(value);
            if (value !== 'device') {
              twrnSetColorScheme(value);
            }
          }
        });
      }
    }, []);

    useEffect(() => {
      if (storage) {
        if (userColorScheme === 'device') {
          storage.removeItem(STORAGE_KEY);
        } else {
          storage.setItem(STORAGE_KEY, userColorScheme);
        }
      }
    }, [userColorScheme, storage]);

    // In `device` mode twrnc takes the device's scheme while this Provider
    // renders, without going through `setColorScheme`. Styled components that
    // did not re-render with it are told to re-read the scheme.
    useEffect(() => {
      notifyColorScheme(twrnc);
    });

    const toggleColorScheme = () => {
      const current =
        userColorScheme === 'device' ? twrnColorScheme : userColorScheme;
      const newScheme: ColorScheme = current === 'dark' ? 'light' : 'dark';
      setUserColorScheme(newScheme);
      twrnSetColorScheme(newScheme);
    };

    const setColorScheme = (scheme: ColorSchemePreference) => {
      setUserColorScheme(scheme);
      if (scheme !== 'device') {
        twrnSetColorScheme(scheme);
      }
    };

    return (
      <ColorSchemeContext.Provider
        value={{
          colorScheme: twrnColorScheme ?? 'light',
          internalColorScheme: userColorScheme,
          toggleColorScheme,
          setColorScheme,
        }}
      >
        {children}
      </ColorSchemeContext.Provider>
    );
  }

  function useColorScheme(): ColorSchemeContextValue {
    const ctx = useContext(ColorSchemeContext);
    const [, twrnToggleColorScheme, twrnSetColorScheme] =
      useAppColorScheme(twrnc);
    // Without a Provider the scheme is shared through the store, so a change
    // made by one component reaches the others.
    const twrnColorScheme = useColorSchemeSnapshot(twrnc);

    if (ctx) return ctx;

    return {
      colorScheme: twrnColorScheme ?? 'light',
      internalColorScheme: 'device',
      toggleColorScheme: twrnToggleColorScheme,
      setColorScheme: scheme => {
        if (scheme !== 'device') twrnSetColorScheme(scheme);
      },
    };
  }

  return { Provider, useColorScheme };
}
