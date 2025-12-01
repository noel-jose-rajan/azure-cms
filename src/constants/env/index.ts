// @ts-ignore
const runtimeEnv = (window)?.__env || {};

const ENV = {
  GCP_API_KEY: import.meta.env.VITE_GCP_API_KEY,
  OPEN_AI_KEY: import.meta.env.VITE_OPEN_AI_KEY,
  OT_API: import.meta.env.VITE_OT_API,
  API_URL:runtimeEnv.VITE_API_URL || import.meta.env.VITE_API_URL,
  API_URL_LEGACY: import.meta.env.VITE_API_URL_LEGACY,
  NODE_API_URL: import.meta.env.VITE_NODE_API_URL,
  API_URL_LEGACY_2: import.meta.env.VITE_API_URL_LEGACY_2,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  AI_BASE_URL: runtimeEnv.VITE_AI_BASE_URL || import.meta.env.VITE_AI_BASE_URL,
  ABBYY_BASE_URL: import.meta.env.VITE_ABBYY_BASE_URL,
} as const;

export default ENV;
