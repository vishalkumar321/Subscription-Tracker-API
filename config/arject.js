import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";

/**
 * 🔥 CONTROL THIS FLAG FOR TESTING
 * true  → Arcjet blocks locally
 * false → Normal dev behavior (DRY_RUN)
 */
const FORCE_LIVE = false;

const MODE =
  FORCE_LIVE || process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

// Optional warning if key is missing
if (!process.env.ARCJET_KEY) {
  console.warn("⚠️ ARCJET_KEY is missing");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // 🛡️ Basic protection (XSS, SQLi, etc.)
    shield({ mode: MODE }),

    // 🤖 Bot detection (FIXED)
    detectBot({
      mode: MODE,
      allow: [
        // ✅ Only valid Arcjet categories
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:AI",
        "CATEGORY:MONITORING",
      ],
    }),

    // 🚦 Rate limiting
    tokenBucket({
      mode: MODE,
      refillRate: MODE === "LIVE" ? 1 : 50,
      interval: 60,
      capacity: MODE === "LIVE" ? 3 : 100,
    }),
  ],
});

export default aj;
