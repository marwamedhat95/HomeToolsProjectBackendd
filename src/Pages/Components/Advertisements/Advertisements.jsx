import { useEffect, useState } from "react";
import axios from "axios";
import './Advertisements.css';

export default function Advertisements() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/ads")
      .then(res => setAds(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!ads.length) return null;

  return (
    <div className="mx-auto container  add px-4 my-6">
      {ads.map((ad, index) => (
        <a 
          key={ad._id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`ad-wrapper ad-wrapper-${index}`}   // ← unique class
          id={`ad-${ad._id}`}                            // ← unique id
        >
          <img
            src={`https://hometoolsprojectbackendd-production.up.railway.app/uploads/${ad.image}`}
            alt="إعلان"
            className={`w-full rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition mb-4 ad-img ad-img-${index}`}
          />
        </a>
      ))}
    </div>
  );
}
