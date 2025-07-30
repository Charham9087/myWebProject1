"use server"

import ConnectDB from "@/components/mognoConnect";
import products from "@/components/models/products";
import catalogue from "@/components/models/catalogue";

export async function GetCatalogueWithProducts() {
    await ConnectDB();
    console.log("Connected to DB Successfully");

    // Get all catalogues
    const catalogues = await catalogue.find();
    console.log("catalogues", catalogues);

    // For each catalogue, find matching products
    const catalogueWithProducts = await Promise.all(
        catalogues.map(async (cat) => {
            const matchedProducts = await products.find({ catalogues: cat.name });
            return {
                name: cat.name,
                products: matchedProducts
            };
        })
    );

    return catalogueWithProducts;
}







export async function SaveCatalogue(data) {
    console.log("RECEIVED DATA FROM FRONTEND", data);
    await ConnectDB();
    console.log('connected to DB successfully')

    const name = data.name;

    await catalogue.create({ name: name })
}





export async function showCatalogue() {
    await ConnectDB();
    console.log('connected to DB successfully')

    const catalogues = await catalogue.find();

    const names = catalogues.map(c => c.name);

    return names;
}
