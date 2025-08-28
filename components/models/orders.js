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
    productID: [{ type: String }], 
    orderID: { type: String },
    AdvanceAmount:{type:Number , default:0},
    isShipped:{type:Boolean , default:false},
    isVerified:{type:Boolean , default:false},
    isCancelled:{type:Boolean , default:false},
}, {
    timestamps: true,
    collection: "Orders"
});

export default mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);
