"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Save } from "lucide-react";
import { deleteProduct, updateProduct } from "server/Functionality-product-page";
import { useEdgeStore } from "@/components/edgestore";
import { showCatalogue, SaveCatalogue } from "@/server/catalogue-functions";

export default function AdminProductDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const _id = searchParams.get("id");

  const [currentImage, setCurrentImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [categories, setCategories] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [catalogues, setCatalogues] = useState([""]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const { edgestore } = useEdgeStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/admin/products/singlePageProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id }),
        });
        const data = await res.json();
        console.log("Fetched product data:", data);
        setEditedProduct(data);
        setCategories(data.categories || [""]);
        setTags(data.tags || [""]);
        setImageUrls(data.images || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (_id) fetchProduct();
  }, [_id]);

  useEffect(() => {
    async function fetchCatalogues() {
      const names = await showCatalogue();
      setCatalogues(names);
    }
    fetchCatalogues();
  }, []);

  const handleDelete = async () => {
    await deleteProduct(_id);
    alert("Product deleted!");
    router.push("/admin/products");
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    const finalData = {
      ...editedProduct,
      images: imageUrls, // keep same images
    };
    console.log("Sending data to backend:", finalData);
    await updateProduct(finalData);
    setIsEditing(false);
    router.push("/admin/products/singleProductPage");
    router.refresh();
  };

  const handleChange = (field, value) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => setCategories([...categories, ""]);
  const handleCategoryChange = (i, value) => {
    const newC = [...categories];
    newC[i] = value;
    setCategories(newC);
  };

  const handleAddTag = () => setTags([...tags, ""]);
  const handleTagChange = (i, value) => {
    const newT = [...tags];
    newT[i] = value;
    setTags(newT);
  };

  if (loading) return <div className="text-center p-6">Loading product...</div>;
  if (!editedProduct) return <div className="text-center p-6 text-red-500">Product not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛒 Product Details - Admin View</h1>
      <Card>
        <CardContent className="p-4 space-y-4">
          {isEditing ? (
            <>
              <label className="font-semibold text-sm">Product Name</label>
              <Input value={editedProduct.name} onChange={(e) => handleChange("name", e.target.value)} />

              <label className="font-semibold text-sm">Title</label>
              <Input value={editedProduct.title} onChange={(e) => handleChange("title", e.target.value)} />

              {/* Title */}
              <label className="text-sm font-semibold mt-2">Title</label>
              <Input
                value={editedProduct.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />

              {/* Prices */}
              <label className="text-sm font-semibold mt-2">Prices</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-semibold text-sm">Original Price</label>
                  <Input
                    type="number"
                    value={editedProduct.originalPrice}
                    onChange={(e) => handleChange("originalPrice", Number(e.target.value))}
                    placeholder="Original Price"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-sm">Discounted Price</label>
                  <Input
                    type="number"
                    value={editedProduct.discountedPrice}
                    onChange={(e) => handleChange("discountedPrice", Number(e.target.value))}
                    placeholder="Discounted Price"
                  />
                </div>
              </div>

              <label className="font-semibold text-sm">Shipping Price</label>
              <Input
                type="number"
                value={editedProduct.shippingPrice || 0}
                onChange={(e) => handleChange("shippingPrice", Number(e.target.value))}
                placeholder="Shipping Price"
              />

              <label className="font-semibold text-sm">Quantity</label>
              <Input
                type="number"
                value={editedProduct.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                placeholder="Quantity"
              />

              <label className="font-semibold text-sm">Payment Method</label>
              <Input
                value={editedProduct.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                placeholder="Payment Method"
              />

              {/* Categories */}
              <div className="mt-2">
                <label className="text-sm font-semibold">Categories</label>
                {categories.map((cat, i) => (
                  <Input
                    key={i}
                    value={cat}
                    onChange={(e) => handleCategoryChange(i, e.target.value)}
                    className="mb-1"
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddCategory}>
                  + Add Category
                </Button>
              </div>

              {/* Catalogues */}
              <div className="grid gap-2 mt-2">
                <label className="text-sm font-semibold">Catalogues</label>
                <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                  {catalogues.map((cat, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editedProduct.catalogues?.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditedProduct(prev => ({
                              ...prev,
                              catalogues: [...(prev.catalogues || []), cat],
                            }));
                          } else {
                            setEditedProduct(prev => ({
                              ...prev,
                              catalogues: prev.catalogues?.filter(c => c !== cat),
                            }));
                          }
                        }}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const newCat = prompt("Enter new catalogue name:");
                    if (newCat) {
                      setCatalogues([...catalogues, newCat]);
                      await SaveCatalogue({ name: newCat });
                    }
                  }}
                >
                  + Add Catalogue
                </Button>
              </div>

              {/* Tags */}
              <div className="mt-2">
                <label className="text-sm font-semibold">Tags</label>
                {tags.map((tag, i) => (
                  <Input
                    key={i}
                    value={tag}
                    onChange={(e) => handleTagChange(i, e.target.value)}
                    className="mb-1 w-32"
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                  + Add Tag
                </Button>
              </div>

              {/* Images (View Only) */}
              <div>
                <p className="text-sm font-semibold">Images (View Only)</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imageUrls.map((url, i) => (
                    <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              </div>

              <label className="font-semibold text-sm">Description</label>
              <Textarea
                value={editedProduct.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description"
              />
            </>

          ) : (
            <>
              <div className="relative">
                <img
                  src={editedProduct.images?.[currentImage]}
                  alt=""
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="flex justify-center mt-2 space-x-2">
                  {editedProduct.images?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentImage === index ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-semibold">{editedProduct.name}</h2>
              <p>{editedProduct.title}</p>
              <p className="text-green-600 font-bold">Rs.{editedProduct.discountedPrice}</p>
              <p className="line-through text-gray-400">Rs.{editedProduct.originalPrice}</p>
              <p>Shipping Price: Rs.{editedProduct.shippingPrice || 0}</p>
              <p>Quantity: {editedProduct.quantity}</p>
              <p>Payment Method: {editedProduct.paymentMethod?.toUpperCase()}</p>
              <p>Categories: {editedProduct.categories?.join(", ")}</p>
              <p>Catalogues: {editedProduct.catalogues?.join(", ")}</p>
              <p>Tags: {editedProduct.tags?.join(", ")}</p>
              <p>{editedProduct.description}</p>
            </>

          )}

          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <Button variant="success" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            ) : (
              <Button variant="outline" onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
