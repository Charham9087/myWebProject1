"use server";

import ConnectDB from "@/components/mongoConnect";
import Orders from "@/components/models/orders";

export async function ShowOrderPageData() {
    try {
        await ConnectDB();
        console.log('connected to DB successfully');

        const ordersFromDB = await Orders.find({}).lean();

        // The .lean() method is a good optimization, but to be absolutely sure
        // that the data is serializable, we can perform a JSON cycle.
        // This converts complex types like ObjectId and Date into their string
        // representations, which are safe to pass to the client.
        const serializableOrders = JSON.parse(JSON.stringify(ordersFromDB));

        // The client component expects `orderID`, but the database provides `_id`.
        // After stringifying, `_id` is a string. Let's map it.
        return serializableOrders.map((order) => {
            const { _id, ...rest } = order;
            return { ...rest, orderID: _id };
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}