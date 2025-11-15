import { useState, useEffect } from "react";
import Dog from "../images/pet.gif";
import "../components/Dog.css";
import healthBar from "../images/healthbar/hb_max.png";

export default function Pet() {
  const [position, setPosition] = useState({ top: "0%", left: "20%" });
  const [faceRight, setFaceRight] = useState(true);
  useEffect(() => {
    const moveDog = () => {
      const newTop = Math.random() * 15;
      const newLeft = Math.random() * 100;
      setPosition({ top: `${newTop}%`, left: `${newLeft}%` });
      setFaceRight(newLeft < parseFloat(position.left));
    };

    const interval = setInterval(moveDog, 1000);
    return () => clearInterval(interval);
  }, [position]);

  return (
    <div className="pet-container" style={{ 
            position:"absolute",  
          top: position.top,
          left: position.left,
          transition: "all 10s ease",}}>
      <img
        src={healthBar}
        alt="health bar"
        
        style={{ width: "20vh",
        }}
        className="health-bar"
      />

      <img
        src={Dog}
        alt="pet gif"
        className="dog"
        style={{
          width: "40vh",
        transform:faceRight ? "scaleX(-1)": "scaleX(1)",

        }}
      />
    </div>
  );
}
