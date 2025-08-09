"use server";

import ConnectDB from "@/components/mongoConnect";
import mongoose from "mongoose";
import products from "@/components/models/products";

export default async function SaveProduct(data) {
    await ConnectDB();
    console.log("RECEIVED DATA FROM FRONTEND", data);

    const {
        name,
        tags,
        originalPrice,
        discountedPrice,
        shipping_price, // ✅ added
        title,
        quantity,
        description,
        paymentMethod,
        categories,
        urls,
        catalogues,
        variantUrls
    } = data;

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
        tags,
        catalogues
    });

    console.log("SAVED PRODUCT", data);
}
