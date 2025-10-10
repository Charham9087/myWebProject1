"use server";

import { cache } from "react";
import { revalidateTag } from "next/cache"; // ✅ Enable manual cache refresh
import ConnectDB from "@/components/mongoConnect";
import Products from "@/components/models/products";
import catalogue from "@/components/models/catalogue";

export const revalidate = 3600; // ✅ Revalidate every 1 hour

// ✅ Cached with ISR + Tagged for invalidation
export const GetCatalogueWithProducts = cache(async function () {
    await ConnectDB();
    console.log("Connected to DB Successfully");

    const catalogues = await catalogue.find();

    const catalogueWithProducts = await Promise.all(
        catalogues.map(async (cat) => {
            const matchedProducts = await Products.find({ catalogues: cat.name });

            const productsWithStringId = matchedProducts.map(product => ({
                ...product.toObject(),
                _id: product._id.toString(),
            }));

            return {
                name: cat.name,
                products: productsWithStringId,
            };
        })
    );

    console.log("catalogueWithProducts\n", catalogueWithProducts);
    return catalogueWithProducts;
}, { tags: ["catalogues"] }); // ✅ Assign ISR Tag

// ❌ Write operation – not cached
export async function SaveCatalogue(data) {
    console.log("RECEIVED DATA FROM FRONTEND", data);
    await ConnectDB();

    await catalogue.create({ name: data.name });

    revalidateTag("catalogues"); // ✅ Instantly refresh ISR cache
}

// ✅ Cached with ISR + Tag as well (optional)
export const showCatalogue = cache(async function () {
    await ConnectDB();

    const catalogues = await catalogue.find();
    return catalogues.map(c => c.name);
}, { tags: ["catalogues"] });
