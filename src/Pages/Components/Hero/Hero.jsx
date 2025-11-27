import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Hero() {
const [hero, setHero] = useState({
title: "",
description: "",
buttonText: "",
buttonLink: "",
background: "",
});



useEffect(() => {
fetchHero();
}, []);


const fetchHero = async () => {
  try {
    const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/hero");
    console.log("Response from API:", res.data); // هنا نتأكد من البيانات
    const data = res.data || {};
    setHero({
      title: data.title || "",
      description: data.description || "",
      buttonText: data.buttonText || "",
      buttonLink: data.buttonLink || "#",
      background: data.background
        ? `https://hometoolsprojectbackendd-production.up.railway.app/uploads/${encodeURIComponent(data.background)}`
        : "",
    });
  } catch (err) {
    console.error("حدث خطأ أثناء جلب بيانات الهيرو:", err);
  }
};
return (
<div
  className="w-full h-[400px] flex flex-col justify-center items-start p-8 text-white"
  style={{
    backgroundImage: hero.background ? `url(${hero.background})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: hero.background ? undefined : "#333",
  }}
>
  <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
  <p className="text-lg mb-6">{hero.description}</p>
  {hero.buttonText && (
    <a
      href={hero.buttonLink}
      className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded hover:bg-yellow-600 transition"
    >
      {hero.buttonText}
    </a>
  )}
</div>

);
}
