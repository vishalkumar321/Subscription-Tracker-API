import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";

// Use DRY_RUN in development, LIVE in production
const MODE = process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

// Optional warning if key is missing
if (!process.env.ARCJET_KEY) {
  console.warn("⚠️ ARCJET_KEY is missing");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Basic protection (XSS, SQLi, etc.)
    shield({ mode: MODE }),

    // Bot detection
    detectBot({
      mode: MODE, // DRY_RUN in dev, LIVE in prod
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        "CATEGORY:API_CLIENT", // Allows Postman / API tools in dev
      ],
    }),

    // Rate limiting (relaxed for dev)
    tokenBucket({
      mode: MODE,
      refillRate: MODE === "LIVE" ? 5 : 50,
      interval: 10,
      capacity: MODE === "LIVE" ? 10 : 100,
    }),
  ],
});

export default aj;
