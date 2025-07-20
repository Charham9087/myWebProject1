"use client";

import { useState, useEffect, useRef } from "react";

export default function CategoryFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const dropdownRef = useRef(null);

  const productTypes = [
    "All",
    "Clothing",
    "Shoes",
    "Accessories",
    "Electronics",
    "Home & Living"
  ];

  const allProducts = [
    { id: 1, name: "T-shirt", category: "Clothing" },
    { id: 2, name: "Sneakers", category: "Shoes" },
    { id: 3, name: "Sunglasses", category: "Accessories" },
    { id: 4, name: "Laptop", category: "Electronics" },
    { id: 5, name: "Cushion", category: "Home & Living" },
    { id: 6, name: "Jeans", category: "Clothing" },
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      setIsOpen(false);
    }

    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Dropdown center */}
      <div className="p-4 flex justify-center">
        <div ref={dropdownRef} className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {selectedCategory === "All" ? "Select Category" : selectedCategory}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                {productTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedCategory(type);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* Products grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-2 rounded">
            <div>{product.name}</div>
            <div className="text-xs text-gray-500">{product.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
