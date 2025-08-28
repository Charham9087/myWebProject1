"use client";

import { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, XCircle, Eye, Truck, User2, Pencil, Save, Loader2 } from "lucide-react";
import { 
  ShowOrderPageData, 
  UpdateAdvanceAmount, 
  ToggleVerify, 
  ToggleShipped, 
  CancelOrder, 
  RestoreOrder 
} from "@/server/orders";
import { useRouter } from "next/navigation";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-auto" role="dialog" aria-modal="true">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [editingAdvanceId, setEditingAdvanceId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const ordersData = await ShowOrderPageData();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setNotification({ type: 'error', message: 'Failed to load orders.' });
    } finally {
      setLoading(false);
    }
  }

  function handleAdvanceChange(id, value) {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderID === id ? { ...order, AdvanceAmount: parseFloat(value) || 0 } : order
      )
    );
  }

  function customConfirm(message) {
    return new Promise((resolve) => {
      setConfirmData({ message, resolve });
    });
  }

  const saveAdvanceAmount = async (id) => {
    try {
      const order = orders.find(o => o.orderID === id);
      if (!order) return;

      const message = `Are you sure you want to add <strong>Rs.${order.AdvanceAmount}</strong> to order #: ${order.orderID}?`;
      const confirmed = await customConfirm(message);
      if (!confirmed) return;

      const remaining = (order.total ?? 0) - (order.AdvanceAmount ?? 0);
      await UpdateAdvanceAmount(id, order.AdvanceAmount, remaining);

      await fetchOrders();
      setEditingAdvanceId(null);
      setNotification({ type: "success", message: `Advance amount updated for order ${id}` });
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Failed to update advance amount." });
    }
  };

  const closeConfirm = (answer) => {
    if (confirmData) {
      confirmData.resolve(answer);
      setConfirmData(null);
    }
  };

  const Notification = () => (
    notification && (
      <div
        className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${
          notification.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
        onClick={() => setNotification(null)}
        style={{ cursor: "pointer", zIndex: 1000 }}
      >
        {notification.message}
      </div>
    )
  );

  // ✅ Verify (Optimistic UI)
  const toggleVerify = async (id) => {
    const order = orders.find(o => o.orderID === id);
    if (!order) return;

    // Optimistic update
    setOrders(prev => prev.map(o =>
      o.orderID === id ? { ...o, isVerified: !o.isVerified } : o
    ));

    try {
      await ToggleVerify(id, !order.isVerified);
      setNotification({ type: "success", message: `Order ${id} ${!order.isVerified ? "verified" : "unverified"}.` });
    } catch (err) {
      // rollback if fail
      setOrders(prev => prev.map(o =>
        o.orderID === id ? { ...o, isVerified: order.isVerified } : o
      ));
      console.error(err);
      setNotification({ type: "error", message: "Failed to update verification." });
    }
  };

  // ✅ Shipped (Optimistic UI)
  const toggleShipped = async (id) => {
    const order = orders.find(o => o.orderID === id);
    if (!order) return;

    setOrders(prev => prev.map(o =>
      o.orderID === id ? { ...o, isShipped: !o.isShipped } : o
    ));

    try {
      await ToggleShipped(id, !order.isShipped);
      setNotification({ type: "success", message: `Order ${id} ${!order.isShipped ? "shipped" : "set to pending"}.` });
    } catch (err) {
      setOrders(prev => prev.map(o =>
        o.orderID === id ? { ...o, isShipped: order.isShipped } : o
      ));
      console.error(err);
      setNotification({ type: "error", message: "Failed to update shipment." });
    }
  };

  // ✅ Cancel (Optimistic UI)
  const cancelOrder = async (id) => {
    const order = orders.find(o => o.orderID === id);
    if (!order) return;

    if (!window.confirm("❌ Are you sure you want to cancel this order?")) return;

    setOrders(prev => prev.map(o =>
      o.orderID === id ? { ...o, isCancelled: true } : o
    ));

    try {
      await CancelOrder(id);
      setNotification({ type: "success", message: `Order ${id} cancelled.` });
    } catch (err) {
      setOrders(prev => prev.map(o =>
        o.orderID === id ? { ...o, isCancelled: order.isCancelled } : o
      ));
      console.error(err);
      setNotification({ type: "error", message: "Failed to cancel order." });
    }
  };

  // ✅ Restore (Optimistic UI)
  const restoreOrder = async (id) => {
    const order = orders.find(o => o.orderID === id);
    if (!order) return;

    setOrders(prev => prev.map(o =>
      o.orderID === id ? { ...o, isCancelled: false } : o
    ));

    try {
      await RestoreOrder(id);
      setNotification({ type: "success", message: `Order ${id} restored.` });
    } catch (err) {
      setOrders(prev => prev.map(o =>
        o.orderID === id ? { ...o, isCancelled: order.isCancelled } : o
      ));
      console.error(err);
      setNotification({ type: "error", message: "Failed to restore order." });
    }
  };

  const viewDetails = (id) => {
    router.push(`/admin/orders/viewOrderDetails?_id=${id}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6 sm:mb-8">
        📦 Admin Orders
      </h1>

      {notification && <Notification />}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">No orders found.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.orderID} className="rounded-2xl shadow-md border-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <User2 className="w-5 h-5" /> {order.orderID}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${order.isVerified ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-800"}`}>
                        {order.isVerified ? "✅ Verified" : "❌ Not Verified"}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        order.isCancelled
                          ? "bg-red-100 text-red-700"
                          : order.isShipped
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.isCancelled ? "Cancelled" : order.isShipped ? "Shipped" : "Pending"}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4 text-sm">
                  <div>
                    <h4 className="font-semibold">🧍 Customer</h4>
                    <p>{order.name}</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">🚚 Shipping</h4>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.postal}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">🧾 Order Summary</h4>
                    <p>Total: Rs.{(order.total ?? 0).toFixed(2)}</p>
                    <p>
                      Advance Paid:{" "}
                      {editingAdvanceId === order.orderID ? (
                        <>
                          <input
                            type="number"
                            value={order.AdvanceAmount ?? 0}
                            onChange={(e) =>
                              handleAdvanceChange(order.orderID, e.target.value)
                            }
                            className="border p-1 rounded w-24"
                          />
                          <Button size="sm" className="ml-2"
                            onClick={async () => {
                              await saveAdvanceAmount(order.orderID);
                            }}>
                            <Save className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-blue-600">
                            Rs.{(order.AdvanceAmount ?? 0).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-2"
                            onClick={() => setEditingAdvanceId(order.orderID)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </p>
                    <p>
                      Remaining: Rs.{(order.total ?? 0) - (order.AdvanceAmount ?? 0)}
                    </p>
                    <p>Status: {order.isCancelled ? "Cancelled" : order.isShipped ? "Shipped" : "Pending"}</p>
                    <p>Note: {order.comments || "—"}</p>
                  </div>
                </CardContent>

                <Separator />

                <CardFooter className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <Button size="sm" onClick={() => viewDetails(order.orderID)}>
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleShipped(order.orderID)} disabled={order.isCancelled}>
                    <Truck className="w-4 h-4 mr-1" /> {order.isShipped ? "Mark as Pending" : "Mark as Shipped"}
                  </Button>
                  {order.isCancelled ? (
                    <Button size="sm" variant="secondary" onClick={() => restoreOrder(order.orderID)}>
                      ♻️ Undo Cancel
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => cancelOrder(order.orderID)}>
                      <XCircle className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button size="sm" variant={order.isVerified ? "secondary" : "default"} onClick={() => toggleVerify(order.orderID)} disabled={order.isCancelled}>
                    <BadgeCheck className="w-4 h-4 mr-1" /> {order.isVerified ? "Unverify" : "Verify"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {confirmData && (
        <ConfirmModal
          message={confirmData.message}
          onConfirm={() => closeConfirm(true)}
          onCancel={() => closeConfirm(false)}
        />
      )}
    </div>
  );
}
