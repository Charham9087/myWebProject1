"use client"

import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEdgeStore } from "@/components/edgestore"
import SaveProduct from "@/server/SAVE-PRODUCT"
import { SaveCatalogue, showCatalogue } from "@/server/catalogue-functions"

export default function AddProductPage() {
  const [categories, setCategories] = useState(["Electronics", "Accessories", "Clothing"]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [catalogues, setCatalogues] = useState(["New Arrivals", "Summer Collection"]);
  const [selectedCatalogues, setSelectedCatalogues] = useState([]);
  const [tags, setTags] = useState([""]);
  const [done, setdone] = useState("");
  const [loading, setloading] = useState(false);

  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    async function fetchCatalogues() {
      const names = await showCatalogue();
      setCatalogues(names);
    }
    fetchCatalogues();
  }, []);

  const handleAddTag = () => setTags([...tags, ""]);
  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  async function onSubmit(data) {
    setloading(true);

    data.categories = selectedCategories;
    data.catalogues = selectedCatalogues;
    data.tags = tags;

    // Upload product images
    const urls = [];
    for (let file of data.files) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => console.log("Uploading image", progress)
      });
      urls.push(res.url);
    }
    data.urls = urls;

    // Upload variant images
    let variantUrls = [];
    if (data.variants && data.variants.length > 0) {
      for (let file of data.variants) {
        const res = await edgestore.publicFiles.upload({ file });
        variantUrls.push(res.url);
      }
    }
    data.variantUrls = variantUrls; // even if empty


    data.files = [];      // Clear original files from payload
    data.variants = [];   // Clear variant files from payload

    console.log("Final data to save:", data);
    await SaveProduct(data);
    setdone("done");
    setloading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-gray-800 dark:text-white">
        🛍️ Add New Product - A Store
      </h1>

      {loading && (
        <div className="fixed top-10 right-10 bg-white shadow-lg border p-4 rounded z-50">
          <p className="text-gray-800">Uploading...</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Product to A Store</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>

            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input placeholder="Enter product name" {...register("name", { required: true })} />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <Label>Original Price</Label>
                <Input type="number" placeholder="Rs.1000" {...register("originalPrice", { required: true })} />
              </div>
              <div>
                <Label>Discounted Price</Label>
                <Input type="number" placeholder="Rs.800" {...register("discountedPrice", { required: true })} />
              </div>
            </div>
            {/* dhipping details  */}
            <div className="grid gap-2">
              <Label>Shipping Price</Label>
              <Input
                type="number"
                placeholder="Rs.150"
                {...register("shipping_price", { required: true })}
              />
            </div>


            {/* Categories multi-select */}
            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                {categories.map((cat, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedCategories([...selectedCategories, cat])
                          : setSelectedCategories(selectedCategories.filter(c => c !== cat))
                      }
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => {
                const newCat = prompt("Enter new category name:");
                if (newCat) setCategories([...categories, newCat]);
              }} className="mt-2 w-fit">+ Add Category</Button>
            </div>

            {/* Catalogues multi-select */}
            <div className="grid gap-2">
              <Label>Catalogues</Label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                {catalogues.map((cat, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCatalogues.includes(cat)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedCatalogues([...selectedCatalogues, cat])
                          : setSelectedCatalogues(selectedCatalogues.filter(c => c !== cat))
                      }
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={async () => {
                const newCat = prompt("Enter new catalogue name:");
                if (newCat) {
                  setCatalogues([...catalogues, newCat]);
                  await SaveCatalogue({ name: newCat });
                }
              }} className="mt-2 w-fit">+ Add Catalogue</Button>
            </div>

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input placeholder="Enter product title" {...register("title", { required: true })} />
            </div>

            <div className="grid gap-2">
              <Label>Images</Label>
              <Input type="file" multiple {...register("files", { required: true })} />
            </div>

            {/* ✅ Variants images */}
            <div className="grid gap-2">
              <Label>Variants</Label>
              <Input type="file" multiple {...register("variants")} />
            </div>

            <div className="grid gap-2">
              <Label>Quantity</Label>
              <Input type="number" placeholder="0" {...register("quantity", { required: true })} />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea placeholder="Write a short description..." {...register("description", { required: true })} />
            </div>

            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select onValueChange={(value) => setValue("paymentMethod", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="whatsapp">Contact on WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Input
                    key={index}
                    value={tag}
                    placeholder={`Tag ${index + 1}`}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="w-28"
                  />
                ))}
              </div>
              <Button type="button" variant="outline" onClick={handleAddTag} className="mt-2 w-fit">
                + Add Tag
              </Button>
            </div>

            <Button type="submit" onClick={() => {
              if (done === 'done') {
                router.push("/admin/products");
              }
            }}>
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
