"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminViewOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulated order fetch
    const fakeOrder = {
      _id: id,
      customer: {
        name: "Arham Qaiser",
        email: "arham@example.com",
        phone: "0300-1234567",
      },
      createdAt: "2025-08-06T14:30:00Z",
      status: "Processing",
      shippingStatus: "Pending",
      products: [
        {
          _id: "p1",
          name: "Wireless Headphones",
          image: "https://via.placeholder.com/150",
          price: 200,
          quantity: 2,
        },
        {
          _id: "p2",
          name: "Gaming Mouse",
          image: "https://via.placeholder.com/150",
          price: 50,
          quantity: 1,
        },
      ],
    };

    setOrder(fakeOrder);
  }, [id]);

  if (!order) {
    return <p className="text-center mt-10">Loading order...</p>;
  }

  const total = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Customer:</strong> {order.customer.name}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <p><strong>Phone:</strong> {order.customer.phone}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> <Badge>{order.status}</Badge></p>
          <p><strong>Shipping:</strong> <Badge>{order.shippingStatus}</Badge></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ordered Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.products.map((product) => (
            <div key={product._id} className="flex gap-4 items-center border-b pb-4">
              <div className="w-24 h-24 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="font-semibold">{product.name}</h2>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Quantity: {product.quantity}</p>
                <p className="font-medium">
                  Subtotal: ${(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center px-2">
        <h2 className="text-lg font-semibold">Total: ${total.toFixed(2)}</h2>
        <div className="flex gap-2">
          
          <Button variant="destructive">Go Back</Button>
        </div>
      </div>
    </div>
  );
}
