"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/server/Functionality-product-page"
// import updateProduct agar tumhare paas hai, warna bana lo:
import { updateProduct } from "@/server/Functionality-product-page"

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editingProductId, setEditingProductId] = useState(null); // 📝 kon sa product edit ho raha hai
  const [editFields, setEditFields] = useState({});               // 📝 edit fields temporary store
  const router = useRouter();


  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      console.log(data);
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    // search ko lowercase me convert kiya:
    const searchLower = search.toLowerCase();

    // name me search:
    const matchesName = product.name.toLowerCase().includes(searchLower);

    // tags me search:
    const matchesTags = product.tags?.some(tag =>
      tag.toLowerCase().includes(searchLower)
    );

    // agar category selected hai to uska check:
    const matchesCategory = category ? product.category === category : true;

    // return me: (name OR tags) AND category
    return (matchesName || matchesTags) && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Products - A Store</h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Footwear">Footwear</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="ml-auto" onClick={() => {
          router.push("/admin/products/addProduct");
        }}>+ Add Product</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </TableCell>

                  {/* ✅ agar edit mode hai toh input fields dikhao, warna text */}
                  {editingProductId === product._id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editFields.name}
                          onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editFields.discountedPrice}
                          onChange={(e) => setEditFields({ ...editFields, discountedPrice: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editFields.quantity}
                          onChange={(e) => setEditFields({ ...editFields, quantity: e.target.value })}
                        />
                      </TableCell>
                      <TableCell className="w-20 whitespace-normal break-words">
                        <Input
                          value={editFields.categories}
                          onChange={(e) => setEditFields({ ...editFields, categories: e.target.value })}
                        />
                        {/* yahan comma separated likhe user */}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.discountedPrice}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell className="w-20 whitespace-normal break-words">{product.categories.join(", ")}</TableCell>
                    </>
                  )}

                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="outline" onClick={() => {
                      router.push(`/admin/products/singleProductPage?id=${product._id}`)

                    }}>
                      <Eye className="w-4 h-4" />
                    </Button>

                    {editingProductId === product._id ? (
                      // ✅ edit mode me Save button dikhao
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={async () => {
                          await updateProduct({
                            _id: product._id,
                            name: editFields.name,
                            discountedPrice: editFields.discountedPrice,
                            quantity: editFields.quantity,
                            categories: editFields.categories.split(",").map(c => c.trim())
                          });
                          setEditingProductId(null); // exit edit mode
                          window.location.reload();  // refresh
                        }}
                      >
                        ✔️
                      </Button>
                    ) : (
                      // ✅ normal mode me edit button
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingProductId(product._id);
                          setEditFields({
                            name: product.name,
                            discountedPrice: product.discountedPrice,
                            quantity: product.quantity,
                            categories: product.categories.join(", ")
                          });
                          console.log("Editing product with ID:", product._id);

                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}

                    <Button size="icon" variant="destructive" onClick={async () => {
                      await deleteProduct(product._id);
                      window.location.reload();
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
