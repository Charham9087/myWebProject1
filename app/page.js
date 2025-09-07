import Image from "next/image";
import Carousel from "@/components/FrontendComponents/HomePageComponents/carousel/page";
import ProductsGridPage from "@/components/FrontendComponents/HomePageComponents/products/page";
import MostSellingPage from "@/components/FrontendComponents/HomePageComponents/most selling/page";

export default function Home() {
  return (
    <>
    <Carousel />
    <MostSellingPage />
    <ProductsGridPage />
    {/* <CategoryFilter /> */}
    </>
  );
}
