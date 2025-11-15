import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../FirebaseConfig";
import "./components/Auth.css";
import Logo from "./images/auth-cat.gif"
import CloseIcon from '@mui/icons-material/Close';

export default function Login({ onSuccess, hideLogin, showSignup}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Logged in successfully!");
      onSuccess(); // redirect to Catalogue
    } catch (err) {
      let userMessage = "❌ Something went wrong. Please try again.";

      // 🔹 Map Firebase error codes to clean messages
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          userMessage = "❌ Incorrect Email and/or Password.";
          break;
        case "auth/invalid-email":
          userMessage = "❌ Invalid email format.";
          break;
        case "auth/missing-password":
          userMessage = "❌ Please enter your password.";
          break;
        case "auth/user-disabled":
          userMessage = "❌ This account has been disabled.";
          break;
        default:
          userMessage = "❌ Login failed. Please check your credentials.";
      }

      setMessage(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email first.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset email sent! Check your inbox.");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("❌ Invalid email address.");
      } else if (error.code === "auth/user-not-found") {
        alert("❌ No account found with that email.");
      } else {
        alert("❌ Failed to send password reset email.");
      }
    }
  };

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
      onClick={hideLogin}
    />
        <img src={Logo} alt="logo" className="logo-img" />

        <form onSubmit={handleLogin}>
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="forgot" onClick={handleForgotPassword}>
          Forgot password?
        </p>

        {message && (
          <p className={message.startsWith("✅") ? "message-success" : "message-error"}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", fontSize: "15px" }}>
          Don’t have an account?{" "}
          <span onClick={showSignup}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}