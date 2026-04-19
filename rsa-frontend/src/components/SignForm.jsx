import { useState } from "react";
import api from "../api";

export default function SignForm({ privateKey }) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  const sign = async () => {
    const res = await api.post("/sign", {
      message,
      privateKey,
    });

    setSignature(res.data.signature);
  };

  return (
    <div className="card">
      <h2>Digital Signature</h2>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sign}>Sign</button>

      {signature && <textarea value={signature} readOnly />}
    </div>
  );
}
