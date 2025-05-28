export const ROUTES = {
  HOME: "/",
  SEASONS: {
    LIST: "/seasons",
    DETAIL: (year?: string) => `/seasons/${year || ":year"}`,
  },
  DRIVERS: "/driver",
} as const;
