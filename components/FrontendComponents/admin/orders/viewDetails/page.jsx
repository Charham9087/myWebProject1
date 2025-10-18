"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ViewOrderDetailFromDB } from "@/server/orders";

export default function AdminViewOrderPage({ orderId }) {
  const router = useRouter();
  const pathname = usePathname();

  const [order, setOrder] = useState(null);
  const [ProductData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await ViewOrderDetailFromDB(orderId);

        if (!result?.orderData) {
          throw new Error("Order not found");
        }

        if (!result?.productData) {
          throw new Error("Product data not found");
        }

        // ✅ Include shipping cost from DB
        setOrder({
          ...result.orderData,
          shippingCost: result.orderData.shippingCost || 0,
        });
        setProductData(result.productData);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="flex gap-4 items-center">
            <Skeleton className="w-32 h-32 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!order || !ProductData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Order or ProductData data is missing. Please try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={handleGoBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Badge variant="secondary" className="text-xs">
          ID: {orderId}
        </Badge>
        {order.status && (
          <Badge
            variant={order.status === "completed" ? "default" : "secondary"}
          >
            {order.status}
          </Badge>
        )}
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Customer & Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Customer:</strong> {order.name}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
          </div>
          <div className="space-y-2">
            <p><strong>City:</strong> {order.city}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p>
              <strong>Total Amount:</strong>{" "}
              <span className="font-semibold text-lg">
                Rs {order.total}
              </span>
            </p>
            {order.shippingCost > 0 && (
              <p><strong>Shipping Cost:</strong> Rs {order.shippingCost}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Ordered */}
      {ProductData.map((prod, index) => (
        <Card key={prod.id || index}>
          <CardHeader>
            <CardTitle className="text-lg">Product Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 items-start">
              <div className="w-32 h-32 relative flex-shrink-0">
                <Image
                  src={prod.images[0] || "/placeholder.svg?height=128&width=128"}
                  alt={prod.title || "Product image"}
                  fill
                  className="object-cover rounded-lg border"
                />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="font-semibold text-lg">{prod.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Unit Price</p>
                    <p className="font-medium">Rs {prod.discountedPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order?.quantity || 1}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">
                      Rs {prod.discountedPrice * (order?.quantity || 1)}
                    </p>
                    {prod.shipping_price > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        + Shipping: Rs {prod.shipping_price}
                      </p>
                    ):(
                         <p className="text-sm text-muted-foreground">
                        + Shipping: Rs.0
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Order Summary */}
      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex justify-between items-center text-lg">
            <span>Products Total:</span>
            <span>Rs {order.total - (order.shippingCost || 0)}</span>
          </div>
          {ProductData.shipping_price > 0 ? (
            <div className="flex justify-between items-center text-lg">
              <span>Shipping:</span>
              <span>Rs {ProductData.shipping_price}</span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-lg">
              <span>Shipping:</span>
              <span>Rs.0</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
            <span>Order Total:</span>
            <span>Rs {order.total}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
