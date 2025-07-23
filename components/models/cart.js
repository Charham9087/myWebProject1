import mongoose from 'mongoose'


const Cart = new mongoose.schema({
    id: {type : String, required : true},
    email: {type : String, required : true},
},{timestamps : true,collection:"Cart"})

export default mongoose.models.Cart || mongoose.model("Cart",Cart)

