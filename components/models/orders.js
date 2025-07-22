import mongoose from "mongoose"

const OrdersSchema = new mongoose.schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    phone : {type : String, required : true},
    address : {type : String, required : true},
    city : {type : String, required : true},
    comments: {type : String},

    
},{timestamps : true,collection:"Orders"})

export default mongoose.models.Orders || mongoose.model("Orders",OrdersSchema)