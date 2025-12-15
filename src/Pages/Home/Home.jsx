import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import Hero from '../Components/Hero/Hero';
import { useNavigate } from "react-router-dom";
import { FaBath } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { FaPuzzlePiece } from "react-icons/fa";
import Imgprice from '../../assets/img/licensed-image.jpg';
import Bedroom from '../../assets/img/bedroom.png'
import Kitchen from '../../assets/img/kitchen.png'
import Bath from '../../assets/img/bath.png'
import Kids from '../../assets/img/kids.png'
// استيراد الأيقونات
import { IoDiamondOutline, IoShirtOutline, IoBedOutline, IoColorPaletteOutline, IoWatchOutline, IoHomeOutline, IoHelpCircleOutline } from 'react-icons/io5';
import './Home.css'

// دالة مساعدة لاختيار الأيقونة بناءً على اسم القسم
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  // إضافة الفئة الجديدة category-icon-default لتطبيق لون الكحلي/الروز جولد من CSS
  if (name.includes('مطبخ')) {
    return <GiKnifeFork className="w-8 h-8 mx-auto mb-2 category-icon-default" />;
  }
  if (name.includes('سرير') || name.includes('مفروشات')) {
    return <IoBedOutline className="w-8 h-8 mx-auto mb-2 category-icon-default" />;
  }
  if (name.includes('ألعاب أطفال')) {
    return <FaPuzzlePiece className="w-8 h-8 mx-auto mb-2 category-icon-default" />;
  }
  if (name.includes('حمام')) {
    return <FaBath className="w-8 h-8 mx-auto mb-2 category-icon-default" />;
  }
  // أيقونة افتراضية
  return <IoHelpCircleOutline className="w-8 h-8 mx-auto mb-2 category-icon-default" />;
};

// دالة اختيار صورة لكل قسم بناءً على الاسم
const getCategoryImage = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('مطبخ')) return Kitchen;
  if (name.includes('سرير') || name.includes('مفروشات')) return Bedroom;
  if (name.includes('ألعاب أطفال')) return Kids;
  if (name.includes('حمام')) return Bath;
  return '/images/default.jpg'; // صورة افتراضية
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
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="home-page-container min-h-screen">
      <div className="banner-container">
        <Hero className="hero" />
        <div className="blue-overlay"></div>
      </div>
     
     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <h2 className="text-3xl sm:text-4xl font-extrabold my-8 text-right pr-3 home-header">
    تسوق حسب الأقسام
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-12">
    {categories.map(cat => (
      <div
        key={cat._id}
        onClick={() => navigate(`/category/${cat._id}`)}
        className="bg-white cursor-pointer border-2 border-transparent rounded-xl p-3 sm:p-4 text-center shadow-sm category-card transition-all duration-300 transform hover:scale-105"
      >
        <div className="relative">
          <img
            src={getCategoryImage(cat.name)}
            alt={cat.name}
            className="w-full h-32 sm:h-36 md:h-40 lg:h-48 object-cover rounded-xl mb-2"
          />
          <div className="
            absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 sm:p-4 shadow-md border-2 bordercat
          ">
            {getCategoryIcon(cat.name)}
          </div>
        </div>
        <p className="font-semibold text-base sm:text-lg md:text-xl text-gray-800">{cat.name}</p>
      </div>
    ))}
  </div>
</div>


<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* عنوان القسم */}
  <h2 className="text-3xl sm:text-4xl font-extrabold my-8 text-center home-header">
      تسوق حسب السعر
  </h2>
  
  {/* شبكة البطاقات */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12 justify-center">
      {[
          { price: 100, label: "أقل من 100 جنيه" },
          { price: 200, label: "أقل من 200 جنيه" },
          { price: 500, label: "أقل من 500 جنيه" },
          { price: 1000, label: "أقل من 1000 جنيه"},
          { price: 2000, label: "أقل من 2000 جنيه" },
          { price: 3000, label: "أقل من 3000 جنيه" },
      ].map((item, i) => (
          <div
              key={i}
              onClick={() => window.location.href = `/price/${item.price}`}
              className="
                  relative 
                  cursor-pointer 
                  bg-white 
                  rounded-xl 
                  shadow-xl 
                  hover:shadow-2xl 
                  transition-all 
                  duration-300
                  hover:scale-[1.03]  
                  p-4 sm:p-6 
                  flex 
                  flex-col 
                  items-center 
                  justify-center 
                  min-h-[180px] sm:min-h-[200px] md:min-h-[220px]
              "
          >
              {/* النص العلوي */}
              <div className={`
                  text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-center tracking-wide textPrice
                  ${i === 0 ? 'text-red-600' : 'text-gray-800'}
              `}>
                  {item.label} 
              </div>

              {/* زر SHOP NOW */}
              <button 
                  className="
                      bg-[#1a2a44] 
                      text-white 
                      font-bold 
                      py-2 px-4 sm:py-2 sm:px-6 
                      rounded 
                      uppercase 
                      text-sm sm:text-base 
                      tracking-wider 
                      hover:bg-[#34495e] 
                      transition-colors
                      btnPrice
                  "
              >
                  SHOP NOW
              </button>
          </div>
      ))}
  </div>
</div>


    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="btn-flex">
        <h2 className="text-3xl font-extrabold my-8 text-right pr-3 home-header">
            احدث المنتجات جاليري بيت الفريده
        </h2>
        <div className="text-center mb-8">
            <button
                className="all-products-btn text-white px-8 py-3 rounded-full font-semibold transition shadow-md"
                onClick={() => navigate(`/AllNew`)}
            >
                عرض جميع احدث المنتجات
            </button>
        </div>
    </div>
    
    <Slider {...productSliderSettings}>
        {homeProducts.map((p, index) => (
            <div key={p._id} className="p-2">
                <div
                    // البطاقة الرئيسية: خلفية بيضاء، حواف مستديرة، ظل خفيف، وتأثير بسيط عند التمرير.
                    className="
                        relative 
                        bg-white 
                        border border-gray-100 
                        p-0 
                        rounded-xl 
                        shadow-md 
                        hover:shadow-lg 
                        product-card 
                        transition 
                        cursor-pointer 
                        h-full 
                        flex 
                        flex-col 
                        overflow-hidden
                    "
                    onClick={() => navigate(`/product/${p._id}`)}
                >
                    {/* شريط SALE الأحمر القطري - يضاف فقط للبطاقة الأولى كمثال */}
                    {index === 0 && (
                        <div className="absolute top-2 left-[-30px] w-[100px] sale text-white text-center py-1 text-xs font-bold transform rotate-[-45deg] z-10">
                            خصم
                        </div>
                    )}

                    {/* حاوية الصورة: خلفية رمادية فاتحة */}
                    <div className="bg-gray-50 p-4 rounded-t-xl ">
                        <img src={p.images?.[0]}  alt={p.name} className="w-full object-contain rounded-lg" />
                    </div>

                    {/* محتوى البطاقة (العنوان، السعر، الزر) */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                        {/* اسم المنتج */}
                        <h3 className="font-semibold text-base text-gray-800 mb-1 truncate">
                            {p.name || "اسم المنتج الافتراضي"}
                        </h3>
                        
                        {/* السعر الحالي (الأكبر) */}
                        <p className="text-2xl font-bold text-gray-900 mt-1 textSlid1">
                            {/* استخدم افتراضات للسعر إذا لم يكن متاحًا */}
                            {p.currentPrice || "19,900"} جنيه
                        </p>

                        {/* السعر القديم المشطوب */}
                        <div className="text-sm text-gray-500 mb-4">
                            <span className="line-through">
                                {/* استخدام افتراضات للسعر المشطوب */}
                                {p.oldPrice || "21,190"} جنيه 
                            </span>
                        </div>

                        {/* زر ADD TO CART */}
                        <button
                            // يتم تغيير شكل الزر ليتناسب مع الصورة المرفقة
                            className="
                                w-full 
                                border border-gray-300 
                                text-gray-800 
                                font-semibold 
                                py-2 
                                rounded-lg 
                                hover:bg-gray-100 
                                transition
                                uppercase
                                btnSli1
                            "
                            // يحافظ على وظيفة الزر القديمة، ولكن نستخدم زرًا عاديًا الآن
                            onClick={(e) => { e.stopPropagation(); /* وظيفة إضافة للعربة */ }}
                        >
                            ADD TO CART
                        </button>

                        {/* تم حذف معلومات الكمية واللون غير الظاهرة في التصميم المطلوب */}
                    </div>
                </div>
            </div>
        ))}
    </Slider>
</div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="btn-flex">
        <h2 className="text-3xl font-extrabold text-gray-800 my-8 text-right pr-3 home-header">
            عروض يوم الجمعة 🔥
        </h2>
        <div className="text-center  mb-8">
            <button
                className=" all-products-btns bg-[#E53E3E] text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition shadow-md friday-offer-btn"
                onClick={() => navigate(`/AllFriday`)}
            >
                عرض جميع يوم الجمعة
            </button>
        </div>
    </div>
    
    <Slider {...productSliderSettings}>
        {fridayOffers.map((p, index) => (
            <div key={p._id} className="p-2">
                <div
                    // البطاقة الرئيسية: خلفية بيضاء، ظل خفيف، وتأثير بسيط عند التمرير.
                    className="
                        relative 
                        bg-white 
                        border border-gray-100 
                        p-0 
                        rounded-xl 
                        shadow-md 
                        hover:shadow-lg 
                        product-card 
                        transition 
                        cursor-pointer 
                        h-full 
                        flex 
                        flex-col 
                        overflow-hidden
                    "
                    onClick={() => navigate(`/product/${p._id}`)}
                >
                    {/* شريط العرض القطري في الزاوية العلوية اليمنى */}
                    <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 z-10">
                       <span className="absolute top-0 left-0 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 offer-badge">
                        خصم!
                      </span>
                    </div>

                    {/* حاوية الصورة: خلفية رمادية فاتحة */}
                    <div className="bg-gray-50 p-4 rounded-t-xl flex items-center justify-center">
                        <img 
                            src={p.images?.[0]}
                            alt={p.name} 
                            className="product-thumb"
                            />

                    </div>

                    {/* محتوى البطاقة (العنوان، السعر، الزر) */}
                    <div className="p-4 pt-3 flex flex-col justify-between flex-grow">
                        {/* اسم المنتج */}
                        <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate text-right">
                            {p.name || "اسم المنتج الافتراضي"}
                        </h3>
                        
                        {/* السعر القديم (المشطوب) والسعر الجديد */}
                        <div className="flex flex-col text-right mb-4">
                            {/* السعر القديم المشطوب */}
                            <p className="text-sm line-through text-gray-500 mb-1">
                                {p.price > 10 ? Math.round(p.price * 1.3) : p.price} جنيه
                            </p>
                            
                            {/* السعر الجديد (الأكبر) */}
                            <div className="flex justify-end items-end space-x-1">
                                {/* النص الصغير (جنيه) */}
                                <p className="text-base font-medium text-gray-600">جنيه</p>
                                {/* السعر النهائي الكبير */}
                                <p className="text-2xl font-extrabold offer-price-final text-gray-900">
                                    {p.price || "19,900"}
                                </p>
                            </div>
                        </div>

                        {/* زر ADD TO CART */}
                        <button
                            // يتم تغيير شكل الزر ليتناسب مع الصورة المرفقة (زر بإطار)
                            className="
                                w-full 
                                border border-gray-400 
                                text-gray-700 
                                font-semibold 
                                py-3
                                rounded-lg 
                                hover:bg-gray-50 
                                transition
                                uppercase
                                text-sm
                                btnSli1
                            "
                            onClick={(e) => { e.stopPropagation(); /* وظيفة إضافة للعربة */ }}
                        >
                            ADD TO CART
                        </button>

                        {/* تم حذف معلومات الكمية واللون غير الظاهرة في التصميم المطلوب */}
                    </div>
                </div>
            </div>
        ))}
    </Slider>
</div>
    </div>
  );
}
