import { useState, useEffect } from "react";
import axios from "axios";
import './AdvertisementsManagement.css';

export default function AdvertisementsManagement() {
  const [ads, setAds] = useState([]);
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/ads");
      setAds(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAd = async () => {
    if (!image || !link) return alert("الرجاء إدخال الصورة والرابط");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("link", link);

    setLoading(true);
    try {
      const res = await axios.post("https://hometoolsprojectbackendd-production.up.railway.app/api/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAds([res.data, ...ads]);
      setImage(null);
      setLink("");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة الإعلان");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hometoolsprojectbackendd-production.up.railway.app/api/ads/${id}`);
      setAds(ads.filter(ad => ad._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 advertisements-management-container">
      <h2 className="text-2xl font-bold mb-4">إدارة الإعلانات</h2>

      {/* إضافة إعلان */}
      <div className="mb-6 border p-4 rounded shadow-md">
        <h3 className="font-semibold mb-2">إضافة إعلان جديد</h3>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-2 block"
        />
        <input
          type="text"
          placeholder="رابط الإعلان"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mb-2 block border p-2 rounded w-full"
        />
        <button
          onClick={handleAddAd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "جارٍ الإضافة..." : "إضافة الإعلان"}
        </button>
      </div>

      {/* قائمة الإعلانات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ads.map(ad => (
          <div key={ad._id} className="border p-3 rounded shadow relative">
            <img
              src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${ad.image}`}
              alt="ad"
              className="w-full h-40 object-cover rounded mb-2"
            />
            <a href={ad.link} target="_blank" className="text-blue-600 underline" rel="noreferrer">
              {ad.link}
            </a>
            <button
              onClick={() => handleDelete(ad._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
