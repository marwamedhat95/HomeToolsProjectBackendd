import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllFriday.css"; // استيراد ملف CSS

export default function AllFriday() {
  const [fridayOffers, setFridayOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/products");
        const products = Array.isArray(res.data) ? res.data : [];
        // تصفية المنتجات التي تحمل علامة fridayOffer
        setFridayOffers(products.filter(p => p.fridayOffer));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="all-friday-page">
      <h2 className="friday-offers-title">عروض يوم الجمعة 💰</h2>
      
      <div className="friday-products-grid">
        {fridayOffers.length === 0 ? (
            <p className="no-offers-message">لا توجد عروض حالياً.</p>
        ) : (
          fridayOffers.map(p => (
            <div
              key={p._id}
              className="friday-product-card"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {p.images?.[0] && (
                <img
                  src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${p.images[0]}`}
                  alt={p.name}
                  className="friday-product-image"
                />
              )}
              <div className="friday-product-info">
                <h3 className="friday-product-name">{p.name}</h3>
                <p className="friday-product-price">
                  <span>السعر:</span> {p.price} جنيه
                </p>
                <p className="friday-product-meta">
                  <span>الكمية:</span> {p.quantity}
                </p>
                <p className="friday-product-meta">
                  <span>اللون:</span> {p.color || 'N/A'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}