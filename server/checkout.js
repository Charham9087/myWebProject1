"use server"
import ConnectDB from "@/components/mongoConnect";
import orders from "@/components/models/orders";
import Products from "@/components/models/products";



export async function saveCheckout(data) {
    console.log("RECEIVED DATA FROM FRONTEND", data);
    await ConnectDB();
    console.log('connected to DB successfully')

    const {  name, email, phone, address, city, postal, comments, productID, orderID,total  } = data;

    const _id = productID.split(",")
    

    await orders.create({
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        postal: postal,
        comments: comments,
        productID: _id,
        orderID: orderID,
        total: total,
    })
    console.log("data saved to DB successfully")

}

export async function getCheckout(_id) {
    console.log("RECEIVED DATA FROM FRONTEND", _id)
    await ConnectDB();
    console.log("connected to DB Successfully")

    // Split in case _id comes as "id1,id2,id3"
    const ids = _id.split(',');

    // Find products and convert to plain objects
    const data = await Products.find({ _id: { $in: ids } }).lean();

    if (data) {
        console.log('products found', data);

        // ✅ Convert _id from ObjectId to string
        const plainData = data.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        return plainData;
    } else {
        console.log("data not found in DB");
        return [];
    }
}




