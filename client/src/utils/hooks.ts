import { useEffect, useState } from "react";

// replace state but everytime it's called, it will save to localStorage, and load from localStorage
export const useLocalStorageState = (key: string, defaultValue: unknown) => {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      return JSON.parse(savedValue);
    }
    return defaultValue;
  });

  const setValueAndSave = (newValue: unknown) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setValueAndSave];
};

// a custom hook to handle async data call, set loading and error state, and return the data
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);

  const execute = async () => {
    try {
      setLoading(true);
      setData(await asyncFunction());
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setLoading(false);
      setRefetch(false);
    }
  };

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, ...deps]);

  return { data, loading, error, refetch: () => setRefetch(true) };
};

// Use state with saving to localStorage
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      return JSON.parse(savedValue);
    }
    return defaultValue;
  });

  const setValueAndSave = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setValueAndSave];
};
