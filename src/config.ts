export const config = {
  PARTYKIT_URL:
    import.meta.env.VITE_ENVIRONMENT === "production"
      ? "https://page-party.johnathan-sewell.partykit.dev"
      : "http://localhost:1999",
};
