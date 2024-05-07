import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { buffer } from "micro";

const stripe = require("stripe")(process.env.STRIPE_SK);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_393c32279db0cd98f96973c6bc78ce3e503f921711dae49a6fe38e65586aa6dd";

export default async function handler(req, res) {
  await mongooseConnect();

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      //req.body should go through buffer for a secure payment process
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        if (session.payment_status === "paid") {
          await Order.findByIdAndUpdate(session.metadata.orderId, {
            paid: true,
          });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send("ok");
  } catch (err) {
    console.error(`Error handling event ${event.id}: ${err.message}`);
    res.status(500).send("Server Error");
  }
}

//we disable the default body parser from Next.js to allow the code access the raw body necessary for a valid signature check, which is crucial for secure payment processing
export const config = {
  api: { bodyParser: false },
};
