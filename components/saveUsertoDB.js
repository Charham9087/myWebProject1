"use server"
import ConnectDB from "@/components/mongoConnect";
import User from "@/components/models/User";

export async function SaveUSertoDB(user) {
  await ConnectDB();
  // Check agar user pehle se exist karta hai
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return existingUser; // user already hai to wahi return karo
  }

  // Naya user save karo
  const newUser = new User({
    name: user.name,
    email: user.email,
    image: user.image,
  });
  await newUser.save();
  return newUser;
}
