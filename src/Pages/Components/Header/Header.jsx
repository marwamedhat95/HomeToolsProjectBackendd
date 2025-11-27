// src/Components/UserNavbar/UserNavbar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import "./Header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const primaryColor = "#C2A878";
  const hoverColor = "#a5916f";

  // 🔥 قراءة عدد المفضلة من localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(wishlist.length);

    // متابعة التغيير لو صفحات تانية عدلت عليه
    window.addEventListener("wishlistUpdated", () => {
      const updated = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(updated.length);
    });

    return () => window.removeEventListener("wishlistUpdated", () => {});
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold text-gray-800" style={{ color: primaryColor }}>
            جاليري بيت الفريدة
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 space-x-reverse text-lg font-medium">
            <Link to="/" className="text-gray-700 hover:text-[#C2A878] transition duration-300">الرئيسية</Link>
            <Link to="/products" className="text-gray-700 hover:text-[#C2A878] transition duration-300">المنتجات</Link>
            <Link to="/videos" className="text-gray-700 hover:text-[#C2A878] transition duration-300">الفيديوهات</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#C2A878] transition duration-300">تواصل معنا</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 space-x-reverse text-xl">

            {/* ❤️ Wishlist With Badge */}
            <div className="relative">
              <Link
                to="/wishlist"
                className="p-2 rounded-full hover:bg-gray-100 transition"
                style={{ color: primaryColor }}
              >
                <FaHeart />
              </Link>

              {wishlistCount > 0 && (
                <span className="absolute heaartWish -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>

          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-[#C2A878]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-right">
          <Link to="/" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50 hover:text-[#C2A878]">الرئيسية</Link>
          <Link to="/products" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50 hover:text-[#C2A878]">المنتجات</Link>
          <Link to="/videos" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50 hover:text-[#C2A878]">الفيديوهات</Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50 hover:text-[#C2A878]">تواصل معنا</Link>
        </div>
      </div>
    </nav>
  );
}
