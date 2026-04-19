const express = require('express');
const cors = require('cors');
const RSA = require('./core/rsa');
const Signature = require('./core/signature');

BigInt.prototype.toJSON = function() { return this.toString(); }

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/api/generate-keys', (req, res) => {
    try {
        const { keySize = 1024 } = req.body;
        console.log(`[API] Key generation request: ${keySize} bits`);
        
        const keys = RSA.generateKeys(keySize);
        
        res.json({
            success: true,
            publicKey: {
                e: keys.publicKey.e.toString(),
                n: keys.publicKey.n.toString(),
                keySize: keys.publicKey.keySize
            },
            privateKey: {
                d: keys.privateKey.d.toString(),
                n: keys.privateKey.n.toString(),
                keySize: keys.privateKey.keySize
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/encrypt', (req, res) => {
    try {
        const { message, publicKey } = req.body;
        
        const pubKeyParsed = {
            e: BigInt(publicKey.e),
            n: BigInt(publicKey.n),
            keySize: publicKey.keySize
        };

        const ciphertextHex = RSA.encrypt(message, pubKeyParsed);
        res.json({ success: true, ciphertext: ciphertextHex });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/decrypt', (req, res) => {
    try {
        const { ciphertext, privateKey } = req.body;
        
        const privKeyParsed = {
            d: BigInt(privateKey.d),
            n: BigInt(privateKey.n),
            keySize: privateKey.keySize
        };

        const message = RSA.decrypt(ciphertext, privKeyParsed);
        res.json({ success: true, message });
    } catch (error) {
        res.status(400).json({ success: false, error: "Decryption failed. Verify key or data integrity." });
    }
});

app.post('/api/sign', (req, res) => {
    try {
        const { message, privateKey } = req.body;
        
        const privKeyParsed = {
            d: BigInt(privateKey.d),
            n: BigInt(privateKey.n),
            keySize: privateKey.keySize
        };

        const signatureHex = Signature.sign(message, privKeyParsed);
        res.json({ success: true, signature: signatureHex });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/verify', (req, res) => {
    try {
        const { message, signature, publicKey } = req.body;
        
        const pubKeyParsed = {
            e: BigInt(publicKey.e),
            n: BigInt(publicKey.n),
            keySize: publicKey.keySize
        };

        const isValid = Signature.verify(message, signature, pubKeyParsed);
        res.json({ success: true, isValid });
    } catch (error) {
        res.status(400).json({ success: false, isValid: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend is running at http://localhost:${PORT}`);
    console.log(`Waiting for requests...`);
});