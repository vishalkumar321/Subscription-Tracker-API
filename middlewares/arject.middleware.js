import aj from "../config/arject.js";

const arjectMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.project(req);

    if (decision.isDenied()) {
      if (dicision.reason.isRateLimit())
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (dicision.reason.isBot())
        return res.status(403).json({ error: "Bot detected" });

      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    console.log(`Arject Middleware Error: ${error}`);
    next(error);
  }
};

export default arjectMiddleware;
