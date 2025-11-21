import axios from "axios";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home"
import List from "./pages/List"


function App() {

  return (
    <div>
      <nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notebook" element={<List />} />


        </Routes>


      </nav>
    </div>
  )
}

export default App
