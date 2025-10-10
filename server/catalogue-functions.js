"use server";

import { cache } from "react";
import { revalidateTag } from "next/cache";
import ConnectDB from "@/components/mongoConnect";
import Products from "@/components/models/products";
import catalogue from "@/components/models/catalogue";

// ✅ Remove revalidate here – not allowed in use server file

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
}, { tags: ["catalogues"] });

export async function SaveCatalogue(data) {
  await ConnectDB();
  await catalogue.create({ name: data.name });
  revalidateTag("catalogues");
}

export const showCatalogue = cache(async function () {
  await ConnectDB();
  const catalogues = await catalogue.find();
  return catalogues.map(c => c.name);
}, { tags: ["catalogues"] });
