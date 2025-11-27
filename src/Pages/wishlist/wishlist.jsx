import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);
    }, []);

    // 🔥 دالة حذف منتج معين
    const removeFromWishlist = (id, e) => {
        e.stopPropagation(); // يمنع فتح صفحة التفاصيل

        const updatedList = wishlist.filter(item => item._id !== id);

        setWishlist(updatedList);
        localStorage.setItem("wishlist", JSON.stringify(updatedList));

        // 🔥 عشان Navbar تحدث العداد تلقائي
        window.dispatchEvent(new Event("wishlistUpdated"));
    };

    return (
        <div className="wishlist-page">
            <h2 className="wishlist-title">قائمة المفضلة ❤️</h2>

            {wishlist.length === 0 && (
                <div className="no-items-message">
                    <p>لا توجد منتجات في المفضلة حالياً. ابدأ بالتسوق!</p>
                    <button
                        className="shop-now-button"
                        onClick={() => navigate('/')}
                    >
                        العودة للتسوق
                    </button>
                </div>
            )}

            <div className="wishlist-grid">
                {wishlist.map(item => (
                    <div
                        key={item._id}
                        className="wishlist-card"
                        onClick={() => navigate(`/product/${item._id}`)}
                    >
                        <img
                            src={`http://localhost:5000/uploads/${item.images?.[0]}`}
                            alt={item.name}
                            className="wishlist-image"
                        />

                        <div className="wishlist-info">
                            <h3 className="wishlist-item-name">{item.name}</h3>
                            <p className="wishlist-item-price">السعر: {item.price} جنيه</p>

                            {/* 🔥 زرار الحذف */}
                            <button
                                className="remove-btn"
                                onClick={(e) => removeFromWishlist(item._id, e)}
                            >
                                حذف من المفضلة ✖
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
