"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 89.99,
    stock: 24,
    category: "Electronics",
    image: "/images/headphones.jpg",
  },
  {
    id: "2",
    name: "Leather Wallet",
    price: 45.0,
    stock: 13,
    category: "Accessories",
    image: "/images/wallet.jpg",
  },
  {
    id: "3",
    name: "Running Shoes",
    price: 120.0,
    stock: 6,
    category: "Footwear",
    image: "/images/shoes.jpg",
  },
];

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();


  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
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
        <Button className="ml-auto" onClick={()=>{
          router.push("/admin/products/addProduct")
        }
        }>+ Add Product</Button>
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
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
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
