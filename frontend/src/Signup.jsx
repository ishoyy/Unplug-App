import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut} from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import "./components/Auth.css";
import CloseIcon from '@mui/icons-material/Close';



export default function Signup({ hideSignup, showLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      setMessage("✅ Account created successfully! Redirecting to login...");
      hideSignup();
     
    } catch (err) {
      setMessage("❌ " + err.message);
    }

  };

  // if redirect triggered → go to login
 

  return (
    <div className="auth-page">
      <div className="container">
         <CloseIcon className="close-icon"
      style={{
        position: "absolute",
        top: "2px",
        right: "2px",
        cursor: "pointer",
        color: '#7e270aff',
        backgroundColor: "#ffb235f8",
        borderRadius: "50%",
        zIndex:"1001",
        width:"20px",
        height:"20px"
      }}
      onClick={hideSignup}
    />
       
      <img src="" alt="Book Logo" className="logo-img" />

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-btn">
            Create Account
          </button>

          
        </form>


        {message && (
          <p
            className={
              message.startsWith("✅") ? "message-success" : "message-error"
            }
          >
            {message}
          </p>
        )}

      
        <p style={{ marginTop: "20px", fontSize: "15px" }}>
          Have an account?{" "}
          <span onClick={showLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
