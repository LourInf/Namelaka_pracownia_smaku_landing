import mongoose from "mongoose";

const { Schema } = mongoose;

const WishlistSchema = new Schema({
  userEmail: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }], //an array of object ids to have different products in the wishlist
});

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
