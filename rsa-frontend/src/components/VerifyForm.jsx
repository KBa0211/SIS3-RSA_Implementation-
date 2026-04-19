import { useState } from "react";
import api from "../api";

export default function VerifyForm({ publicKey }) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    const res = await api.post("/verify", {
      message,
      signature,
      publicKey,
    });

    setResult(res.data.isValid);
  };

  return (
    <div className="card">
      <h2>Verify Signature</h2>

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <textarea
        placeholder="Signature"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />

      <button onClick={verify}>Verify</button>

      {result !== null && (
        <h3>{result ? "Valid Signature" : "Invalid Signature"}</h3>
      )}
    </div>
  );
}
