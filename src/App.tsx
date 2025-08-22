import { useState } from "react";

function SimpleApp() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <label htmlFor="my-input" style={{ display: "block", marginBottom: "0.5rem" }}>
        Enter something:
      </label>
      <input
        type="text"
        id="my-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ padding: "0.5rem", width: "100%" }}
        placeholder="Type here..."
      />
      <p style={{ marginTop: "1rem" }}>
        You typed: <strong>{inputValue}</strong>
      </p>
    </div>
  );
}



export default SimpleApp;
