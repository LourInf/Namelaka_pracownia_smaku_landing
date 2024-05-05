import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    surname: String,
    phone: String,
    terms: Boolean,
    paid: Boolean,
    userEmail: String, //needed to see the orders user places in his account
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
