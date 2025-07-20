"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Input
} from "@/components/ui/input"
import {
  Label
} from "@/components/ui/label"
import {
  Textarea
} from "@/components/ui/textarea"
import {
  Button
} from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const [categories, setCategories] = useState([""])

  const handleAddCategory = () => {
    setCategories([...categories, ""])
  }
const router = useRouter()

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories]
    newCategories[index] = value
    setCategories(newCategories)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-gray-800 dark:text-white">🛍️ Add New Product - A Store</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Product to A Store</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" required />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <Label htmlFor="original-price">Original Price</Label>
                <Input id="original-price" type="number" placeholder="Rs.1000" required />
              </div>
              <div>
                <Label htmlFor="discounted-price">Discounted Price</Label>
                <Input id="discounted-price" type="number" placeholder="Rs.800" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Categories</Label>
              {categories.map((category, index) => (
                <Input
                  key={index}
                  value={category}
                  placeholder={`Category ${index + 1}`}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  required={index === 0}
                />
              ))}
              <Button type="button" variant="outline" onClick={handleAddCategory} className="mt-2 w-fit">
                + Add Category
              </Button>
              <p className="text-sm text-muted-foreground">Add multiple categories separately</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter product title" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <Input id="images" type="file" multiple required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Write a short description..." required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select required>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="whatsapp">Contact on WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" onClick={()=>{
              router.push("/admin/products")
            }}>Add Product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
