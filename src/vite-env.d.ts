/// <reference types="vite/client" />

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_BASE_URL?: string;
        readonly VITE_GEMINI_API_KEY?: string;
        readonly VITE_DEV_PORT?: string;
        readonly [key: string]: string | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export { };
