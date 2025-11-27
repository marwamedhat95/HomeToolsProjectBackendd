import { useState, useEffect } from "react";
import axios from "axios";
import './ContactManagement.css'
export default function ContactManagement() {
  const [contacts, setContacts] = useState([
    { address: "", phone: "", facebook: "", twitter: "", instagram: "" }
  ]);
  const [savedContacts, setSavedContacts] = useState([]);

  const [addPopup, setAddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);

  // بيانات إضافة من البوب اب
  const [newPopupContact, setNewPopupContact] = useState({
    address: "",
    phone: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/contacts");
    setSavedContacts(res.data);
  };

  // تغيير في الفورم الأساسي
  const handleChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  // حفظ الفورم الأساسي للمرة الأولى
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let contact of contacts) {
      await axios.post("https://hometoolsprojectbackendd-production.up.railway.app/api/contacts", contact);
    }

    setContacts([{ address: "", phone: "", facebook: "", twitter: "", instagram: "" }]);
    fetchContacts();
  };

  // إضافة صف جديد عبر البوب اب
  const handleAddPopupSubmit = async () => {
    await axios.post("https://hometoolsprojectbackendd-production.up.railway.app/api/contacts", newPopupContact);
    setAddPopup(false);

    setNewPopupContact({
      address: "",
      phone: "",
      facebook: "",
      twitter: "",
      instagram: "",
    });

    fetchContacts();
  };

  const handleEditChange = (index, field, value) => {
    const updated = [...savedContacts];
    updated[index][field] = value;
    setSavedContacts(updated);
  };

  const saveEdit = async (index) => {
    const updatedContact = savedContacts[index];
    await axios.put(`https://hometoolsprojectbackendd-production.up.railway.app/api/contacts/${updatedContact._id}`, updatedContact);

    setEditPopup(null);
    fetchContacts();
  };

  const deleteContact = async (index) => {
    const contactToDelete = savedContacts[index];
    await axios.delete(`https://hometoolsprojectbackendd-production.up.railway.app/api/contacts/${contactToDelete._id}`);
    fetchContacts();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-6">Contact Management Dashboard</h1>
        <button className="btn btn-primary" type="submit">حفظ </button>
      </div>
      {/* الفورم الأساسي أول مرة */}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {contacts.map((contact, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-2">
            <input type="text" placeholder="العنوان" className="input input-bordered w-full"
              value={contact.address} onChange={(e) => handleChange(index, "address", e.target.value)} />

            <input type="text" placeholder="رقم التليفون" className="input input-bordered w-full"
              value={contact.phone} onChange={(e) => handleChange(index, "phone", e.target.value)} />

            <input type="text" placeholder="Facebook URL" className="input input-bordered w-full"
              value={contact.facebook} onChange={(e) => handleChange(index, "facebook", e.target.value)} />

            <input type="text" placeholder="Twitter URL" className="input input-bordered w-full"
              value={contact.twitter} onChange={(e) => handleChange(index, "twitter", e.target.value)} />

            <input type="text" placeholder="Instagram URL" className="input input-bordered w-full"
              value={contact.instagram} onChange={(e) => handleChange(index, "instagram", e.target.value)} />
          </div>
        ))}

       
      </form>

    

      {/* عرض البيانات المحفوظة */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">البيانات المحفوظة:</h2>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {savedContacts.map((contact, index) => (
          <div key={index} className="p-4 border rounded-lg mb-2">
            <p><strong>العنوان:</strong> {contact.address}</p>
            <p><strong>رقم التليفون:</strong> {contact.phone}</p>
            {contact.facebook && <p><strong>Facebook:</strong> {contact.facebook}</p>}
            {contact.twitter && <p><strong>Twitter:</strong> {contact.twitter}</p>}
            {contact.instagram && <p><strong>Instagram:</strong> {contact.instagram}</p>}

            <div className="flex gap-3 mt-3">
              <button className="btn btn-sm btn-warning" onClick={() => setEditPopup(index)}>
                تعديل
              </button>
              <button className="btn btn-sm btn-error" onClick={() => deleteContact(index)}>
                مسح
              </button>
            </div>
          </div>
        ))}
     </div>
      </div>

      {/* POPUP — إضافة عنوان جديد */}
      {addPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">

            <button className="absolute right-3 top-2" onClick={() => setAddPopup(false)}>✖</button>
            <h3 className="text-xl font-bold mb-4">إضافة عنوان جديد</h3>

            {["address", "phone", "facebook", "twitter", "instagram"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                className="input input-bordered w-full mb-3"
                value={newPopupContact[field]}
                onChange={(e) => setNewPopupContact({ ...newPopupContact, [field]: e.target.value })}
              />
            ))}

            <button className="btn btn-primary mt-3" onClick={handleAddPopupSubmit}>
              حفظ
            </button>

          </div>
        </div>
      )}

      {/* POPUP تعديل */}
      {editPopup !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">

            <button className="absolute right-3 top-2" onClick={() => setEditPopup(null)}>✖</button>
            <h3 className="text-xl font-bold mb-4">تعديل بيانات</h3>

            {["address", "phone", "facebook", "twitter", "instagram"].map((field) => (
              <input
                key={field}
                type="text"
                className="input input-bordered w-full mb-3"
                value={savedContacts[editPopup][field]}
                onChange={(e) => handleEditChange(editPopup, field, e.target.value)}
              />
            ))}

            <button className="btn btn-primary" onClick={() => saveEdit(editPopup)}>
              حفظ التعديل
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
