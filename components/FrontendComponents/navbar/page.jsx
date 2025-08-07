"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const { data: session, status } = useSession();

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
      if (showPopup) setShowPopup(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen, showPopup]);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-950 sticky top-0 z-50 text-white px-4 py-3">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">A Store</Link>

        <button
          className="md:hidden text-xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="hidden md:flex items-center gap-4 relative">
          <Link href="/cart"><FaShoppingCart /></Link>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/catalogue">Catalogues</Link>
       

          {status === "authenticated" ? (
            <>
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="flex items-center gap-1 focus:outline-none"
              >
                <FaUser /> Account
              </button>

              {/* Popup Box */}
              {showPopup && (
                <div
                  ref={popupRef}
                  className="absolute top-12 right-0 bg-white text-black rounded shadow-lg w-64 z-50 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{session.user.name}</p>
                      <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/login">Login</Link>
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
      
          <Link href="/about" className="py-2 border-b border-gray-800">About</Link>
          <Link href="/contact" className="py-2 border-b border-gray-800">Contact</Link>
          <Link href="/catalogue" className="py-2 border-b border-gray-800">Catalogues</Link>

          {status === "authenticated" ? (
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="py-2 border-b border-gray-800 flex items-center gap-2"
            >
              <FaUser /> Account
            </button>
          ) : (
            <Link href="/login" className="py-2 border-b border-gray-800">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
