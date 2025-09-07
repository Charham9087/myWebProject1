"use server"
import ConnectDB from "@/components/mongoConnect";
import Products from "@/components/models/products";

export default async function mostselling() {
  await ConnectDB();
  const products = await Products.find({ catalogues: "Most Selling 🔥" }); // filter by tag or category
  return products;
}
