"use client"; // agar Next.js app router hai

export default function CataloguePage() {
  const products = [
    {
      id: 1,
      name: "Classic T-Shirt",
      price: 19.99,
      image: "/images/tshirt.jpg",
    },
    {
      id: 2,
      name: "Blue Jeans",
      price: 39.99,
      image: "/images/jeans.jpg",
    },
    {
      id: 3,
      name: "Sneakers",
      price: 59.99,
      image: "/images/sneakers.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Product Catalogue</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-medium">{product.name}</h2>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
