/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** رابط الباك اند الحقيقي — شوف .env.example */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
