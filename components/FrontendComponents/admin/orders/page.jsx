"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, XCircle, Eye, Truck, User2 } from "lucide-react";
import { ShowOrderPageData } from "@/server/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await ShowOrderPageData();
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const toggleVerify = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderID === id
          ? { ...order, verified: !order.verified }
          : order
      )
    );
  };

  const toggleShipped = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderID === id
          ? {
              ...order,
              status: order.status === "Shipped" ? "Pending" : "Shipped",
            }
          : order
      )
    );
  };

  const cancelOrder = (id) => alert(`❌ Cancel order ${id}`);
  const viewDetails = (id) => alert(`🔍 View details for order ${id}`);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
        📦 Admin Orders
      </h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card
            key={order.orderID}
            className={`rounded-2xl shadow-md transition duration-200 hover:shadow-lg border-2 ${
              order.verified
                ? "border-green-400"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <User2 className="w-5 h-5" />
                  {order.orderID}
                </CardTitle>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      order.verified
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {order.verified ? "✅ Verified" : "❌ Not Verified"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      order.status === "Shipped"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
              {/* Customer Info */}
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                  🧍 Customer
                </h4>
                <p>{order.name}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
              </div>

              {/* Shipping Info */}
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                  🚚 Shipping
                </h4>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.postal}
                </p>
              </div>

              {/* Order Info */}
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                  🧾 Order Summary
                </h4>
                <p>
                  Total:{" "}
                  <span className="font-medium">
                    ${(order.total ?? 0).toFixed(2)}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span className="font-medium">{order.status}</span>
                </p>
                <p>Note: {order.comments || "—"}</p>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-wrap gap-3 justify-end mt-4">
              <Button size="sm" onClick={() => viewDetails(order.orderID)}>
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleShipped(order.orderID)}
              >
                <Truck className="w-4 h-4 mr-1" />
                {order.status === "Shipped"
                  ? "Mark as Pending"
                  : "Mark as Shipped"}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => cancelOrder(order.orderID)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>

              <Button
                size="sm"
                variant={order.verified ? "secondary" : "default"}
                onClick={() => toggleVerify(order.orderID)}
              >
                <BadgeCheck className="w-4 h-4 mr-1" />
                {order.verified ? "Unverify" : "Verify"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
