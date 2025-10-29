"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { getCheckout, saveCheckout } from "@/server/checkout"
import { ShoppingBag, CreditCard, MapPin, Phone, Mail, User } from "lucide-react"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [productData, setProductData] = useState([])
  const [quantity, setQuantity] = useState({})
  const [orderID, setOrderID] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const _id = searchParams.get("_id")

  // ✅ Calculate total including shipping
  const total = productData.reduce((sum, item, index) => {
    const qty = quantity[index] > 0 ? quantity[index] : 1
    const price = item?.discountedPrice || 0
    const shipping = item?.shipping_price || 0
    return sum + price * qty + shipping
  }, 0)

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    email: "",
    phone: "",
    comments: "",
    orderID: "",
    productID: _id || "",
    total: 0,
  })

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      productID: _id || "",
      total: total,
    }))
  }, [total, _id])

  // ✅ Fetch quantity from localStorage
  useEffect(() => {
    if (!_id) return
    const cart = localStorage.getItem("cartItems")
    if (cart) {
      const parsedCart = JSON.parse(cart)
      const ids = _id.split(",")
      const matchingItems = parsedCart.filter((item) => ids.includes(item.id))
      const quantities = matchingItems.map((item) => (item.quantity > 0 ? item.quantity : 1))
      setQuantity(quantities)
    }
  }, [_id])

  // ✅ Fetch checkout product data
  useEffect(() => {
    if (!_id) return
      ; (async () => {
        try {
          const data = await getCheckout(_id)
          setProductData(data)
        } catch (error) {
          console.error("Error fetching checkout data:", error)
        }
      })()
  }, [_id])

  // ✅ Fire Meta Pixel InitiateCheckout when page loads
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq && productData.length > 0) {
      const productTitles = productData.map((item) => item.title).join(", ")
      window.fbq("track", "InitiateCheckout", {
        value: total,
        currency: "PKR",
        content_ids: productData.map((p) => p._id),
        content_name: productTitles,
        num_items: productData.length,
      })
      console.log("🟢 Meta Pixel: InitiateCheckout fired", { total, products: productTitles })
    }
  }, [productData, total])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const generateOrderID = () => "ORD-" + Math.floor(Math.random() * 1e9)

  const placeOrder = async () => {
    const newOrderID = generateOrderID();
    setOrderID(newOrderID);

    const { name, address, city, email, phone } = form;
    const isEmpty = [name, address, city, email, phone].some((value) => value.trim() === "");
    if (isEmpty) {
      alert("Please fill in all fields before placing the order!");
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!")
      return
    }

    const phoneRegex = /^03\d{9}$/
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Pakistani phone number starting with 03!")
      return
    }

    const orderData = {
      ...form,
      orderID: newOrderID,
      total,
    };

    try {
      // call server action and await result
      const res = await saveCheckout(orderData);

      // If saveCheckout returns an object (as patched above)
      if (res && res.success) {
        // Fire pixel after we get server confirmation (optional if you want pixel to reflect real order)
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            value: total,
            currency: "PKR",
            content_ids: productData.map((p) => p._id),
            content_name: productData.map((p) => p.title).join(", "),
            num_items: productData.length,
            order_id: newOrderID,
          });
        }

        toast.success("Order placed successfully!");
        router.push("/");
      } else {
        console.error("Order failed:", res);
        toast.error("Order failed: " + (res?.error || "Server error"));
      }
    } catch (err) {
      console.error("Place order unexpected error:", err);
      toast.error("Unexpected error placing order.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your order details below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Shipping Form */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-medium">
                      <User className="w-4 h-4" /> Full Name
                    </Label>
                    <Input id="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-medium">
                      <Phone className="w-4 h-4" /> Phone Number
                    </Label>
                    <Input id="phone" placeholder="03XXXXXXXXX" value={form.phone} onChange={handleChange} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 font-medium">
                    <Mail className="w-4 h-4" /> Email Address
                  </Label>
                  <Input id="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address" className="text-slate-700 font-medium">Complete Address</Label>
                  <Input id="address" placeholder="House #, Street, Area" value={form.address} onChange={handleChange} />
                </div>

                {/* City + Postal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-slate-700 font-medium">City</Label>
                    <Input id="city" placeholder="Enter your city" value={form.city} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="postal" className="text-slate-700 font-medium">Postal Code (optional)</Label>
                    <Input id="postal" placeholder="Enter postal code" value={form.postal} onChange={handleChange} />
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Label htmlFor="comments" className="text-slate-700 font-medium">Comments (optional)</Label>
                  <Input id="comments" placeholder="Any special instructions?" value={form.comments} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CreditCard className="w-5 h-5 text-green-600" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">💵 Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  💳 For online payment (JazzCash/Easypaisa) contact us on{" "}
                  <a href="https://wa.me/923304462277" className="text-green-600 underline">+92 330-4462277</a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {productData.length > 0 ? (
                  productData.map((item, index) => (
                    <div key={item._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <img src={item.images?.[0] || "/placeholder.png"} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-600">
                          Qty: {quantity[index] ?? 1} × Rs {item.discountedPrice} + Ship Rs {item.shipping_price || 0}
                        </p>
                      </div>
                      <div className="text-right font-bold text-slate-800">
                        Rs {(item.discountedPrice * (quantity[index] ?? 1) + (item.shipping_price || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-red-500">🔃 loading products  <br /> Please Wait....</div>
                )}

                <div className="border-t pt-4 flex justify-between font-bold text-slate-800">
                  <span>Total Amount</span>
                  <span className="text-blue-600">Rs {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full h-12 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-lg font-semibold rounded-xl"
              onClick={placeOrder}
            >
              🛒 Place Order - Rs {total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
