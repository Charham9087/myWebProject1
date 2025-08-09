"use server";

import ConnectDB from "@/components/mongoConnect";
import mongoose from "mongoose";
import products from "@/components/models/products";

export default async function SaveProduct(data) {
    await ConnectDB();
    console.log("RECEIVED DATA FROM FRONTEND", data);

    // Destructure shipping_price from data
    const { 
        name, 
        tags, 
        originalPrice, 
        discountedPrice, 
        title, 
        quantity, 
        description, 
        paymentMethod, 
        categories, 
        urls, 
        catalogues, 
        variantUrls,
        shipping_price // ✅ Added here
    } = data;

    // Save to database
    await products.create({
        name: name,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        title: title,
        quantity: quantity,
        description: description,
        paymentMethod: paymentMethod,
        categories: categories,
        images: urls,
        variantsImages: variantUrls,
        tags: tags,
        catalogues: catalogues,
        shipping_price: shipping_price || 0 // ✅ Save, default 0 if undefined
    });

    console.log("SAVED PRODUCT", data);
}
