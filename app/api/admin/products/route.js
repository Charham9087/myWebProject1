// app/api/products/route.js
import ProductsSchema from "@/components/models/products";
import ConnectDB from "@/components/mongoConnect";
import { revalidateTag } from "next/cache"; // ✅ For manual cache refresh

export const revalidate = 3600; // ✅ Revalidate every 3600 seconds

export async function GET() {
  try {
    await ConnectDB();
    const products = await ProductsSchema.find();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300", // ✅ API-level ISR
        "x-next-cache-tags": "products", // ✅ Assign ISR tag
      }
    });
  } catch {
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
