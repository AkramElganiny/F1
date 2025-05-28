export const ROUTES = {
  HOME: "/",
  SEASONS: {
    LIST: "/seasons",
    DETAIL: (year?: string) => `/seasons/${year || ":year"}`,
    RACES: (year?: string) => `/seasons/${year || ":year"}/races`,
    RACE_DETAILS: (year?: string, round?: string) =>
      `/seasons/${year || ":year"}/races/${round || ":round"}`,
  },
} as const;
