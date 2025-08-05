"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getCheckout, saveCheckout } from "@/server/checkout";
import crypto from "crypto";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [productData, setProductData] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [orderID, setOrderID] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const _id = searchParams.get("_id");

  // calculate total
  const total = productData.reduce((sum, item, index) => {
    const qty = quantity[index] > 0 ? quantity[index] : 1;
    const price = item?.discountedPrice || 0;
    return sum + price * qty;
  }, 0);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    email: "",
    phone: "",
    OrderID: "",
    productID: _id || "",
    total: 0,
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      productID: _id || "",
      total: total,
    }));
  }, [total, _id]);

  // Load quantities and match IDs from cart
  useEffect(() => {
    if (!_id) return;

    const cart = localStorage.getItem("cartItems");
    if (cart) {
      const parsedCart = JSON.parse(cart);
      const ids = _id.split(",");
      const matchingItems = parsedCart.filter((item) => ids.includes(item.id));
      const quantities = matchingItems.map((item) => item.quantity > 0 ? item.quantity : 1);
      setQuantity(quantities);
    }
  }, [_id]);

  // Load product details
  useEffect(() => {
    if (!_id) return;

    (async () => {
      try {
        const data = await getCheckout(_id);
        setProductData(data);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      }
    })();
  }, [_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const placeOrder = () => {
    const newOrderID = crypto.randomBytes(4).toString("hex");
    setOrderID(newOrderID);

    const { name, address, city, postal, email, phone } = form;
    const isEmpty = [name, address, city, postal, email, phone].some(
      (value) => value.trim() === ""
    );
    if (isEmpty) {
      alert("Please fill in all fields before placing the order!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Pakistani phone number starting with 03!");
      return;
    }

    const orderData = {
      ...form,
      OrderID: newOrderID,
      total,
    };

    saveCheckout(orderData);
    toast.success("Order placed successfully!");
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Shipping Form */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["name", "address", "city", "postal", "email", "phone"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field === "postal"
                    ? "Postal Code"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  placeholder={
                    field === "phone"
                      ? "03XXXXXXXXX"
                      : field === "email"
                      ? "you@example.com"
                      : `Enter your ${field}`
                  }
                  value={form[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-red-500 mt-2 text-sm">
              For online payment (JazzCash/Easypaisa), contact on WhatsApp:{" "}
              <a href="https://wa.me/923304462277" className="underline">
                +9230-4462277
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right: Order Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productData.length > 0 ? (
              productData.map((item, index) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      Quantity: {(quantity[index] ?? 1)} × Rs {item.discountedPrice}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">
                    Rs {(item.discountedPrice * (quantity[index] ?? 1)).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-red-500 text-sm">
                Error loading products. Contact on WhatsApp:{" "}
                <a href="https://wa.me/923304462277" className="underline">
                  +9230-4462277
                </a>
              </p>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Button className="w-full" onClick={placeOrder}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
