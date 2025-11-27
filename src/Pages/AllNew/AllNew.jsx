import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllNew.css"; // استيراد ملف CSS

export default function AllNew() {
  const [homeProducts, setHomeProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const products = Array.isArray(res.data) ? res.data : [];
        // تصفية المنتجات التي تحمل علامة homeProduct
        setHomeProducts(products.filter(p => p.homeProduct));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="all-new-page">
      <h2 className="all-new-title">كل منتجات جاليري بيت الفريده</h2>
      
      <div className="products-grid-new">
        {homeProducts.map(p => (
          <div
            key={p._id}
            className="product-card-new"
            onClick={() => navigate(`/product/${p._id}`)}
          >
            {p.images?.[0] && (
              <img
                src={`http://localhost:5000/uploads/${p.images[0]}`}
                alt={p.name}
                className="product-image-new"
              />
            )}
            <div className="product-info-new">
              <h3 className="product-name-new">{p.name}</h3>
              <p className="product-price-new">
                <span>السعر:</span> {p.price} جنيه
              </p>
              <p className="product-meta-new">
                <span>الكمية:</span> {p.quantity}
              </p>
              <p className="product-meta-new">
                <span>اللون:</span> {p.color || 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}