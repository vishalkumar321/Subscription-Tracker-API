import aj from "../config/arject.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect({
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      ip: req.ip || req.connection.remoteAddress,
    });

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason?.isRateLimit?.()) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded",
        });
      }

      if (reason?.isBot?.()) {
        return res.status(403).json({
          success: false,
          error: "Bot detected",
        });
      }

      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Arcjet Middleware Error:", error);
    next(error);
  }
};

export default arcjetMiddleware;
