"use server";

import ConnectDB from "@/components/mongoConnect";
import mongoose from "mongoose";
import products from "@/components/models/products";
import { revalidateTag } from "next/cache";

export default async function SaveProduct(data) {
    await ConnectDB();
    console.log("RECEIVED DATA FROM FRONTEND", data);
    console.log("RECEIVED DATA FROM FRONTEND", data);

    const { shipping_price,name, tags, originalPrice, discountedPrice, title, quantity, description, paymentMethod, categories, urls,catalogues,variantUrls  } = data;

    // Save to database
    await products.create({
        name,
        originalPrice,
        discountedPrice,
        shipping_price, // ✅ added
        title,
        quantity,
        description,
        paymentMethod,
        categories,
        images: urls,
        variantsImages: variantUrls,
        tags: tags,
        catalogues: catalogues,
        shipping_price: shipping_price || 0 // ✅ Save, default 0 if undefined
    });
        revalidateTag("products"); // ✅ Instantly refresh ISR cache

    console.log("SAVED PRODUCT", data);
}
