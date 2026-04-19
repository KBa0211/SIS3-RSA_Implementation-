import { useState } from "react";
import api from "../api";

export default function DecryptForm({ privateKey }) {
  const [ciphertext, setCiphertext] = useState("");
  const [result, setResult] = useState("");

  const decrypt = async () => {
    const res = await api.post("/decrypt", {
      ciphertext,
      privateKey,
    });

    setResult(res.data.message);
  };

  return (
    <div className="card">
      <h2>Decrypt</h2>
      <textarea
        placeholder="Ciphertext"
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
      />

      <button onClick={decrypt}>Decrypt</button>

      {result && <textarea value={result} readOnly />}
    </div>
  );
}
