"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "Luxury Timepieces",
    subtitle: "Swiss Craftsmanship Excellence",
    description: "Discover our collection of premium Swiss watches, crafted with precision and elegance",
    image: "/luxury-watch-collection.jpg",

    featured: true,
    brand: "Swiss Heritage",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Watch Collections",
    description: "Be among the first to own our newest timepiece masterpieces",
    image: "/modern-watch-display.jpg",

    badge: "NEW",
    brand: "Contemporary Series",
  },
  {
    id: 4,
    title: "Master Collection",
    subtitle: "Horological Excellence",
    description: "Award-winning designs that represent the pinnacle of watchmaking artistry",
    image: "/master-collection-watches.jpg",

    rating: 4.9,
    brand: "Master Series",
  },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div
      className="relative w-full h-[500px] md:h-[700px] overflow-hidden rounded-lg bg-gradient-to-br from-background to-muted"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
              }`}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image || "/placeholder.svg?height=700&width=1200&query=luxury watch on elegant background"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
            </div>

            <div className="relative z-10 flex items-center h-full">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl text-white bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  {slide.badge && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4 shadow-lg">
                      <Award className="w-4 h-4 mr-2" />
                      {slide.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="text-accent font-medium text-lg">{slide.brand}</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance leading-tight text-white drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white/95 drop-shadow-md">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-6 text-white/90 text-pretty leading-relaxed drop-shadow-sm">
                    {slide.description}
                  </p>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-primary scale-125 shadow-lg" : "bg-white/50 hover:bg-white/70"
                }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-20 bg-black/20 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}
