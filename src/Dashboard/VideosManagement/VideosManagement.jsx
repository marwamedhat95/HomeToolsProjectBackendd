import { useState, useEffect } from "react";
import axios from "axios";
import './VideosManagement.css'

export default function VideosManagement() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("file");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [editPopup, setEditPopup] = useState(null); 
  const [deletePopup, setDeletePopup] = useState(null);
  const [previewPopup, setPreviewPopup] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos");
    setVideos(res.data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("category", category);
    if (type === "file" && file) formData.append("file", file);
    else formData.append("url", url);

    try {
      await axios.put(`http://localhost:5000/api/videos/${editPopup._id}`, formData);

      setEditPopup(null);
      setTitle("");
      setType("file");
      setUrl("");
      setFile(null);
      setCategory("");

      fetchVideos();
    } catch (err) {
      console.log(err);
    }
  };

  const openEditPopup = (v) => {
    setEditPopup(v);
    setTitle(v.title);
    setType(v.type);
    setUrl(v.url || "");
    setCategory(v.category || "");
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/videos/${deletePopup}`);
    setDeletePopup(null);
    fetchVideos();
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("category", category);
    if (type === "file" && file) formData.append("file", file);
    else formData.append("url", url);

    await axios.post("http://localhost:5000/api/videos", formData);

    setTitle("");
    setUrl("");
    setCategory("");
    setType("file");
    setFile(null);
    document.getElementById("fileInput").value = null;

    fetchVideos();
  };

  const translateCategory = (cat) => {
    switch(cat) {
      case 'bathroom': return 'الحمام';
      case 'kitchen': return 'المطبخ';
      case 'furniture': return 'المفروشات';
      case 'kids': return 'ألعاب الأطفال';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">إدارة الفيديو</h2>

      <form onSubmit={handleAddVideo} className="flex flex-wrap gap-3 items-center bg-base-200 p-6 rounded-xl shadow-lg ">
        <input placeholder="الاسم" className="input input-bordered flex-1 min-w-[150px]" value={title} onChange={(e) => setTitle(e.target.value)} />

        <select className="select select-bordered flex-1 min-w-[120px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">اختر القسم</option>
          <option value="bathroom">الحمام</option>
          <option value="kitchen">المطبخ</option>
          <option value="furniture">المفروشات</option>
          <option value="kids">ألعاب الأطفال</option>
        </select>

        <select className="select select-bordered flex-1 min-w-[120px]" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="file">ملف</option>
          <option value="youtube">يوتيوب</option>
          <option value="facebook">فيسبوك</option>
        </select>

        {type === "file" ? (
          <input type="file" id="fileInput" className="flex-1 min-w-[120px]" onChange={(e) => setFile(e.target.files[0])} />
        ) : (
          <input placeholder="URL" className="input input-bordered flex-1 min-w-[150px]" value={url} onChange={(e) => setUrl(e.target.value)} />
        )}

        <button className="btn btn-primary">اضافة فيديو</button>
      </form>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {videos.map((v) => (
          <div key={v._id} className="card shadow p-2 relative">
            <div onClick={() => setPreviewPopup(v)} className="cursor-pointer">
              <h3 className="font-bold mb-1">{v.title}</h3>
              <p className="text-sm mb-1">القسم: {translateCategory(v.category)}</p>

              {v.type === "file" && (
                <video src={`http://localhost:5000/uploads/videos/${v.filename}`} className="w-full h-32" />
              )}

              {v.type === "youtube" && (
                <img src={`https://img.youtube.com/vi/${extractYouTubeId(v.url)}/0.jpg`} className="w-full h-32 object-cover" />
              )}
            </div>

            <div className="flex justify-between mt-2">
              <button className="btn btn-sm btn-warning" onClick={() => openEditPopup(v)}>تعديل</button>
              <button className="btn btn-sm btn-error" onClick={() => setDeletePopup(v._id)}>مسح</button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT POPUP ================= */}
      {editPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-full max-w-lg relative">
            <button className="absolute right-3 top-2" onClick={() => setEditPopup(null)}>✖</button>
            <h3 className="text-xl font-bold mb-4">إدارة الفيديوهات</h3>

            <form onSubmit={handleUpdate} className="grid gap-3">
              <input placeholder="الاسم" className="input input-bordered" value={title} onChange={(e) => setTitle(e.target.value)} />

              <select className="select select-bordered" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="file">ملف</option>
                <option value="youtube">يوتيوب</option>
                <option value="facebook">فيسبوك</option>
              </select>

              {type === "file" ? (
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              ) : (
                <input placeholder="URL" className="input input-bordered" value={url} onChange={(e) => setUrl(e.target.value)} />
              )}

              <select className="select select-bordered" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">اختر القسم</option>
                <option value="bathroom">الحمام</option>
                <option value="kitchen">المطبخ</option>
                <option value="furniture">المفروشات</option>
                <option value="kids">ألعاب الأطفال</option>
              </select>

              <button className="btn btn-primary">تعديل</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE POPUP ================= */}
      {deletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">هل انت متأكد ؟</h3>
            <p className="mb-4">هذا الفيديو سيتم حذفه الأن</p>
            <div className="flex justify-center gap-4">
              <button className="btn" onClick={() => setDeletePopup(null)}>إلغاء</button>
              <button className="btn btn-error" onClick={handleDelete}>مسح</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PREVIEW POPUP ================= */}
      {previewPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-4 max-w-3xl w-full relative">
            <button className="close" onClick={() => setPreviewPopup(null)}>✖</button>
            <h3 className="font-bold mb-2">{previewPopup.title}</h3>
            {previewPopup.type === "file" && (
              <video src={`http://localhost:5000/uploads/videos/${previewPopup.filename}`} controls autoPlay className="w-full" />
            )}
            {previewPopup.type === "youtube" && (
              <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${extractYouTubeId(previewPopup.url)}`} title={previewPopup.title} frameBorder="0" allowFullScreen></iframe>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}