import { useState, useEffect } from "react";
import axios from "axios";
import './Products.css';
import { useNavigate } from "react-router-dom";

export default function Products() {
    const navigate = useNavigate(); 
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const prodRes = await axios.get("http://localhost:5000/api/products");
        const catRes = await axios.get("http://localhost:5000/api/categories");
        setProducts(prodRes.data);
        setCategories(catRes.data);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory ? p.category?._id === selectedCategory : true)
    );

    return (

      <div className="products-page">
    <h2 className="products-title">جميع منتجات جاليري الفريده</h2>
    <div className="products-container">
        <div className="products-filter">
            <input
                className="input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <select
                className="select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
        </div>
        <div className="products-grid">
            {filteredProducts.map(p => (
                <div key={p._id} className="product-card">
                    {p.images?.[0] && <img src={`http://localhost:5000/uploads/${p.images[0]}`} alt={p.name} />}
                    <div className="product-cardtext">
                    <h3 className="product-name">{p.name}</h3>
                   <div className="text_body">
                     <p className="product-price"><span> السعر:</span> {p.price}</p>
                    {/* <p className="product-category">Category: {p.category?.name || "No Category"}</p> */}
                    <p className="product-quantity"><span> العدد :</span> {p.quantity}</p>
                   </div>
                    <button className="product-btn" onClick={() => navigate(`/product/${p._id}`)}>Details</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>


 
    );
}
