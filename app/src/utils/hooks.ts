import { useState } from "react";

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
