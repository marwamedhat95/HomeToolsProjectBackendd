import { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardHome.css";

export default function DashboardHome() {
// ---------------- HERO ----------------
const [hero, setHero] = useState({
title: "",
description: "",
buttonText: "",
buttonLink: "",
background: null,
currentBackground: "",
});

// ---------------- POPUP ----------------
const [popup, setPopup] = useState({ show: false, message: "", type: "" });
const showPopup = (msg, type = "success") => {
setPopup({ show: true, message: msg, type });
setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2500);
};

// ---------------- DELETE CONFIRM ----------------
const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

// ---------------- FORMS ----------------
const [homeProductForm, setHomeProductForm] = useState({
name: "", price: "", quantity: "", color: "", description: "",
homeProduct: true, fridayOffer: false
});

const [offerForm, setOfferForm] = useState({
name: "", price: "", quantity: "", color: "", description: "",
homeProduct: false, fridayOffer: true
});

const [files, setFiles] = useState([]);

// ---------------- DATA LISTS ----------------
const [homeProducts, setHomeProducts] = useState([]);
const [fridayOffers, setFridayOffers] = useState([]);

// ---------------- EDIT POPUP ----------------
const [editPopup, setEditPopup] = useState({ show: false, product: null });

// ---------------- FETCH DATA ----------------
const fetchHero = async () => {
try {
const res = await axios.get("[https://hometoolsprojectbackendd-production.up.railway.app/api/hero](https://hometoolsprojectbackendd-production.up.railway.app/api/hero)");
setHero(prev => ({
...prev,
title: res.data.title,
description: res.data.description,
buttonText: res.data.buttonText,
buttonLink: res.data.buttonLink,
currentBackground: res.data.background,
}));
} catch (err) {
console.error(err);
}
};

const fetchProducts = async () => {
try {
const res = await axios.get("[https://hometoolsprojectbackendd-production.up.railway.app/api/products](https://hometoolsprojectbackendd-production.up.railway.app/api/products)");
const products = Array.isArray(res.data) ? res.data : res.data.products || [];
setHomeProducts(products.filter(p => p.homeProduct));
setFridayOffers(products.filter(p => p.fridayOffer));
} catch (err) {
console.error("حدث خطأ أثناء جلب المنتجات:", err);
}
};

useEffect(() => {
fetchHero();
fetchProducts();
}, []);

// ---------------- VALIDATION ----------------
const validateForm = (form) => {
if (!form.name.trim() || !form.price || !form.quantity || !form.color.trim() || !form.description.trim()) {
showPopup("من فضلك املئي كل البيانات", "error");
return false;
}
if (files.length === 0) {
showPopup("يجب إضافة صور للمنتج", "error");
return false;
}
return true;
};

// ---------------- HERO SUBMIT ----------------
const handleHeroSubmit = async (e) => {
e.preventDefault();
try {
const res = await axios.put(
"[https://hometoolsprojectbackendd-production.up.railway.app/api/hero](https://hometoolsprojectbackendd-production.up.railway.app/api/hero)",
{ ...hero }
);
setHero(prev => ({ ...prev, ...res.data }));
showPopup("تم تحديث الـ Hero بنجاح");
} catch (err) {
console.error(err);
showPopup("حدث خطأ أثناء التحديث", "error");
}
};

// ---------------- ADD PRODUCT ----------------
const handleSubmit = async (form, setForm) => {
if (!validateForm(form)) return;
try {
const formData = new FormData();
Object.keys(form).forEach(key => formData.append(key, form[key]));
files.forEach(file => formData.append("images", file));


  await axios.post("https://hometoolsprojectbackendd-production.up.railway.app/api/products", formData);

  showPopup("تمت إضافة المنتج بنجاح 🎉");
  setForm({ ...form, name: "", price: "", quantity: "", color: "", description: "" });
  setFiles([]);
  fetchProducts();
} catch (err) {
  console.error(err);
  showPopup("حدث خطأ أثناء الإضافة", "error");
}


};

// ---------------- DELETE PRODUCT ----------------
const deleteProduct = async (id) => {
try {
await axios.delete(`https://hometoolsprojectbackendd-production.up.railway.app/api/products/${id}`);
showPopup("تم حذف المنتج");
fetchProducts();
} catch (err) {
console.error(err);
}
};

// ---------------- UPLOAD IMAGE ----------------
const uploadImage = async (file) => {
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", "react_upload");


try {
  const res = await fetch("https://api.cloudinary.com/v1_1/dkhjcwrlw/image/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.secure_url;
} catch (err) {
  console.error("Upload error:", err);
}


};

return ( <div className="dashboard-page">
{popup.show && <div className={`fixed-popup ${popup.type === "error" ? "error-popup" : "success-popup"}`}>{popup.message}</div>}

```
  {/* ---------------- HERO ---------------- */}
  <div className="dashboard-section">
    <h2 className="section-title">تعديل البانر الرئيسي (Hero)</h2>
    <form className="form-layout" onSubmit={handleHeroSubmit}>
      <input type="text" placeholder="العنوان الرئيسي" className="input-field" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
      <textarea placeholder="الوصف" className="textarea-field" value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
      <input type="text" placeholder="نص الزر" className="input-field" value={hero.buttonText} onChange={(e) => setHero({ ...hero, buttonText: e.target.value })} />
      <input type="text" placeholder="رابط الزر" className="input-field" value={hero.buttonLink} onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })} />

      <label className="image-label">صورة الخلفية الحالية:</label>
      {hero.currentBackground && <img src={hero.currentBackground} className="hero-current-image" alt="Current Hero Background" />}

      <input type="file" className="file-input" onChange={async (e) => {
        const file = e.target.files[0];
        const url = await uploadImage(file);
        setHero(prev => ({ ...prev, background: url }));
      }} />

      <button className="primary-button hero-save-button">حفظ التغييرات</button>
    </form>
  </div>

  <hr className="divider" />

  {/* ----------------- باقي الكود (منتجات وعروض) كما هو ----------------- */}
</div>


);
}
