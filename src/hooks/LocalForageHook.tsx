import localforage from 'localforage';
import React from 'react';

type HookMethods<T extends any> = [
  T | null,
  (value: T) => void,
  () => void,
  boolean,
];
export const useLocalForage = <T extends any>(
  key: string,
  initialValue?: T,
): HookMethods<T> => {
  const [storedValue, setStoredValue] = React.useState<T | null>(
    initialValue ?? null,
  );
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async function () {
      try {
        const value = await localforage.getItem(key);
        setStoredValue(value as T);
      } catch (err) {
        return initialValue;
      }
      setLoaded(true);
    })();
  }, [initialValue, setStoredValue, key]);

  /** Set value */
  const set = (value: T) => {
    (async function () {
      try {
        await localforage.setItem(key, value);
        setStoredValue(value);
      } catch (err) {
        return initialValue;
      }
    })();
  };

  /** Removes value from local storage */
  const remove = () => {
    (async function () {
      try {
        await localforage.removeItem(key);
        setStoredValue(null);
      } catch (e) {}
    })();
  };

  return [storedValue, set, remove, loaded];
};
