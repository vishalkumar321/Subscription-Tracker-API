import dayjs from "dayjs";
import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import { sendRemainderEmail } from "../utils/send-email.js";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendRemainders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  if (!subscriptionId) return;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    // 🔒 Only sleep AND send if reminder date is in the future
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilRemainder(
        context,
        `reminder ${daysBefore} days before`,
        reminderDate
      );

      await triggerRemainder(
        context,
        `Reminder ${daysBefore} days before`,
        subscription
      );
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilRemainder = async (context, label, date) => {
  console.log(`Sleeping until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerRemainder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label}`);

    if (!subscription?.user?.email) return;

    await sendRemainderEmail({
      to: subscription.user.email,
      type: "subscription", // ✅ fixed (no invalid reference)
    });
  });
};
