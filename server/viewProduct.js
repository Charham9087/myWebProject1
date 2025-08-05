'use server'
import ConnectDB from "@/components/mongoConnect";
import products from "@/components/models/products";

export default async function ViewProduct({ _id }) {
  try {
    console.log("Connecting to DB...");
    await ConnectDB();
    console.log("Connected!");

    const foundProduct = await products.findOne({ _id });
    if (foundProduct) {
      console.log("Product found:", foundProduct);
      const obj = foundProduct.toObject();
      obj._id = obj._id.toString();   // important
      return obj;
    } else {
      console.error("Product not found");
      return null;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}
