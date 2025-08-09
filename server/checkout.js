"use server";

import ConnectDB from "@/components/mongoConnect";
import Orders from "@/components/models/orders";
import Products from "@/components/models/products";

/**
 * Save checkout order data to the database
 */
export async function saveCheckout(data) {
    try {
        console.log("📦 RECEIVED DATA FROM FRONTEND:", data);

        await ConnectDB();
        console.log("✅ Connected to DB successfully");

        const { name, email, phone, address, city, postal, comments, productID, orderID, total } = data;

        // Ensure product IDs are in array form
        const productIdsArray = typeof productID === "string" ? productID.split(",") : productID;

        await Orders.create({
            name,
            email,
            phone,
            address,
            city,
            postal,
            comments,
            productID: productIdsArray,
            orderID,
            total,
        });

        console.log("✅ Order saved to DB successfully");
        return { success: true, message: "Order saved successfully" };

    } catch (error) {
        console.error("❌ Error saving order:", error);
        return { success: false, message: "Failed to save order", error: error.message };
    }
}

/**
 * Get checkout product details by IDs
 */
export async function getCheckout(_id) {
    try {
        console.log("🛒 RECEIVED PRODUCT IDS:", _id);

        await ConnectDB();
        console.log("✅ Connected to DB successfully");

        // Ensure _id is always an array
        const ids = typeof _id === "string" ? _id.split(",") : _id;

        // Fetch products and convert ObjectId to string
        const products = await Products.find({ _id: { $in: ids } }).lean();

        if (!products.length) {
            console.log("⚠️ No products found in DB");
            return [];
        }

        console.log("✅ Products found:", products.length);

        const plainProducts = products.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        return plainProducts;

    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}
