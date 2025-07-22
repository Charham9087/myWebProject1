"use server"

import ConnectDB from "@/components/mognoConnect";
import mongoose from "mongoose";
import products from "@/components/models/products";



export async function deleteProduct(_id){
    console.log("RECEIVED DATA FROM FROTNEND",_id);
    console.log("Connecting to DB");
    await ConnectDB();
    console.log("Connected to DB✅");
    console.log("DELETING PRODUCT⚒️");
    await products.findByIdAndDelete(_id);
    console.log("PRODUCT DELETED ✅")


}


export async function updateProduct(data) {
  console.log("RECEIVED DATA FROM FRONTEND", data);

  await ConnectDB();

  await products.findByIdAndUpdate(data._id, {
    name: data.name,
    originalPrice: data.originalPrice,
    discountedPrice: data.discountedPrice,
    title: data.title,
    quantity: data.quantity,
    description: data.description,
    paymentMethod: data.paymentMethod,
    categories: data.categories,
    images: data.urls,
    tags: data.tags,
  });

  console.log("PRODUCT UPDATED ✅");
}




export async function singleproductpage(_id){
    console.log("RECEIVED DATA FROM FROTNEND",_id);
  
  await ConnectDB();
  console.log("Connected to DB✅");
  

  const data = products.findById(_id);
  console.log("DATA",data);
  
  return Response.json({data},{status:200});
}
