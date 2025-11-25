import "../components/Home.css";
import Dog from "../components/Dog";
import CalendarWrapper from "../components/CalendarWrapper.jsx";
import Quote from "../components/Quote";
import { Rnd } from "react-rnd";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Login from "../Login";
import Signup from "../Signup";
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Stickynote from "../images/stickynote.png"
import Bakery from "../images/bakery.png"
import Logo from "../images/logo.png"
import House from "../images/home.png"
import { auth } from "../../../FirebaseConfig"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import TextBG from "../images/text-bg.png";
import Wallet from "../images/wallet.png"
import CoinIcon from "../images/coin.png";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  position: "absolute",
  zIndex: 1000,

  backgroundImage: "linear-gradient(to bottom, rgba(227, 187, 102, 0.569), rgba(76, 213, 211, 0.476))",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)"
};



export default function Home({ totalCoins }) {
  const [loginIsVisible, setLoginIsVisible] = useState(false);
  const [loginSignupBttnsAreVisible, setLoginSignupBttnsAreVisible] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const [signupIsVisible, setSignupIsVisible] = useState(false);
  const [quoteBoxIsVisible, setQuoteBoxIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleClickLogin = () => {
    setLoginIsVisible(!loginIsVisible);
    setSignupIsVisible(false);
  };

  const handleClickRegister = () => {
    setSignupIsVisible(!signupIsVisible);
    setLoginIsVisible(false);
  };

  const handleClickCloseIcon = () => {
    setQuoteBoxIsVisible(!quoteBoxIsVisible);

  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoginSignupBttnsAreVisible(true);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Loading...</p>

  const handleClickNotebook = () => {

    /* if (!user) {
         alert("Create account to make a notebook!")
         setSignupIsVisible(true);
         return;
     } */

    navigate("/notebook")
  }





  return (
    <div className="bg-content">
      <div className="navbar">

        <img
          src={House}
          className="house"

        />


        <img
          src={Logo}
          className="logo"
        />


        <img
          src={Bakery}
          className="notebook"
          onClick={handleClickNotebook}

        />
        <div className="big-wallet-container">
          
          <div className="wallet-container">
            <img
              src={Wallet}
              className="wallet-home"
            />
            <img
            src={CoinIcon}
            className="coin_icon"
          />
            <p className="totalcoins">{totalCoins}</p>

          </div>
        </div>

        <img
          src={Stickynote}
          className="sticky-note"
          onClick={handleClickCloseIcon}

        />

      </div>
      <Rnd
        minHeight="150px"
        minWidth="200px"
        style={{
          ...style,
          display: quoteBoxIsVisible ? "flex" : "none",
        }}
        default={{
          x: 10,
          y: 150,
          width: 200,
          height: 200,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <CloseIcon className="close-icon"
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              cursor: "pointer",
              color: '#7e270aff',
              backgroundColor: "#ffb235f8",
              borderRadius: "50%",
              zIndex: "1001",
              width: "20px",
              height: "20px",

            }}
            onClick={() => setQuoteBoxIsVisible(false)}
          />
          <Quote />
        </div>
      </Rnd>


      <CalendarWrapper />
      <Dog />

      <div className="loggedInAs">{user && (<div><p>Logged in as {user.email}</p> <button className="logout-button" onClick={handleLogout}>Logout</button></div>)}</div>

      {loginSignupBttnsAreVisible && !user && (
        <div className="bttn-container">
          <button className="login-button" onClick={handleClickLogin}>Login</button>
          <button className="signup-button" onClick={handleClickRegister}>Signup</button>
        </div>
      )}

      {/* Conditionally render components */}
      {loginIsVisible && (
        <Login
          onSuccess={() => {
            setLoginIsVisible(false);
            setLoginSignupBttnsAreVisible(false); // ← hides buttons
          }}
          hideLogin={() => setLoginIsVisible(false)}
          showSignup={() => setSignupIsVisible(true)}
        />
      )}   {signupIsVisible && <Signup hideSignup={() => setSignupIsVisible(false)} showLogin={() => setLoginIsVisible(true)}
      />}



    </div>
  );
}




