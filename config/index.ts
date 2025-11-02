export const CONFIG = {
  TOKENS: {
    ACCESS_TOKEN: { NAME: "access-token", DURATION: 60 * 60 * 24 * 7 },
    REFRESH_TOKEN: { NAME: "refresh-token", DURATION: 60 * 60 * 24 * 365 },
  },
  BACK_URL: "",
} as const;
