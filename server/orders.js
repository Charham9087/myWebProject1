"use server"; // 👈 MUST be at the top of the file

import ConnectDB from "@/components/mongoConnect";
import Orders from "@/components/models/orders";
import Products from "@/components/models/products";
import mongoose from "mongoose"; // combine all imports

// ==========================
// Get All Orders (List Page)
// ==========================
export async function ShowOrderPageData() {
    try {
        await ConnectDB();
        console.log('connected to DB successfully');

        const ordersFromDB = await Orders.find({}).lean();
        const serializableOrders = JSON.parse(JSON.stringify(ordersFromDB));

        return serializableOrders.map((order) => {
            const { _id, ...rest } = order;
            return { ...rest, orderID: _id };
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

// ==========================
// Delete Order
// ==========================
export async function deleteOrder(id) {
    await ConnectDB();
    const deleted = await Orders.findByIdAndDelete(id);
    return deleted ? true : false;
}

// ==========================
// Get One Order Detail
// ==========================

export async function ViewOrderDetailFromDB(id) {
  try {
    await ConnectDB();
    console.log("Connected to DB Successfully");
    console.log("Incoming Order ID:", id);

    
    const orderData = await Orders.findOne({ _id: id }).lean();

    if (!orderData) {
      return { error: "Order not found" };
    }


    // ✅ Convert string IDs to ObjectId instances
  

    console.log("ORDER PROD IDS:",orderData.productID)
    // ✅ Find all products using $in query
    const orderedProductIds = orderData?.productID;
    const productData = await Products.find({ _id: { $in: orderedProductIds } }).lean();
    // console.log("Product data:",productData[0].title);

    return {
      orderData: JSON.parse(JSON.stringify(orderData)),
      productData: JSON.parse(JSON.stringify(productData)),
    };
  } catch (error) {
    console.error("Error in ViewOrderDetailFromDB:", error);
    return { error: "Failed to fetch order detail" };
  }
}
