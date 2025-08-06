"use server";

import ConnectDB from "@/components/mongoConnect";
import CustomerQuery from "@/components/models/customer_queries";
import dayjs from "dayjs";

export async function SaveCustomerQueryToDB(data) {
    const { name, email, phone, message } = data;
    console.log('data received from frontend', data);
    try {
        await ConnectDB();
        console.log('connected to DB successfully');
        await CustomerQuery.create({
            name,
            email,
            phone,
            message
        });
        console.log('data saved to DB successfully');
        return true;
    } catch {
        console.log('error saving data to DB');
        return false;
    }
}


export async function ShowCustomerQueryToDB() {
    await ConnectDB();
    console.log('connected to DB successfully');

    const data = await CustomerQuery.find({}).lean(); // Good start

    const sanitized = data.map((doc) => ({
        _id: doc._id?.toString() || "",
        name: doc.name || "",
        email: doc.email || "",
        phone: doc.phone || "",
        message: doc.message || "",
        isRead: Boolean(doc.isRead), // make sure it's true/false
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : "",
        formattedDate: doc.createdAt
            ? dayjs(doc.createdAt).format("DD/MM/YYYY, hh:mm A")
            : "N/A",
    }));

    return JSON.parse(JSON.stringify(sanitized)); // <-- Force plain object
}


export async function markAsRead(id) {
    await ConnectDB();
    const updated = await CustomerQuery.findByIdAndUpdate(id, { isRead: true });
    return updated ? true : false;
}