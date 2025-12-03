import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import Hero from '../Components/Hero/Hero';
import { useNavigate } from "react-router-dom";
import { FaBath } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { FaPuzzlePiece } from "react-icons/fa";
import Imgprice from '../../assets/img/licensed-image.jpg'
// استيراد الأيقونات
import { IoDiamondOutline, IoShirtOutline, IoBedOutline, IoColorPaletteOutline, IoWatchOutline, IoHomeOutline, IoHelpCircleOutline } from 'react-icons/io5';
import './Home.css'

// دالة مساعدة لاختيار الأيقونة بناءً على اسم القسم (يمكنك تعديلها حسب الأقسام الحقيقية لديك)
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('مطبخ') || name.includes('مطبخ')) {
    return <GiKnifeFork className="w-8 h-8 mx-auto mb-2 text-[#C2A878]" />;
  }
  if (name.includes('سرير') || name.includes('مفروشات')) {
    return <IoBedOutline className="w-8 h-8 mx-auto mb-2 text-[#C2A878]" />;
  }
  if (name.includes(' ألعاب أطفال') || name.includes('ألعاب أطفال')) {
    return <FaPuzzlePiece className="w-8 h-8 mx-auto mb-2 text-[#C2A878]" />;
  }
  if (name.includes('حمام')) {
    return <FaBath className="w-8 h-8 mx-auto mb-2 text-[#C2A878]" />;
  }
  // أيقونة افتراضية
  return <IoHelpCircleOutline className="w-8 h-8 mx-auto mb-2 text-gray-500" />;
};


export default function Home() {
  const [homeProducts, setHomeProducts] = useState([]);
  const [fridayOffers, setFridayOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/products");
        const catRes = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/categories");

        setHomeProducts(prodRes.data.filter(p => p.homeProduct));
        setFridayOffers(prodRes.data.filter(p => p.fridayOffer));
        setCategories(catRes.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const productSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    rtl: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero className="hero" />

      {/* ---------- CATEGORIES ---------- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 my-8 text-right border-r-4 border-[#C2A878] pr-3">
          تسوق حسب الأقسام
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {categories.map(cat => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              // تنسيق كتلة القسم باللون المميز
              className="bg-white cursor-pointer border-2 border-transparent rounded-xl p-4 text-center shadow-sm hover:border-[#C2A878] transition-all duration-300 transform hover:scale-105"
            >
              {/* هنا تمت إضافة الأيقونة: 
                  - يتم استدعاء الدالة getCategoryIcon وتمرير اسم القسم لها.
                */}
              {getCategoryIcon(cat.name)}
              <p className="font-semibold text-lg text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>


      {/* ---------- PRICE FILTER ---------- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 my-8 text-right border-r-4 border-[#C2A878] pr-3">
          تسوق حسب السعر
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          {[
            { price: 100, img: Imgprice },
            { price: 200, img: Imgprice},
            { price: 500, img: Imgprice},
            { price: 1000, img: Imgprice },
            { price: 2000, img: Imgprice },
            { price: 3000, img: Imgprice },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => window.location.href = `/price/${item.price}`}
              // تنسيق كتلة السعر
              className="relative cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={item.img}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-100 group-hover:bg-black/70 transition">
                <p className="text-white font-bold text-base md:text-lg">اقل من {item.price} ج.م</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- HOME PRODUCTS ---------- */}
        <div className="btn-flex">
        <h2 className="text-3xl font-extrabold text-gray-800 my-8 text-right border-r-4 border-[#C2A878] pr-3">
          احدث المنتجات جاليري بيت الفريده
        </h2>

        <div className="text-center mt-4 mb-8">
          <button
            // تصميم الزر باللون المميز
            className="bg-[#C2A878] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a5916f] transition shadow-md"
            onClick={() => navigate(`/AllNew`)}
          >
            عرض جميع احدث المنتجات
          </button>
        </div>
          </div>
        <Slider {...productSliderSettings}>
          {homeProducts.map(p => (
            <div key={p._id} className="p-2">
              <div
                // تنسيق بطاقة المنتج
                className="bg-white border-2 border-transparent p-4 rounded-xl shadow hover:shadow-lg hover:border-[#C2A878] transition cursor-pointer h-full flex flex-col justify-between"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${p.images?.[0]}`}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />

                <h3 className="font-bold text-xl text-gray-900 mt-2 truncate">{p.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xl font-extrabold text-[#C2A878]">{p.price} جنيه</p>
                  {/* أيقونة سلة */}
                  <button className="bg-[#C2A878] text-white p-2 rounded-full hover:bg-[#a5916f] transition">
                    <svg xmlns="https://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1a2 2 0 012 2v2a2 2 0 01-2 2H3a1 1 0 000 2h12a1 1 0 000-2h-1a2 2 0 01-2-2V5a2 2 0 012-2h1a1 1 0 100-2H3zM5 13a1 1 0 100 2h10a1 1 0 100-2H5z" /></svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">الكمية: {p.quantity}</p>
                <p className="text-sm text-gray-500">اللون: {p.color}</p>
              </div>
            </div>
          ))}
        </Slider>

        {/* ---------- FRIDAY OFFERS ---------- */}
        <div className="btn-flex">
          <h2 className="text-3xl font-extrabold text-gray-800 my-8 text-right border-r-4 border-[#E53E3E] pr-3">
          عروض يوم الجمعة 🔥
        </h2>

        <div className="text-center mt-4 mb-8">
          <button
            // تصميم زر العروض باللون الأحمر
            className="bg-[#E53E3E] text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition shadow-md"
            onClick={() => navigate(`/AllFriday`)}
          >
            عرض جميع يوم الجمعة
          </button>
        </div>
        </div>

        <Slider {...productSliderSettings}>
          {fridayOffers.map(p => (
            <div key={p._id} className="p-2">
              <div
                // تمييز بطاقة العرض بحدود حمراء
                className="bg-white border-2 border-[#E53E3E] p-4 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer relative h-full flex flex-col justify-between"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {/* شارة العرض */}
                <span className="absolute top-0 left-0 bg-[#E53E3E] text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
                  خصم!
                </span>
                <img
                  src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${p.images?.[0]}`}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />

                <h3 className="font-bold text-xl text-gray-900 mt-2 truncate">{p.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  {/* افتراض عرض السعر الأصلي مشطوبًا */}
                  <p className="text-sm line-through text-gray-500">
                    {p.price > 10 ? Math.round(p.price * 1.3) : p.price} جنيه
                  </p>
                  <p className="text-2xl font-extrabold text-[#E53E3E]">{p.price} جنيه</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">الكمية: {p.quantity}</p>
                <p className="text-sm text-gray-500">اللون: {p.color}</p>
              </div>
            </div>
          ))}
        </Slider>

      </div>
    </div>
  );
}