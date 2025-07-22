import Image from "next/image";
import Carousel from "@/components/FrontendComponents/HomePageComponents/carousel/page";
import CategoryFilter from "@/components/FrontendComponents/HomePageComponents/dropdown/page";
import ProductsGridPage from "@/components/FrontendComponents/HomePageComponents/products/page";


export default function Home() {
  return (
    <>
    <Carousel />
    <ProductsGridPage />
    {/* <CategoryFilter /> */}
    </>
  );
}
