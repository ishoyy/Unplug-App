import { useState, useEffect } from "react";
import "../components/Quote.css";
export default function Quote() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [isVisible, setIsVisible] = useState(true);


  useEffect(() => {
    fetch("http://api.quotable.io/random?maxLength=100")
      .then(res => res.json())
      .then(data => {
        setQuote(data.content)
        setAuthor(data.author)
      })
      .catch(err => {
        console.error("Error fetching quote:", err);
      });
  }, []);


  return (
    <div className="quote">
      <p style={{ fontFamily: "courier", fontSize: "1rem", fontStyle: "italic" }}>
        "{quote}"
      </p>
      <p style={{ fontFamily: "courier", fontWeight: "bold" }}>
        — {author}
      </p>
    </div>
  );
}
