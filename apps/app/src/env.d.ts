/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUADOS_URL: string
  readonly VITE_GAMEOS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
