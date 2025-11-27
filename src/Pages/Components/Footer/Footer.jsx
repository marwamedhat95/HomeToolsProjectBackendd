import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 mt-16">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">بيت الفريده</h3>
          <p className="text-sm leading-6">
            متجر متخصص في المنتجات المنزلية والمفروشات بجودة عالية وأسعار مناسبة.
            هدفنا تقديم أفضل تجربة تسوق لكِ من بيتك بكل سهولة.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 text-right">روابط سريعة</h3>
          <ul className="space-y-2 text-right">
            <li>
              <Link
                to="/"
                className="hover:text-[#C2A878] cursor-pointer transition"
              >
                الرئيسية
              </Link>
            </li>

            <li>
              <Link
                to="/Videos"
                className="hover:text-[#C2A878] cursor-pointer transition"
              >
                الفيديوهات
              </Link>
            </li>

            <li>
              <Link
                to="/AllNew"
                className="hover:text-[#C2A878] cursor-pointer transition"
              >
                أحدث المنتجات
              </Link>
            </li>

            <li>
              <Link
                to="/AllFriday"
                className="hover:text-[#C2A878] cursor-pointer transition"
              >
                عروض الجمعة
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 text-right">تواصل معنا</h3>
          <ul className="space-y-2 text-right">
            <li>📞 01010755955</li>
            <li>📍 جاليري بيت الفريده – مكرم عبيد – أمام السراج مول – مدينة نصر</li>
            <li>  📍 جاليري بيت الفريده فرع سموحة: “سـموحة – بلوك 5 – طريق 14 مايو – مول جرين ستريب”</li>
            <li>📍 جاليري بيت الفريده – فرع سيدي جابر: عنوان مذكور في BizMiEast</li>
            <li>⏰ 10 صباحًا – 10 مساءً</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">تابعينا</h3>
          <div className="flex gap-4 text-2xl">

            <a
              href="https://www.facebook.com/baytalfarida"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C2A878] transition"
            >
              <FaFacebook />
            </a>

            <a
              href="https://www.instagram.com/baytalfarida"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C2A878] transition"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/@baytalfarida"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C2A878] transition"
            >
              <FaTiktok />
            </a>

          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-10 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} جميع الحقوق محفوظة لـ بيت الفريده
      </div>
    </footer>
  );
}