"use server";
import ConnectDB from "@/components/mognoConnect";
import products from "@/components/models/products";

export async function getSingleProduct(_id) {
    await ConnectDB();
    console.log("RECEIVED ID FROM FRONTEND:", _id);
    const data = await products.findById(_id);
    console.log("DATA:", data);
    return data;
}
