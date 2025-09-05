"use client";
import { useState, useEffect } from "react";

export default function Carousel() {
  const slides = [
    {
      src: "/images/banner1.jpg",
      title: "Ghari Point",
      description: "Deals You'll Love, Quality You Deserve.",
    },
    {
      src: "/images/banner2.jpg",
      title: "New Arrivals",
      description: "Check out the latest trends now.",
    },
    {
      src: "/images/banner3.jpg",
      title: "Shop Now",
      description: "Best deals are waiting for you.",
    },
  ];

  const [index, setIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
          <h1 className={`
          text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg animate-fadeSlide
          ${darkMode
            ? "bg-gradient-to-r from-white via-gray-300 to-gray-100"
            : "bg-gradient-to-r from-black via-gray-800 to-gray-700"}
          text-transparent bg-clip-text
        `}>
          Welcome to Ghari Point
        </h1>
  );
}












