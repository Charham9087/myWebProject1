// app/api/products/route.js
import ProductsSchema from "@/components/models/products";
import ConnectDB from "@/components/mongoConnect";

export async function GET() {
  try {
    await ConnectDB();
    const products = await ProductsSchema.find();
    return Response.json(products);
  } catch {
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
