import { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardHome.css"; // 🆕 استيراد ملف CSS الجديد

export default function DashboardHome() {
  const [hero, setHero] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    background: null, // الصورة الجديدة
    currentBackground: "", // الصورة الموجودة
  });
  const [popups, setPopups] = useState({ show: false, message: "", type: "" });

  const showPopups = (msg, type = "success") => {
    setPopups({ show: true, message: msg, type });
    setTimeout(() => setPopups({ show: false, message: "", type: "" }), 2500);
  };

  const fetchHero = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hero");
      setHero({
        ...hero,
        title: res.data.title,
        description: res.data.description,
        buttonText: res.data.buttonText,
        buttonLink: res.data.buttonLink,
        currentBackground: res.data.background,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmits = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", hero.title);
    formData.append("description", hero.description);
    formData.append("buttonText", hero.buttonText);
    formData.append("buttonLink", hero.buttonLink);

    if (hero.background) {
      formData.append("background", hero.background);
    }

    try {
      await axios.put("http://localhost:5000/api/hero", formData);
      showPopups("تم تحديث الـ Hero بنجاح");
      fetchHero();
    } catch (err) {
      console.error(err);
      showPopups("حدث خطأ أثناء التحديث", "error");
    }
  };

  // ---------------- POPUP STATE ----------------
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const showPopup = (msg, type = "success") => {
    setPopup({ show: true, message: msg, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2500);
  };
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  // ---------------- FORMS ----------------
  const [homeProductForm, setHomeProductForm] = useState({
    name: "",
    price: "",
    quantity: "",
    color: "",
    description: "",
    homeProduct: true,
    fridayOffer: false,
  });

  const [offerForm, setOfferForm] = useState({
    name: "",
    price: "",
    quantity: "",
    color: "",
    description: "",
    homeProduct: false,
    fridayOffer: true,
  });

  const [files, setFiles] = useState([]);

  // ---------------- DATA LISTS ----------------
  const [homeProducts, setHomeProducts] = useState([]);
  const [fridayOffers, setFridayOffers] = useState([]);

  // ---------------- EDIT POPUP ----------------
  const [editPopup, setEditPopup] = useState({ show: false, product: null });

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      let products = [];
      if (Array.isArray(res.data)) {
        products = res.data;
      } else if (res.data && Array.isArray(res.data.products)) {
        products = res.data.products;
      } else {
        console.warn("بيانات المنتجات غير متوقعة:", res.data);
      }

      setHomeProducts(products.filter((p) => p.homeProduct));
      setFridayOffers(products.filter((p) => p.fridayOffer));
    } catch (err) {
      console.error("حدث خطأ أثناء جلب المنتجات:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchHero(); // 🆕 جلب بيانات الهيرو عند تحميل الصفحة
  }, []);

  // ---------------- VALIDATION ----------------
  const validateForm = (form) => {
    if (
      !form.name.trim() ||
      !form.price ||
      !form.quantity ||
      !form.color.trim() ||
      !form.description.trim()
    ) {
      showPopup("من فضلك املئي كل البيانات", "error");
      return false;
    }

    if (files.length === 0) {
      showPopup("يجب إضافة صور للمنتج", "error");
      return false;
    }

    return true;
  };

  // ---------------- ADD PRODUCT ----------------
  const handleSubmit = async (form, setForm) => {
    if (!validateForm(form)) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("color", form.color);
      formData.append("description", form.description);
      formData.append("homeProduct", form.homeProduct);
      formData.append("fridayOffer", form.fridayOffer);

      files.forEach((file) => formData.append("images", file));

      await axios.post("http://localhost:5000/api/products", formData);

      showPopup("تمت إضافة المنتج بنجاح 🎉", "success");

      setForm({
        ...form,
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
      });

      setFiles([]);
      fetchProducts();
    } catch (err) {
      showPopup("حدث خطأ أثناء الإضافة", "error");
      console.error(err);
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      showPopup("تم حذف المنتج");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- UPDATE PRODUCT (Helper function is removed, logic embedded) ----------------
  // تم إزالة دالة updateProduct، المنطق موجود مباشرة في زر الحفظ

  return (
    <div className="dashboard-page">
      {/* ----------------- POPUP (Hero) ----------------- */}
      {popups.show && (
        <div className={`fixed-popup ${popups.type === "error" ? "error-popup" : "success-popup"}`}>
          {popups.message}
        </div>
      )}

      {/* ----------------- Hero Section ----------------- */}
      <div className="dashboard-section">
        <h2 className="section-title">تعديل البانر الرئيسي (Hero)</h2>

        <form className="form-layout" onSubmit={handleSubmits}>
          <input
            type="text"
            placeholder="العنوان الرئيسي"
            className="input-field"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
          />

          <textarea
            placeholder="الوصف"
            className="textarea-field"
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
          />

          <input
            type="text"
            placeholder="نص الزر"
            className="input-field"
            value={hero.buttonText}
            onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
          />

          <input
            type="text"
            placeholder="رابط الزر"
            className="input-field"
            value={hero.buttonLink}
            onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
          />

          <label className="image-label">صورة الخلفية الحالية:</label>
          {hero.currentBackground && (
            <img 
              src={`http://localhost:5000/uploads/${hero.currentBackground}`} 
              className="hero-current-image" 
              alt="Current Hero Background"
            />
          )}

          <input
            type="file"
            className="file-input"
            onChange={(e) => setHero({ ...hero, background: e.target.files[0] })}
          />

          <button className="primary-button hero-save-button">حفظ التغييرات</button>
        </form>
      </div>

      <hr className="divider" />

      {/* ----------------- GLOBAL POPUP (Products) ----------------- */}
      {popup.show && (
        <div className="fixed-popup global-message-popup">
          <p className={`message-text ${popup.type === "error" ? "text-error" : "text-success"}`}>
            {popup.message}
          </p>
        </div>
      )}

      {/* ----------------- EDIT POPUP (Product) ----------------- */}
      {editPopup.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">تعديل المنتج</h3>

            <input
              className="input-field"
              value={editPopup.product.name}
              onChange={(e) =>
                setEditPopup({
                  ...editPopup,
                  product: { ...editPopup.product, name: e.target.value },
                })
              }
              placeholder="اسم المنتج"
            />

            <input
              className="input-field"
              type="number"
              value={editPopup.product.price}
              onChange={(e) =>
                setEditPopup({
                  ...editPopup,
                  product: { ...editPopup.product, price: e.target.value },
                })
              }
              placeholder="السعر"
            />

            <input
              className="input-field"
              type="number"
              value={editPopup.product.quantity}
              onChange={(e) =>
                setEditPopup({
                  ...editPopup,
                  product: { ...editPopup.product, quantity: e.target.value },
                })
              }
              placeholder="الكمية"
            />

            <input
              className="input-field"
              value={editPopup.product.color}
              onChange={(e) =>
                setEditPopup({
                  ...editPopup,
                  product: { ...editPopup.product, color: e.target.value },
                })
              }
              placeholder="اللون"
            />

            <textarea
              className="textarea-field"
              value={editPopup.product.description}
              onChange={(e) =>
                setEditPopup({
                  ...editPopup,
                  product: { ...editPopup.product, description: e.target.value },
                })
              }
              placeholder="الوصف"
            />

            {/* صور جديدة لو عايزة تعدليها */}
            <input
              type="file"
              multiple
              className="file-input"
              onChange={(e) =>
                setEditPopup({
                  ...editPopup,
                  product: { ...editPopup.product, newImages: [...e.target.files] },
                })
              }
            />

            <button
              className="primary-button modal-save-button"
              onClick={async () => {
                const fd = new FormData();

                fd.append("name", editPopup.product.name);
                fd.append("price", editPopup.product.price);
                fd.append("quantity", editPopup.product.quantity);
                fd.append("color", editPopup.product.color);
                fd.append("description", editPopup.product.description);

                // لو اختارت صور جديدة
                if (editPopup.product.newImages) {
                  editPopup.product.newImages.forEach((file) =>
                    fd.append("images", file)
                  );
                }

                await axios.put(
                  `http://localhost:5000/api/products/${editPopup.product._id}`,
                  fd
                );

                showPopup("تم التعديل بنجاح");
                setEditPopup({ show: false, product: null });
                fetchProducts();
              }}
            >
              حفظ التعديل
            </button>

            <button
              className="secondary-button"
              onClick={() => setEditPopup({ show: false, product: null })}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* ----------------- CONFIRM DELETE POPUP ----------------- */}
      {confirmDelete.show && (
        <div className="modal-overlay">
          <div className="modal-content modal-confirm">
            <h3 className="modal-title-confirm">هل أنتِ متأكدة من الحذف؟</h3>

            <div className="flex gap-2">
              <button
                className="delete-button-confirm"
                onClick={() => {
                  axios
                    .delete(`http://localhost:5000/api/products/${confirmDelete.id}`)
                    .then(() => {
                      showPopup("تم حذف المنتج");
                      setConfirmDelete({ show: false, id: null });
                      fetchProducts();
                    })
                    .catch((err) => console.error(err));
                }}
              >
                نعم، احذف
              </button>

              <button
                className="secondary-button"
                onClick={() => setConfirmDelete({ show: false, id: null })}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- HOME PRODUCT FORM ----------------- */}
      <div className="dashboard-section">
        <h2 className="section-title">إضافة منتجات الهوم</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(homeProductForm, setHomeProductForm);
          }}
          className="form-layout product-form"
        >
          <input
            type="text"
            placeholder="اسم المنتج"
            className="input-field"
            value={homeProductForm.name}
            onChange={(e) =>
              setHomeProductForm({ ...homeProductForm, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="السعر"
            className="input-field"
            value={homeProductForm.price}
            onChange={(e) =>
              setHomeProductForm({ ...homeProductForm, price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="الكمية"
            className="input-field"
            value={homeProductForm.quantity}
            onChange={(e) =>
              setHomeProductForm({ ...homeProductForm, quantity: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="اللون"
            className="input-field"
            value={homeProductForm.color}
            onChange={(e) =>
              setHomeProductForm({ ...homeProductForm, color: e.target.value })
            }
          />

          <textarea
            placeholder="الوصف"
            className="textarea-field"
            value={homeProductForm.description}
            onChange={(e) =>
              setHomeProductForm({
                ...homeProductForm,
                description: e.target.value,
              })
            }
          />

          <input 
             type="file" 
             multiple 
             className="file-input"
             onChange={(e) => setFiles([...e.target.files])} 
          />

          <button className="primary-button">إضافة منتج الهوم</button>
        </form>

        <hr className="divider" />

        {/* ----------------- LIST HOME PRODUCTS ----------------- */}
        <h3 className="section-subtitle">المنتجات الحالية:</h3>
       {/* ----------------- LIST HOME PRODUCTS ----------------- */}
<h3 className="section-subtitle">المنتجات الحالية:</h3>
<div className="products-scroll-container"> {/* 🆕 الحاوية للارتفاع والـ Scroll */}
    <div className="products-grid-list"> {/* 🆕 الحاوية لعرض البطاقات جنبًا لجنب */}
        {homeProducts.map((p) => (
            <div key={p._id} className="product-card-dashboard">
                {/* ... باقي محتوى البطاقة (p.name, p.images, p.details, p.actions) ... */}
                {/* NAME */}
                <h4 className="product-name-dashboard">{p.name}</h4>

                {/* IMAGES */}
                <div className="product-images-list">
                    {p.images?.map((img, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${img}`}
                            alt="product"
                            className="product-thumb"
                        />
                    ))}
                </div>

                {/* DETAILS */}
                <div className="product-details-list">
                    <p>السعر: <span className="detail-value text-price">{p.price} جنيه</span></p>
                    <p>الكمية: <span className="detail-value">{p.quantity}</span></p>
                    <p>اللون: <span className="detail-value">{p.color}</span></p>
                    <p>تفاصيل: <span className="detail-value text-description">{p.description}</span></p>
                    <p>النوع: <span className="detail-value type-home">هوم</span></p>
                </div>

                {/* ACTIONS */}
                <div className="product-actions">
                    <button 
                        className="action-button action-edit" 
                        onClick={() => setEditPopup({ show: true, product: p })}
                    >
                        تعديل
                    </button>
                    <button 
                        className="action-button action-delete" 
                        onClick={() => setConfirmDelete({ show: true, id: p._id })}
                    >
                        مسح
                    </button>
                </div>
            </div>
        ))}
    </div> {/* 🆕 نهاية products-grid-list */}
</div> {/* 🆕 نهاية products-scroll-container */}
      </div>


      {/* ----------------- FRIDAY OFFER FORM ----------------- */}
      <div className="dashboard-section mt-8">
        <h2 className="section-title">إضافة عروض الجمعة</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(offerForm, setOfferForm);
          }}
          className="form-layout product-form"
        >
          <input
            type="text"
            placeholder="اسم المنتج"
            className="input-field"
            value={offerForm.name}
            onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="السعر"
            className="input-field"
            value={offerForm.price}
            onChange={(e) =>
              setOfferForm({ ...offerForm, price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="الكمية"
            className="input-field"
            value={offerForm.quantity}
            onChange={(e) =>
              setOfferForm({ ...offerForm, quantity: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="اللون"
            className="input-field"
            value={offerForm.color}
            onChange={(e) =>
              setOfferForm({ ...offerForm, color: e.target.value })
            }
          />

          <textarea
            placeholder="الوصف"
            className="textarea-field"
            value={offerForm.description}
            onChange={(e) =>
              setOfferForm({ ...offerForm, description: e.target.value })
            }
          />

          <input 
            type="file" 
            multiple 
            className="file-input"
            onChange={(e) => setFiles([...e.target.files])} 
          />

          <button className="primary-button offer-button">إضافة العرض</button>
        </form>
        
        <hr className="divider" />

        {/* ----------------- LIST FRIDAY OFFERS ----------------- */}
      <h3 className="section-subtitle">العروض الحالية:</h3>
<div className="products-scroll-container"> {/* 🆕 الحاوية للارتفاع والـ Scroll */}
    <div className="products-grid-list"> {/* 🆕 الحاوية لعرض البطاقات جنبًا لجنب */}
        {fridayOffers.map((p) => (
            <div key={p._id} className="product-card-dashboard offer-card">
                {/* ... باقي محتوى البطاقة (p.name, p.images, p.details, p.actions) ... */}
                {/* NAME */}
                <h4 className="product-name-dashboard">{p.name}</h4>

                {/* IMAGES */}
                <div className="product-images-list">
                    {p.images?.map((img, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${img}`}
                            alt="product"
                            className="product-thumb"
                        />
                    ))}
                </div>

                {/* DETAILS */}
                <div className="product-details-list">
                    <p>السعر: <span className="detail-value text-price-offer">{p.price} جنيه</span></p>
                    <p>الكمية: <span className="detail-value">{p.quantity}</span></p>
                    <p>اللون: <span className="detail-value">{p.color}</span></p>
                    <p>تفاصيل: <span className="detail-value text-description">{p.description}</span></p>
                    <p>النوع: <span className="detail-value type-offer">عرض الجمعة</span></p>
                </div>

                {/* ACTIONS */}
                <div className="product-actions">
                    <button
                        className="action-button action-edit"
                        onClick={() => setEditPopup({ show: true, product: p })}
                    >
                        تعديل
                    </button>

                    <button
                        className="action-button action-delete"
                        onClick={() => setConfirmDelete({ show: true, id: p._id })}
                    >
                        مسح
                    </button>
                </div>
            </div>
        ))}
    </div> {/* 🆕 نهاية products-grid-list */}
</div>
       </div>
    </div>
  );
}