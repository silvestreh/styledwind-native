import { useSyncExternalStore } from 'react';
import type { RnColorScheme, TailwindFn } from 'twrnc';

interface SchemeStore {
  listeners: Set<() => void>;
  /** While above zero, `setColorScheme` does not notify (see `pauseColorSchemeNotifications`). */
  paused: number;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => RnColorScheme;
}

/**
 * The color scheme methods every twrnc instance has (its own hooks call them).
 * Its `TailwindFn` type doesn't declare them (checked in 4.5 and 4.16).
 */
interface SchemeApi {
  getColorScheme: () => RnColorScheme;
  setColorScheme: (scheme: RnColorScheme) => void;
}

const stores = new WeakMap<TailwindFn, SchemeStore>();

function storeOf(twrnc: TailwindFn): SchemeStore {
  let store = stores.get(twrnc);
  if (!store) {
    const listeners = new Set<() => void>();
    const api = twrnc as TailwindFn & SchemeApi;
    const created: SchemeStore = {
      listeners,
      paused: 0,
      subscribe: listener => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      getSnapshot: () => api.getColorScheme(),
    };

    // Every change of scheme goes through the instance's `setColorScheme`: the
    // Provider, `useColorScheme`, twrnc's own `useAppColorScheme`, and a direct
    // `tw.setColorScheme()` call. Wrapping it once is what lets all of them
    // reach the subscribers.
    const setColorScheme = api.setColorScheme;
    api.setColorScheme = scheme => {
      setColorScheme(scheme);
      if (created.paused === 0) listeners.forEach(listener => listener());
    };

    store = created;
    stores.set(twrnc, store);
  }
  return store;
}

/**
 * Holds back the notifications of `setColorScheme` until the returned function
 * is called. For a call made while a component renders (twrnc's
 * `useDeviceContext` sets the initial scheme that way): subscribers must not be
 * updated during another component's render. Follow it with
 * `notifyColorScheme` once the render is committed.
 */
export function pauseColorSchemeNotifications(twrnc: TailwindFn) {
  const store = storeOf(twrnc);
  store.paused += 1;
  return () => {
    store.paused -= 1;
  };
}

/**
 * Subscribes the calling component to one twrnc instance's color scheme and
 * returns it.
 *
 * twrnc's own `useAppColorScheme` keeps its state in the component that calls
 * it, so only that component re-renders when it changes the scheme. A styled
 * component whose parent does not re-render (a memoized subtree, a screen under
 * a navigator) kept the styles of the old scheme. Subscribers of this store all
 * re-render when the scheme they last read is no longer the instance's.
 */
export function useColorSchemeSnapshot(twrnc: TailwindFn) {
  const { subscribe, getSnapshot } = storeOf(twrnc);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Makes every subscriber of this instance re-read its color scheme. */
export function notifyColorScheme(twrnc: TailwindFn) {
  storeOf(twrnc).listeners.forEach(listener => listener());
}
