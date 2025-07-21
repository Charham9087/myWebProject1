import ConnectDB from "@/components/mognoConnect";
import Products from "@/components/models/products";

export async function POST(req) {
    try {
        await ConnectDB();
        console.log("Connected to MongoDB");

        const body = await req.json();
        console.log("Received body:", body);

        await Products.create({
            name: body.name,
            originalPrice: body.originalPrice,
            discountedPrice: body.discountedPrice,
            categories: body.categories,
            title: body.title,
            quantity: body.quantity,
            description: body.description,
            paymentMethod: body.paymentMethod,
            images: Array.isArray(body.images) ? body.images : [] // ✅ force array        
        });

        return Response.json({ message: "Product added successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error adding product:", error);
        return Response.json({ message: "Failed to add product." }, { status: 500 });
    }
}
