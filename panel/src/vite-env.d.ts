/// <reference types="vite/client" />

/** Variables de entorno del panel. Ver `.env.example`. */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** TODO(dev): URLs de los webhooks de n8n cuando Dev 2 las exponga. */
  readonly VITE_N8N_WEBHOOK_CANCELAR_TURNO?: string
  readonly VITE_N8N_WEBHOOK_REENVIAR_RECORDATORIO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
