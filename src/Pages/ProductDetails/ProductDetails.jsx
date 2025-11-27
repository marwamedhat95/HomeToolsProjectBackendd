import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetails.css"; 
import { useNavigate } from "react-router-dom";

export default function ProductDetails() {
const { id } = useParams();
const [product, setProduct] = useState(null);
const [nav1, setNav1] = useState(null);
const [nav2, setNav2] = useState(null);
const navigate = useNavigate();
useEffect(() => {
fetchProduct();
}, []);

const fetchProduct = async () => {
try {
const res = await axios.get(`http://localhost:5000/api/products/${id}`);
setProduct(res.data);
} catch (error) {
console.log(error);
}
};

if (!product) return <p className="loading-text">جاري التحميل...</p>;

const mainSettings = {
asNavFor: nav2,
ref: slider => setNav1(slider),
arrows: true,
dots: false,
};

const thumbSettings = {
asNavFor: nav1,
ref: slider => setNav2(slider),
slidesToShow: Math.min(product.images.length, 4),
swipeToSlide: true,
focusOnSelect: true,
arrows: false,
};
const addToWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // لو المنتج مش موجود قبل كده
  if (!wishlist.some(item => item._id === product._id)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  // 🔥 تحديث العداد في الـ Navbar مباشرة
  window.dispatchEvent(new Event("wishlistUpdated"));
};

return ( 
    <div className="product-details-page"> {/* تم تغيير الكلاس ليعكس اسم المكون */}
        <div className="details-container">
            
            <h2 className="details-title">تفاصيل المنتج</h2>

            <div className="product-wrapper">
                
                {/* LEFT: Images and Sliders */}
                <div className="product-gallery">
                    <Slider {...mainSettings} className="main-slider">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={`http://localhost:5000/uploads/${img}`}
                                alt={product.name}
                                className="main-image"
                            />
                        ))}
                    </Slider>

                    <Slider {...thumbSettings} className="thumb-slider">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={`http://localhost:5000/uploads/${img}`}
                                alt={product.name}
                                className="thumb-image"
                            />
                        ))}
                    </Slider>
                </div>

                {/* RIGHT: Info and Purchase */}
                <div className="product-info-panel">
                    <h1 className="product-name">{product.name}</h1>
                    
                    <div className="product-price">{product.price} جنيه</div>

                    <div className="product-meta">
                        <p>
                            <span className="meta-label">القسم: </span>
                            {/* افتراض أن لديك اسم القسم متاح هنا، يمكنك تعديل جلب البيانات إذا لزم الأمر */}
                            {product.category?.name || "غير مصنف"} 
                        </p>
                        <p>
                            <span className="meta-label">العدد المتوفر: </span>
                            {product.quantity}
                        </p>
                        <p>
                            <span className="meta-label">اللون: </span>
                            {product.color?.[0] || "N/A"}
                        </p>
                    </div>

                    <div className="description-section">
                        <h3 className="section-title">وصف المنتج</h3>
                        <div className="description-text">
                            {product.description || "لا يوجد وصف متوفر."}
                        </div>
                    </div>
                    
                    {/* زر الإضافة للسلة */}
                    <button className="add-to-cart-btn" onClick={addToWishlist}>
                        إضافة إلى المفضلة
                        </button>
                </div>
            </div>
        </div>
    </div>
);
}