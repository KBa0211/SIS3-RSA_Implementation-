import { useState } from "react";
import KeyGenerator from "./components/KeyGenerator";
import EncryptForm from "./components/EncryptForm";
import DecryptForm from "./components/DecryptForm";
import SignForm from "./components/SignForm";
import VerifyForm from "./components/VerifyForm";

export default function App() {
  const [keys, setKeys] = useState(null);

  return (
    <div className="container">
      <h1>RSA Cryptography System</h1>

      <KeyGenerator setKeys={setKeys} />

      {keys && (
        <>
          <EncryptForm publicKey={keys.publicKey} />
          <DecryptForm privateKey={keys.privateKey} />
          <SignForm privateKey={keys.privateKey} />
          <VerifyForm publicKey={keys.publicKey} />
        </>
      )}
    </div>
  );
}
