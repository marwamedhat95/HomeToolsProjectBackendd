import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CategoryPage() {
const { id } = useParams();
const navigate = useNavigate();
const [products, setProducts] = useState([]);
const [categoryName, setCategoryName] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const catRes = await axios.get("http://localhost:5000/api/categories");
      const allCategories = Array.isArray(catRes.data) ? catRes.data : [];
      const category = allCategories.find(c => c._id === id);
      if (category) setCategoryName(category.name);

      const prodRes = await axios.get("http://localhost:5000/api/products");
      const allProducts = Array.isArray(prodRes.data) ? prodRes.data : [];
      const filtered = allProducts.filter(p => p.category?._id === id);
      setProducts(filtered);

      setLoading(false); // ✅ هنا بنوقف اللودنج
    } catch (err) {
      console.error("Error fetching category or products:", err);
      setLoading(false); // كمان لو حصل خطأ نوقف اللودنج
    }
  };
  if (id) fetchData();
}, [id]);

if (loading) return <p className="text-center mt-20">Loading...</p>;

return ( <div className="container mx-auto px-4 py-8"> <h2 className="text-2xl font-semibold mb-6">قسم: {categoryName}</h2> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
{products.map(p => (
<div
key={p._id}
className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
onClick={() => navigate(`/product/${p._id}`)}
>
{p.images?.[0] && (
<img
src={`http://localhost:5000/uploads/${p.images[0]}`}
alt={p.name}
className="w-full h-48 object-cover rounded"
/>
)} <h3 className="font-medium mt-2">{p.name}</h3> <p>السعر: {p.price} جنيه</p> <p>الكمية: {p.quantity}</p> <p>اللون: {p.color}</p> </div>
))} </div> </div>
);
}
