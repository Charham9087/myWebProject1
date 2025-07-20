"use client";
import { useState, useEffect } from "react";

export default function Carousel() {
  const slides = [
    {
      src: "/images/banner1.jpg",
      title: "A Store",
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
    <>
      <div className="relative w-full max-w-5xl mx-auto mt-6 overflow-hidden rounded-lg shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full flex-shrink-0">
              <img
                src={slide.src}
                alt={`Slide ${i}`}
                className="w-full h-40 md:h-52 object-cover"
              />
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center bg-black/50 px-4 py-2 rounded">
                <h1 className="text-lg md:text-2xl font-semibold text-white">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-base text-gray-200">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white text-2xl px-3 py-1 rounded-full"
        >
          ❮
        </button>
        <button
          onClick={() => setIndex((index + 1) % slides.length)}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white text-2xl px-3 py-1 rounded-full"
        >
          ❯
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${index === i ? "bg-white" : "bg-gray-400"
                }`}
            />
          ))}
        </div>

      </div>
          <br/>
          <h3 className="text-center text-3xl font-bold text-gray-600">A Store</h3>
      <br />

      <p className="text-center text-gray-600 text-xs md:text-sm ">Deals You'll Love, Quality You Deserve.</p>
      <br />
      <hr />
          <br />






          

    </>
  );
}












