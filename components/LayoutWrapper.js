"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/FrontendComponents/header/page";
import Navbar from "@/components/FrontendComponents/navbar/page";
import Footer from "@/components/FrontendComponents/footer/page";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
