/// <reference types="vite/client" />

// Optional: narrow the env type so TS knows VITE_API_URL exists
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add other VITE_ vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
