import { useState, useEffect } from "react";
import './Login.css';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tools, setTools] = useState([]);

  // توليد أدوات منزلية صغيرة تتحرك في الخلفية
  useEffect(() => {
    const toolCount = 20;
    const tempTools = [];
    for(let i=0;i<toolCount;i++){
      tempTools.push({
        id: i,
        left: Math.random() * 100,
        size: 20 + Math.random()*20,
        duration: 5 + Math.random()*5
      });
    }
    setTools(tempTools);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin", "true");
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      {tools.map(tool => (
        <div
          key={tool.id}
          className="falling-tool"
          style={{
            left: `${tool.left}%`,
            width: `${tool.size}px`,
            height: `${tool.size}px`,
            animationDuration: `${tool.duration}s`
          }}
        ></div>
      ))}

      <form onSubmit={handleLogin} className="login-form">
        <h2>Welcome To Gallery Farida</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
