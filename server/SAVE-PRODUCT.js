"use server";

import ConnectDB from "@/components/mongoConnect";
import mongoose from "mongoose";
import products from "@/components/models/products";

export default async function SaveProduct(data) {
    await ConnectDB();
    console.log("RECEIVED DATA FROM FROTNEDN", data);

    const { name, tags, originalPrice, discountedPrice, title, quantity, description, paymentMethod, categories, urls,catalogues,variantUrls  } = data;

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
        catalogues: catalogues
        
    });
    console.log("SAVED PRODUCT", data)


}