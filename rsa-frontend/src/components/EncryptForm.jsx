import { useState } from "react";
import api from "../api";

export default function EncryptForm({ publicKey }) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const encrypt = async () => {
    const res = await api.post("/encrypt", {
      message,
      publicKey,
    });

    setResult(res.data.ciphertext);
  };

  return (
    <div className="card">
      <h2>Encrypt</h2>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={encrypt}>Encrypt</button>

      {result && <textarea value={result} readOnly />}
    </div>
  );
}
