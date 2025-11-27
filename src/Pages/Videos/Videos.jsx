import { useState, useEffect } from "react";
import axios from "axios";
// استيراد أيقونات للبحث والتصنيف
import { IoSearchOutline } from 'react-icons/io5';
import "./Videos.css"; // استيراد ملف CSS

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("");

  const categories = [
    { id: "all", label: "الكل" },
    { id: "bathroom", label: "الحمام" },
    { id: "kitchen", label: "المطبخ" },
    { id: "furniture", label: "المفروشات" },
    { id: "kids", label: "ألعاب أطفال" },
  ];

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos");
    setVideos(res.data);
  };

  const filteredVideos = videos.filter(v => 
    (activeTab === "all" || v.category === activeTab) &&
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="videos-page">
      <div className="videos-container">
        
        <h2 className="videos-title">معرض الفيديوهات</h2>

        {/* ---------- SEARCH ---------- */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="ابحث بالاسم..." 
            className="search-input" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <IoSearchOutline className="search-icon" />
        </div>

        {/* ---------- TABS (التصنيفات) ---------- */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`tab-button ${activeTab === cat.id ? "active-tab" : ""}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ---------- VIDEOS GRID ---------- */}
        <div className="videos-grid">
          {filteredVideos.length === 0 ? (
            <p className="no-videos">لا توجد فيديوهات مطابقة للمواصفات.</p>
          ) : (
            filteredVideos.map(v => (
              <div
                key={v._id}
                className="video-card"
                onClick={() => setSelectedVideo(v)}
              >
                <div className="video-thumbnail-container">
                  {v.type === "file" && (
                    <video
                      src={`http://localhost:5000/uploads/videos/${v.filename}`}
                      className="video-thumbnail"
                    />
                  )}

                  {v.type === "youtube" && (
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(v.url)}/0.jpg`}
                      alt={v.title}
                      className="video-thumbnail"
                    />
                  )}
                </div>
                <h3 className="video-title">{v.title}</h3>
              </div>
            ))
          )}
        </div>

        {/* ---------- POPUP ---------- */}
        {selectedVideo && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close-btn"
                onClick={() => setSelectedVideo(null)}
              >
                إغلاق
              </button>

              <h3 className="modal-title">{selectedVideo.title}</h3>

              {selectedVideo.type === "file" && (
                <video
                  src={`http://localhost:5000/uploads/videos/${selectedVideo.filename}`}
                  controls
                  autoPlay
                  className="modal-video-player"
                />
              )}

              {selectedVideo.type === "youtube" && (
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.url)}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="modal-video-player"
                ></iframe>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}