import { useState, useEffect } from "react";
import axios from "axios";
import './ProductsManagement.css'

export default function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [color, setColor] = useState("");
    const [description, setDescription] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [editId, setEditId] = useState(null);

    // Modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/products");
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/categories");
            setCategories(res.data);
        } catch (error) {
            console.log(error);
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) return alert("Please select a category");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    // لو اللون أكتر من واحد (مثلاً "Red, Blue")
    color.split(",").forEach(c => formData.append("color", c.trim()));
    formData.append("description", description);

    imageFiles.forEach(file => formData.append("images", file));

    try {
        if (editId) {
            await axios.put(`https://hometoolsprojectbackendd-production.up.railway.app/api/products/${editId}`, formData);
            setShowEditModal(false);
            setEditId(null);
        } else {
            await axios.post("https://hometoolsprojectbackendd-production.up.railway.app/api/products", formData);
        }

        // Reset form
        setName("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setColor("");
        setDescription("");
        setImageFiles([]);

        fetchProducts();
    } catch (error) {
        console.log(error);
    }
};


    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://hometoolsprojectbackendd-production.up.railway.app/api/products/${deleteId}`);
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchProducts();
        } catch (error) {}
    };

    const handleEdit = (p) => {
        setEditId(p._id);
        setName(p.name);
        setPrice(p.price);
        setCategory(p.category?._id || "");
        setQuantity(p.quantity);
        setColor(Array.isArray(p.color) ? p.color.join(", ") : p.color || "");
        setDescription(p.description || "");
        setShowEditModal(true);
    };

    return (
        <div className="p-6 max-w-4xl  ProductsManagement">

            <h2 className="text-3xl font-bold mb-6 text-center">إدارة المنتجات  </h2>

  <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-xl shadow-lg grid gap-4">

  {/* Row 1: Name, Price, Quantity, Color, Category, Images */}
  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
    <input
      className="input input-bordered w-full"
      placeholder="الاسم"
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <input
      className="input input-bordered w-full"
      type="number"
      placeholder="السعر"
      value={price}
      onChange={e => setPrice(e.target.value)}
    />
    <input
      className="input input-bordered w-full"
      type="number"
      placeholder="العدد"
      value={quantity}
      onChange={e => setQuantity(e.target.value)}
    />
    <input
      className="input input-bordered w-full"
      placeholder="اللون"
      value={color}
      onChange={e => setColor(e.target.value)}
    />
    <select
      className="select select-bordered w-full"
      value={category}
      onChange={e => setCategory(e.target.value)}
    >
      <option value="">Category</option>
      {categories.map(c => (
        <option key={c._id} value={c._id}>{c.name}</option>
      ))}
    </select>
    <input
      type="file"
      multiple
      className="file-input file-input-bordered w-full"
      onChange={e => setImageFiles([...e.target.files])}
    />
  </div>

  {/* Row 2: Description */}
  <textarea
    className="textarea textarea-bordered w-full"
    placeholder="التفاصيل"
    value={description}
    onChange={e => setDescription(e.target.value)}
  ></textarea>

  {/* Submit Button */}
  <button className="btn btn-primary w-full">{editId ? "Update" : "اضف المنتج"}</button>
</form>


{/* Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 scroll lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
  {products.map(p => (
    <div key={p._id} className="card bg-base-100 shadow-xl p-4">
        {/* Images */}
      <div className="flex gap-2 overflow-x-auto mb-2">
        {p.images?.map((img, idx) => (
          <img key={idx} src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${img}`} className="w-24 h-24 rounded-md" />
        ))}
      </div>

      {/* Name */}
      <h3 className="font-bold text-xl mb-2">{p.name}</h3>
 {/* Description */}
      <p className="mb-2">{p.description}</p>
      {/* Price + Quantity */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <p>Price: {p.price}</p>
        <p>Qty: {p.quantity}</p>
      </div>

      {/* Color + Category */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <p>Color: {Array.isArray(p.color) ? p.color[0] : p.color}</p>
        <p>Category: {p.category?.name}</p>
      </div>

     

    
      {/* Action Buttons */}
      <div className="flex gap-3 mt-3">
        <button className="btn btn-info btn-sm" onClick={() => handleEdit(p)}>Edit</button>
        <button className="btn btn-error btn-sm" onClick={() => confirmDelete(p._id)}>Delete</button>
      </div>

    </div>
  ))}
</div>



            {/* DELETE MODAL */}
            {showDeleteModal && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Are you sure?</h3>
                        <p className="py-4">Delete this product permanently?</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* EDIT MODAL */}
            {showEditModal && (
                <dialog open className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-xl mb-4">Edit Product</h3>
                        <form onSubmit={handleSubmit} className="grid gap-3">
                            <input className="input input-bordered" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                            <input className="input input-bordered" placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                            <select className="select select-bordered" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                            <input className="input input-bordered" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
                            <input className="input input-bordered" placeholder="Color" value={color} onChange={e => setColor(e.target.value)} />
                            <textarea className="textarea textarea-bordered" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                            <input type="file" multiple onChange={e => setImageFiles([...e.target.files])} />
                            <div className="flex justify-end gap-3 mt-3">
                                <button className="btn btn-primary" type="submit">Update</button>
                                <button className="btn" type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
}
