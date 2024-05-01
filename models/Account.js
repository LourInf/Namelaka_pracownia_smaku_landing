import mongoose from "mongoose";

const { Schema } = mongoose;

const AccountSchema = new Schema({
  // user: mongoose.Types.ObjectId. ---> better to use userEmail because email works as unique identifier for each user, simplifying finding and manipulating user records in the db.
  //It eliminates the need for an additional lookup to match an ObjectId to a user's email.
  userEmail: { type: String, unique: true, required: true },
  name: String,
  surname: String,
  email: String,
  phone: String,
});

export const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);
