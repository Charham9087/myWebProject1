"use server";

import products from "@/components/models/products";
import ConnectDB from "@/components/mongoConnect";

export default async function fetchProducts() {
  try {
    await ConnectDB();
    const allProducts = await products.find({}).lean();

    // Convert to plain JSON
    const safeProducts = allProducts.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toString(),
      updatedAt: product.updatedAt?.toString(),
    }));

    return safeProducts;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
}
