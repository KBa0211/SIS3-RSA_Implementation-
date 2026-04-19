import { useState } from "react";
import api from "../api";

export default function KeyGenerator({ setKeys }) {
  const [size, setSize] = useState(1024);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);
      const res = await api.post("/generate-keys", {
        keySize: Number(size),
      });

      setKeys({
        publicKey: res.data.publicKey,
        privateKey: res.data.privateKey,
      });
    } catch (e) {
      alert("Key generation error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Keys</h2>
      <select value={size} onChange={(e) => setSize(e.target.value)}>
        <option value="512">512</option>
        <option value="1024">1024</option>
        <option value="2048">2048</option>
      </select>

      <button onClick={generate}>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
