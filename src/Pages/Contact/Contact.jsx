import { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import "./Contact.css"; 

export default function Contact() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("https://hometoolsprojectbackendd-production.up.railway.app/api/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">تواصل معنا</h1>

        {contacts.length === 0 && (
          <p className="no-data-message">لا توجد بيانات اتصال حتى الآن.</p>
        )}
        
        {/* إضافة كلاس جديد للتحكم في عرض بطاقات الاتصال جنبًا إلى جنب */}
        <div className="contacts-wrapper">
          {contacts.map((c, index) => (
            <div key={index} className="contact-card">
                
                {/* تعديل: لجعل المحتويات الداخلية رأسية (كبطاقة معلومات) */}
                <div className="card-content-vertical">
                    
                    <div className="contact-item">
                      <h2 className="item-title"><FaMapMarkerAlt className="item-icon" /> العنوان</h2>
                      <p className="item-value">{c.address}</p>
                  </div>
    
                    <div className="contact-item">
                      <h2 className="item-title"><FaPhone className="item-icon" /> رقم الهاتف</h2>
                      <p className="item-value">{c.phone}</p>
                  </div>
                    
                    {/* وسائل التواصل الاجتماعي */}
                  <div className="social-links">
                    <h2 className="social-title">تابعنا على</h2>
                    {/* الروابط هنا... */}
                    {c.facebook && (<a href={c.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook"><FaFacebook /> Facebook</a>)}
                    {c.twitter && (<a href={c.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter"><FaTwitter /> Twitter</a>)}
                    {c.instagram && (<a href={c.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram"><FaInstagram /> Instagram</a>)}
                  </div>

                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}