import { NODE_ENV, SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

/**
 * CREATE SUBSCRIPTION
 */
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    // ✅ Only trigger workflow in production (QStash needs public URL)
    if (NODE_ENV === "production") {
      await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription`,
      });
    }

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET USER SUBSCRIPTIONS
 */
export const getUserSubscription = async (req, res, next) => {
  try {
    // 🔐 Ownership check
    if (req.user._id.toString() !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 403;
      throw error;
    }

    const subscriptions = await Subscription.find({
      user: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
