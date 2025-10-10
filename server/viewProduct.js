'use server'
import ConnectDB from "@/components/mongoConnect";
import products from "@/components/models/products";
import { unstable_cache } from "next/cache";
import { Tags } from "lucide-react";
import { revalidateTag } from "next/cache";

const cachedViewProduct = unstable_cache(
  async (_id) => {
    try {
      await ConnectDB();
      const foundProduct = await products.findOne({ _id }).lean();
      return foundProduct ? { ...foundProduct, _id: foundProduct._id.toString() } : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
  [], // optional key prefix
  { revalidate: 3600 , tags: ["products"] }// ✅ ISR here!
);

export default async function ViewProduct({ _id }) {
  return cachedViewProduct(_id); // ✅ returns cached data with ISR
}
