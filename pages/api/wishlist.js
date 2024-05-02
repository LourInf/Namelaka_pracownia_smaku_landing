import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Wishlist } from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await mongooseConnect();

  // retrieves the user data (emal, name, etc) from the session.
  const { user } = await getServerSession(req, res, authOptions);

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.method === "POST") {
    const { product, liked } = req.body;

    try {
      const update = liked
        ? { $addToSet: { products: product } }
        : { $pull: { products: product } };

      const result = await Wishlist.findOneAndUpdate(
        { userEmail: user.email },
        update,
        { new: true, upsert: true }
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Wishlist modification error:", error);
      return res.status(500).json({ error: "Failed to modify wishlist" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
