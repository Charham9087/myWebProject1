"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession(); // <-- get user session

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  return (
    <nav className="bg-gray-950 sticky top-0 z-50 text-white px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-semibold">
          A Store
        </Link>

        {/* Hamburger button (only visible on small screens) */}
        <button
          className="md:hidden text-xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cart"><FaShoppingCart /></Link>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/catalogue">Catalogues</Link>
          <Link href="/admin">Admin</Link>

          {status === "authenticated" ? (
            <Link href="/account" className="flex items-center gap-1">
              <FaUser /> Account
            </Link>
          ) : (
            <>
              <Link href="/login">Login</Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div
          className={`flex flex-col md:hidden overflow-hidden transition-[max-height] duration-300 ${
            menuOpen ? 'max-h-96 mt-2' : 'max-h-0'
          }`}
        >
          <Link href="/cart" className="flex items-center gap-2 py-2 border-b border-gray-800">
            <FaShoppingCart /> Cart
          </Link>
          <Link href="/" className="py-2 border-b border-gray-800">Home</Link>
          <Link href="/admin" className="py-2 border-b border-gray-800">Admin</Link>
          <Link href="/about" className="py-2 border-b border-gray-800">About</Link>
          <Link href="/contact" className="py-2 border-b border-gray-800">Contact</Link>
          <Link href="/catalogue" className="py-2 border-b border-gray-800">Catalogues</Link>

          {status === "authenticated" ? (
            <Link href="/account" className="flex items-center gap-2 py-2 border-b border-gray-800">
              <FaUser /> Account
            </Link>
          ) : (
            <>
              <Link href="/login" className="py-2 border-b border-gray-800">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
