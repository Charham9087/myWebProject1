"use server"

import ConnectDB from "@/components/mongoConnect";
import Products from "@/components/models/products";
import catalogue from "@/components/models/catalogue";
export async function GetCatalogueWithProducts() {
    await ConnectDB();
    console.log("Connected to DB Successfully");

    // Get all catalogues
    const catalogues = await catalogue.find();

    // For each catalogue, find matching products
    const catalogueWithProducts = await Promise.all(
        catalogues.map(async (cat) => {
            const matchedProducts = await Products.find({ catalogues: cat.name });
            console.log("matchedProducts full object from DB\n", matchedProducts);

            // Convert each product's _id to string
            const productsWithStringId = matchedProducts.map(product => ({
                ...product.toObject(),
                _id: product._id.toString()
            }));

            return {
                name: cat.name,
                products: productsWithStringId
            };
        })
    );
    console.log("catalogueWithProducts\n", catalogueWithProducts);

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
