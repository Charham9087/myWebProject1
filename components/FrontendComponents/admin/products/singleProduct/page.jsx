"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

// Dummy product data (replace with real fetched data)
const dummyProduct = {
  _id: "123",
  name: "Stylish Sneakers",
  title: "Best Running Sneakers 2025",
  images: [
    "https://via.placeholder.com/300x300?text=Image+1",
    "https://via.placeholder.com/300x300?text=Image+2",
    "https://via.placeholder.com/300x300?text=Image+3",
  ],
  discountedPrice: 1999,
  originalPrice: 2499,
  quantity: 20,
  categories: ["Footwear", "Sports"],
  paymentMethod: "cod",
  description:
    "Comfortable and stylish sneakers perfect for daily running and walking.",
};

export default function AdminProductDetailPage() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);

  const handleDelete = async () => {
    // await deleteProduct(dummyProduct._id);
    alert("Product deleted!"); // replace with real action
    router.push("/admin/products");
  };

  const handleEdit = () => {
    router.push(`/admin/products/edit/${dummyProduct._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛒 Product Details - Admin View</h1>

      <Card>
        <CardContent className="p-4">
          {/* Carousel */}
          <div className="relative">
            <img
              src={dummyProduct.images[currentImage]}
              alt={`Product image ${currentImage + 1}`}
              className="w-full h-80 object-cover rounded-xl"
            />
            <div className="flex justify-center mt-2 space-x-2">
              {dummyProduct.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentImage === index ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold">{dummyProduct.name}</h2>
            <p className="text-gray-500">{dummyProduct.title}</p>
            <p className="text-green-600 font-bold">Rs.{dummyProduct.discountedPrice}</p>
            <p className="line-through text-gray-400">Rs.{dummyProduct.originalPrice}</p>
            <p>Quantity: {dummyProduct.quantity}</p>
            <p>Payment Method: {dummyProduct.paymentMethod.toUpperCase()}</p>
            <p className="break-words">Categories: {dummyProduct.categories.join(", ")}</p>
            <p className="text-gray-700">{dummyProduct.description}</p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
