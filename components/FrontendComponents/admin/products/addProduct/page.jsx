"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

// ✅ Edge Store ka hook import
import { useEdgeStore } from "@/components/edgestore"
import SaveProduct from "@/server/SAVE-PRODUCT"

export default function AddProductPage() {
  const [categories, setCategories] = useState([""])
  const [done, setdone] = useState("")

  const router = useRouter()
  const [imageUrls, setImageUrls] = useState([])
  const [loading, setloading] = useState(false);
  const { register, handleSubmit, setValue } = useForm()

  // ✅ Edge Store ka hook initialize
  const { edgestore } = useEdgeStore()

  const handleAddCategory = () => {
    setCategories([...categories, ""])
  }

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories]
    newCategories[index] = value
    setCategories(newCategories)
  }

  // ✅ Ye function multiple files ko Edge Store pe upload karega
  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files) return

    const uploadedUrls = []
    console.log("RECEIVED FILES, ", files[0])

    // for (let file of files) {
    //   // har file ko Edge Store pe upload kar rahe hain
    //   const res = await edgestore.myPublicImages.upload({ file })
    //   console.log("Uploaded image URL:", res.url)
    var singleFIle = files[0]; console.log(singleFIle)
    const res = await edgestore.publicFiles.upload({
      file: singleFIle,
      onProgressChange: (progress) => {
        // you can use this to show a progress bar
        console.log(progress);
      },
    });
    console.log("Uploaded image URL:", res.url)




    //   // sirf public URL store kar rahe hain
    //   uploadedUrls.push(res.url)
    // }



    // console.log("Uploaded image URLs:", uploadedUrls)
    // setImageUrls(uploadedUrls)

    // ✅ form data me bhi images ki value set kar rahe hain
    setValue("images", uploadedUrls)
  }
  async function onSubmit(data) {
    setloading(true);
    console.log("FORM DATA ", data);

    data.categories = categories;
    console.log("categories stored in form data")

    // edge store :

    const urls = [];
    for (let file of data.files) {
      const res = await edgestore.publicFiles.upload({
        file: file,
        onProgressChange: (progress) => console.log("Uploading image", progress)
      });
      urls.push(res.url);
      console.log("SAVED URL IMAGE", res.url)
    }

    //  console.log("URLS ARRAY",urls)
    data.files = []; //empty files as theyre too big!

    data.urls = urls;

    // NOW CALL SERVER ACTION TO SAVE PRODUCT

    await SaveProduct(data);
    // to be continued   

    // router.push("/admin/products")

    setdone("done");
    setloading(false);


    // try {
    //   data.categories = categories         // categories bhi add kar rahe hain
    //   data.images = imageUrls              // images URLs bhi add kar rahe hain
    //   console.log("Form data:", data)

    //   const response = await fetch('/api/admin/addProduct', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: { 'Content-Type': 'application/json' }
    //   })

    //   const res = await response.json()
    //   console.log(res)

    //   alert(res.message)

    //   router.push("/admin/products")
    // } catch (err) {
    //   console.log(err)
    //   alert("Something went wrong.")
    // }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-gray-800 dark:text-white">
        🛍️ Add New Product - A Store
      </h1>
      {loading && (
        <div className="fixed top-10 right-10 bg-white shadow-lg border p-4 rounded z-50">
          <p className="text-gray-800">Loading...</p>
        </div>
      )}


      <Card>
        <CardHeader>
          <CardTitle>Add Product to A Store</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" {...register("name", { required: true })} />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <Label htmlFor="original-price">Original Price</Label>
                <Input id="original-price" type="number" placeholder="Rs.1000" {...register("originalPrice", { required: true })} />
              </div>
              <div>
                <Label htmlFor="discounted-price">Discounted Price</Label>
                <Input id="discounted-price" type="number" placeholder="Rs.800" {...register("discountedPrice", { required: true })} />
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
              <Input id="title" placeholder="Enter product title" {...register("title", { required: true })} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                {...register("files", { required: true })}

              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" {...register("quantity", { required: true })} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Write a short description..." {...register("description", { required: true })} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select onValueChange={(value) => setValue("paymentMethod", value)} required>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="whatsapp">Contact on WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" onClick={() => {
              if (done === 'done') {
                router.push("/admin/products")
              }
            }}>Add Product</Button>
          </form>
        </CardContent>
      </Card>
    </div >
  )
}
