import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        originalPrice: { type: Number, required: true },
        discountedPrice: { type: Number, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        description: { type: String, required: true },
        paymentMethod: { type: String, enum: ["cod", "whatsapp"], required: true },
        categories: { type: [String], required: true },
        images: { type: [String] },
        tags: { type: [String] },
        catalogues: { type: [String] },  // ✅ plural name
    },
    { collection: "Products", timestamps: true }

);

// Prevent model overwrite issue in Next.js hot reload
export default mongoose.models.Products || mongoose.model("Products", ProductsSchema);
