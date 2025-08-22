import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-8 pb-4 mt-5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand Info */}
        <div>
          <h5 className="text-lg font-semibold text-white">CH Store</h5>
          <p className="mt-2">Affordable Tech Accessories</p>
          <p>Deals You'll Love, Quality You Deserve.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className="text-md font-semibold text-white mb-2">Quick Links</h6>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </li>
            <li>
              <Link href="/catalogue" className="hover:text-white transition-colors">Catalogs</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h6 className="text-md font-semibold text-white mb-2">Contact Us</h6>
          <p>
            Email:
            <a href="mailto:astore3609@gmail.com" className="hover:text-white underline ml-1">
              chstore3609@gmail.com
            </a>
          </p>
          <p>
            Phone:
            <a href="tel:+923304462277" className="hover:text-white underline ml-1">
              +92 330-4462277
            </a>
          </p>

          <div className="flex gap-4 mt-3 text-xl">
            <a href="#" className="hover:text-white transition-colors"><FaFacebook /></a>
            <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
            <a href="https://wa.me/923304462277" className="hover:text-white transition-colors"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 my-4" />
      <p className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CH Store. All rights reserved.
      </p>
    </footer>
  );
}
