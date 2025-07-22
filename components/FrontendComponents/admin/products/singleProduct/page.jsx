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

export default function AdminProductDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const _id = searchParams.get("id");

  const [currentImage, setCurrentImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [categories, setCategories] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [catalogues, setCatalogues] = useState([""]);  // ✅ added catalogues state
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
        setCatalogues(data.catalogues || [""]);  // ✅ load catalogues if present
        setImageUrls(data.images || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (_id) fetchProduct();
  }, [_id]);

  const handleDelete = async () => {
    await deleteProduct(_id);
    alert("Product deleted!");
    router.push("/admin/products");
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    const finalData = {
      ...editedProduct,
      categories,
      tags,
      catalogues,         // ✅ include catalogues
      images: imageUrls,
    };
    console.log("Sending data to backend:", finalData);
    await updateProduct(finalData);
    setIsEditing(false);
    alert("Product updated!");
  };

  const handleChange = (field, value) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => setCategories([...categories, ""]);
  const handleCategoryChange = (i, value) => {
    const newC = [...categories]; newC[i] = value; setCategories(newC);
  };

  const handleAddTag = () => setTags([...tags, ""]);
  const handleTagChange = (i, value) => {
    const newT = [...tags]; newT[i] = value; setTags(newT);
  };

  const handleAddCatalogue = () => setCatalogues([...catalogues, ""]);
  const handleCatalogueChange = (i, value) => {
    const newList = [...catalogues]; newList[i] = value; setCatalogues(newList);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;
    const urls = [];
    for (let file of files) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (p) => console.log("Upload progress:", p),
      });
      urls.push(res.url);
    }
    setImageUrls(urls);
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
              <Input value={editedProduct.name} onChange={(e) => handleChange("name", e.target.value)} />
              <Input value={editedProduct.title} onChange={(e) => handleChange("title", e.target.value)} />

              <div className="flex gap-2">
                <Input type="number" value={editedProduct.originalPrice} onChange={(e) => handleChange("originalPrice", Number(e.target.value))} placeholder="Original Price" />
                <Input type="number" value={editedProduct.discountedPrice} onChange={(e) => handleChange("discountedPrice", Number(e.target.value))} placeholder="Discounted Price" />
              </div>

              <Input type="number" value={editedProduct.quantity} onChange={(e) => handleChange("quantity", Number(e.target.value))} placeholder="Quantity" />
              <Input value={editedProduct.paymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} placeholder="Payment Method" />

              <div>
                <p className="text-sm font-semibold">Categories</p>
                {categories.map((cat, i) => (
                  <Input key={i} value={cat} onChange={(e) => handleCategoryChange(i, e.target.value)} className="mb-1" />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddCategory}>+ Add Category</Button>
              </div>

              <div>
                <p className="text-sm font-semibold">Catalogues</p>
                {catalogues.map((c, i) => (
                  <Input key={i} value={c} onChange={(e) => handleCatalogueChange(i, e.target.value)} className="mb-1" />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddCatalogue}>+ Add Catalogue</Button>
              </div>

              <div>
                <p className="text-sm font-semibold">Tags</p>
                {tags.map((tag, i) => (
                  <Input key={i} value={tag} onChange={(e) => handleTagChange(i, e.target.value)} className="mb-1 w-32" />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>+ Add Tag</Button>
              </div>

              <div>
                <p className="text-sm font-semibold">Images</p>
                <Input type="file" multiple onChange={handleUpload} />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imageUrls.map((url, i) => (
                    <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              </div>

              <Textarea value={editedProduct.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Description" />
            </>
          ) : (
            <>
              <div className="relative">
                <img src={editedProduct.images?.[currentImage]} alt="" className="w-full h-80 object-cover rounded-xl" />
                <div className="flex justify-center mt-2 space-x-2">
                  {editedProduct.images?.map((_, index) => (
                    <button key={index} onClick={() => setCurrentImage(index)} className={`w-3 h-3 rounded-full ${currentImage === index ? "bg-blue-500" : "bg-gray-300"}`}></button>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-semibold">{editedProduct.name}</h2>
              <p>{editedProduct.title}</p>
              <p className="text-green-600 font-bold">Rs.{editedProduct.discountedPrice}</p>
              <p className="line-through text-gray-400">Rs.{editedProduct.originalPrice}</p>
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
              <Button variant="success" onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save</Button>
            ) : (
              <Button variant="outline" onClick={handleEdit}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
            )}
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
