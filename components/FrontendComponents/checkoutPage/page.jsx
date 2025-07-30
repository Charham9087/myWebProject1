"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Controlled form fields
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    email: "",
    phone: ""
  });

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Place order with validation
  const placeOrder = () => {
    const isEmpty = Object.values(form).some((value) => value.trim() === "");
    if (isEmpty) {
      alert("Please fill in all fields before placing the order!");
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    // ✅ Validate Pakistani phone number (starts with 03, 11 digits)
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("Please enter a valid Pakistani phone number starting with 03 and 11 digits long!");
      return;
    }

    // All good!
    alert(`Order placed successfully!\nPayment method: ${paymentMethod}`);
    console.log("Form data:", form);
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Forms */}
      <div className="space-y-4">
        {/* Shipping Address */}
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
                {/* Add more methods if needed */}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Right: Order Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Product A</span>
              <span>Rs 2,000</span>
            </div>
            <div className="flex justify-between">
              <span>Product B</span>
              <span>Rs 3,000</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs 5,000</span>
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
