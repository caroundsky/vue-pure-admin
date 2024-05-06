const { VITE_ENV } = import.meta.env

export const baseUrlApi = (url: string) =>
  `${VITE_ENV === "dev" ? "/api" : "/api"}${url}`
