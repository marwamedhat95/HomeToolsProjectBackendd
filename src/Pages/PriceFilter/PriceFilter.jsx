import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./PriceFilter.css"; // استيراد ملف CSS

export default function PriceFilter() {
const { value } = useParams();
const navigate = useNavigate();
const [products, setProducts] = useState([]);

useEffect(() => {
  axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/products")
    .then(res => {
      const allProducts = Array.isArray(res.data) ? res.data : [];
      // تصفية المنتجات التي سعرها أقل من أو يساوي القيمة الممررة
      const filtered = allProducts.filter(p => p.price <= Number(value));
      setProducts(filtered);
    })
    .catch(err => console.log(err));
}, [value]);


return ( 
    <div className="price-filter-page"> 
        <h2 className="price-filter-title">
            منتجات أقل من <span className="price-value">{value}</span> جنيه
        </h2>

        <div className="products-grid-filter">
            {products.length === 0 ? (
                <p className="no-products-message">
                    عفواً، لا توجد منتجات أقل من {value} جنيه حالياً.
                </p>
            ) : (
                products.map(p => (
                    <div 
                        key={p._id} 
                        className="product-card-filter"
                        onClick={() => navigate(`/product/${p._id}`)}
                    >
                        <img
                            src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${p.images?.[0]}`}
                            className="product-image-filter"
                            alt={p.name}
                        />
                        <div className="product-info-filter">
                            <h3 className="product-name-filter">{p.name}</h3>
                            <p className="product-price-filter">
                                السعر: 
                                <span className="actual-price">{p.price} جنيه</span>
                            </p>
                        </div>
                    </div>
                  ))
            )}
        </div>
    </div>
);
}