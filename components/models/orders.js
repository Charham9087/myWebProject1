import mongoose from "mongoose"

const OrdersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String, required: true },
    comments: { type: String },
    total: { type: Number },
    productID: [{ type: String }], // ✅ Correct type here
    orderID: { type: String },
}, {
    timestamps: true,
    collection: "Orders"
});

export default mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);
