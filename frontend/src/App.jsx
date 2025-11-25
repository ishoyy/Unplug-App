import axios from "axios";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home"
import List from "./pages/List"
import { db, auth } from "../../FirebaseConfig"
import {
    collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot,
    getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";



function App() {
    const [totalCoins, setTotalCoins] = useState(0);
    const [user] = useAuthState(auth);

    useEffect(() => {
  if (!user) return;

      const userRef = doc(db, "users", user.uid);

      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTotalCoins(data.totalCoins || 0);
        }
      });

      return unsubscribe;
    }, [user]);

  return (
    <div>
      <nav>

        <Routes>
          <Route path="/" element={<Home totalCoins={totalCoins} />} />
          <Route path="/notebook" element={<List totalCoins={totalCoins}/>} />


        </Routes>


      </nav>
    </div>
  )
}

export default App
