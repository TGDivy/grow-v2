console.log(import.meta.env.VITE_APP_API);
if (!import.meta.env.VITE_APP_API) {
  throw new Error(
    "VITE_APP_API environment variable is not set. Please set it in .env file"
  );
}

declare global {
  interface Window {
    API_DOMAIN: string;
  }
}

export const API_DOMAIN = import.meta.env.VITE_APP_API;
