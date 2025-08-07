import mongoose from "mongoose";

// Pehle check karo ke model pehle se exist to nahi (Next.js ke hot reload issue ki wajah se)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  role:{
    type:String,
    enum: ["user","admin"],
    required:true,
    default:"user"
  }
  // createdAt automatic timestamp
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
