import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'mk-theme';
const listeners = new Set<() => void>();

const read = (): Theme => {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

let current: Theme = read();

const apply = (t: Theme) => {
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.style.colorScheme = t;
};

/** Call once before React renders so there is no flash of the wrong theme. */
export const initTheme = () => apply(current);

export const setTheme = (t: Theme) => {
  current = t;
  apply(t);
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage blocked: theme still works for this visit */
  }
  listeners.forEach((l) => l());
};

export const toggleTheme = () => setTheme(current === 'dark' ? 'light' : 'dark');

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useTheme = (): Theme => useSyncExternalStore(subscribe, () => current, () => 'light' as Theme);
