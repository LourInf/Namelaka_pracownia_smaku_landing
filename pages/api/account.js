import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Account } from "@/models/Account";

// This API endpoint updates an existing user account or create a new one based on the incoming request and the session information of the currently logged-in user
export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "PUT") {
    // retrieves the data (emal, name, etc) from the session.
    const { user } = await getServerSession(req, res, authOptions);
    //now it looks for an account in the db which matches the email of logged-in user.
    const account = await Account.findOne({ userEmail: user.email });
    //if account exists --> update; if not --> create the account doc in the db
    if (account) {
      res.json(await Account.findByIdAndUpdate(account._id, req.body));
    } else {
      res.json(await Account.create({ userEmail: user.email, ...req.body }));
    }
  }
  if (req.method === "GET") {
    const { user } = await getServerSession(req, res, authOptions);
    const account = await Account.findOne({ userEmail: user.email });
    res.json(account);
  }
}
