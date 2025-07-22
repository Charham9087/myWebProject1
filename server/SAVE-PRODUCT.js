"use server";

import ConnectDB from "@/components/mognoConnect";
import mongoose from "mongoose";
import products from "@/components/models/products";

export default async function SaveProduct(data){
    await ConnectDB();   
    console.log("RECEIVED DATA FROM FROTNEDN",data);

    const{name,tags,originalPrice,discountedPrice,title,quantity,description,paymentMethod,categories,urls}=data;
     
    await products.create({
        name:name,
        originalPrice:originalPrice,
        discountedPrice:discountedPrice,
        title:title,
        quantity:quantity,
        description:description,        
        paymentMethod:paymentMethod,
        categories:categories,
        images:urls,
        tags:tags,
    });
console.log("SAVED PRODUCT")

    
}