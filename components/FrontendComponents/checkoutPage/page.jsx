"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getCheckout, saveCheckout } from "@/server/checkout";
import crypto from "crypto";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [ProductData, setProductData] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [orderID, setOrderID] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const _id = searchParams.get("_id");
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    email: "",
    phone: "",
    OrderID: orderID,
    productID: _id,
  });





  useEffect(() => {
        if (!_id) return; // ✅ Defensive check// get quantity from localStorage by matching ids
    const cart = localStorage.getItem("cartItems");
    if (cart) {
      const parsedCart = JSON.parse(cart);
      const ids = _id.split(",");
      const matchingItems = parsedCart.filter(item => ids.includes(item.id));
      const quantities = matchingItems.map(item => item.quantity);
      setQuantity(quantities);
      console.log("Quantities:", quantities);
    }
    // set product ids in form
    setForm(prev => ({ ...prev, productID: _id }));
  }, [_id]);

  useEffect(() => {
    (async () => {
      const data = await getCheckout(_id);
      setProductData(data);
      console.log("Data received from DB", data);
    })();
  }, [_id]);




  // calculate total
  const total = ProductData.reduce((sum, item, index) => {
    const qty = quantity[index] || 0;
    return sum + item.discountedPrice * qty;
  }, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const placeOrder = () => {
    // generate new order ID
    const newOrderID = crypto.randomBytes(4).toString("hex");
    setOrderID(newOrderID);
    setForm(prev => ({ ...prev, OrderID: newOrderID }));

    // validate only user fields
    const { name, address, city, postal, email, phone } = form;
    const isEmpty = [name, address, city, postal, email, phone].some((value) => value.trim() === "");
    if (isEmpty) {
      alert("Please fill in all fields before placing the order!");
      return;
    }

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    // validate phone
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Pakistani phone number starting with 03 and 11 digits long!");
      return;
    }

    console.log("All forms validated!");
    console.log("Generated OrderID:", newOrderID);
    console.log("Form data:", { ...form, OrderID: newOrderID });
    console.log(form)
    saveCheckout(form)
    toast(`Order placed successfully! Soon you will receive an Email!`);
    router.push("/");
  };


  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Forms */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main Street" value={form.address} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Lahore" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="postal">Postal Code</Label>
              <Input id="postal" placeholder="54000" value={form.postal} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="03XXXXXXXXX" value={form.phone} onChange={handleChange} />
            </div>
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
              If you want to pay online via Jazzcash, Easypaisa, or Bank, contact us on WhatsApp:{" "}
              <a href="https://wa.me/923304462277" className="underline">+9230-4462277</a>
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
            {ProductData.length !== 0 ? (
              ProductData.map((item, index) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.images[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg ">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      Quantity: {quantity[index]} × Rs {item.discountedPrice}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">
                    Rs {item.discountedPrice * quantity[index]}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-red-500 text-sm">
                An error occurred... <br />
                Please contact on WhatsApp:{" "}
                <a href="https://wa.me/923304462277" className="underline">+9230-4462277</a>
              </p>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>Rs {total}</span>
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
