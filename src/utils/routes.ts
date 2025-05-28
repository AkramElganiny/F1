export const ROUTES = {
  HOME: "/",
  SEASONS: {
    LIST: "/seasons",
    DETAIL: (year?: string) => `/seasons/${year || ":year"}`,
    RACES: (year?: string) => `/seasons/${year || ":year"}/races`,
  },
  DRIVERS: "/driver",
} as const;
