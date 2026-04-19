const { extendedGCD, modExp, generatePrime, gcd } = require('./math');
const CustomRNG = require('../utils/rng');

const rng = new CustomRNG();

class RSA {
    static generateKeys(keySize) {
        const primeSize = keySize / 2;
        
        console.log(`Generating p (${primeSize} bits)... this may take a moment`);
        const p = generatePrime(primeSize);
        
        console.log(`Generating q (${primeSize} bits)...`);
        let q;
        do {
            q = generatePrime(primeSize);
        } while (p === q);

        const n = p * q;
        const phi = (p - 1n) * (q - 1n);
        let e = 65537n;
        
        if (gcd(e, phi) !== 1n) {
             throw new Error("Key generation failed: gcd(e, phi) != 1. Please try again.");
        }

        const { x } = extendedGCD(e, phi);
        
        let d = x % phi;
        if (d < 0n) {
            d += phi;
        }

        return {
            publicKey: { e, n, keySize },
            privateKey: { d, n, p, q, keySize }
        };
    }

    static encryptBasic(messageBigInt, publicKey) {
        return modExp(messageBigInt, publicKey.e, publicKey.n);
    }

    static decryptBasic(ciphertextBigInt, privateKey) {
        return modExp(ciphertextBigInt, privateKey.d, privateKey.n);
    }

    static padPKCS1_v1_5(messageBuffer, keySizeBytes) {
        if (messageBuffer.length > keySizeBytes - 11) {
            throw new Error("Message is too long for the given key size.");
        }

        const psLen = keySizeBytes - messageBuffer.length - 3;
        const ps = Buffer.alloc(psLen);
        
        for (let i = 0; i < psLen; i++) {
            let r;
            do {
                r = rng.nextByte();
            } while (r === 0);
            ps[i] = r;
        }

        const paddedBuffer = Buffer.concat([
            Buffer.from([0x00, 0x02]),
            ps,
            Buffer.from([0x00]),
            messageBuffer
        ]);

        return BigInt('0x' + paddedBuffer.toString('hex'));
    }

    static unpadPKCS1_v1_5(paddedBigInt, keySizeBytes) {
        let hex = paddedBigInt.toString(16);
        hex = hex.padStart(keySizeBytes * 2, '0');
        const padded = Buffer.from(hex, 'hex');

        if (padded[0] !== 0x00 || padded[1] !== 0x02) {
            throw new Error("Decryption error: Invalid PKCS#1 v1.5 padding format.");
        }

        const zeroIdx = padded.indexOf(0x00, 2);
        if (zeroIdx === -1 || zeroIdx < 10) {
            throw new Error("Decryption error: Padding separator not found or invalid.");
        }

        return padded.slice(zeroIdx + 1);
    }

    static encrypt(messageText, publicKey) {
        const messageBuffer = Buffer.from(messageText, 'utf8');
        const keySizeBytes = publicKey.keySize / 8;
        
        const paddedBigInt = this.padPKCS1_v1_5(messageBuffer, keySizeBytes);
        const ciphertextBigInt = this.encryptBasic(paddedBigInt, publicKey);
        
        let hex = ciphertextBigInt.toString(16);
        return hex.padStart(keySizeBytes * 2, '0');
    }

    static decrypt(ciphertextHex, privateKey) {
        const keySizeBytes = privateKey.keySize / 8;
        const ciphertextBigInt = BigInt('0x' + ciphertextHex);
        
        const decryptedBigInt = this.decryptBasic(ciphertextBigInt, privateKey);
        
        const messageBuffer = this.unpadPKCS1_v1_5(decryptedBigInt, keySizeBytes);
        return messageBuffer.toString('utf8');
    }
}

module.exports = RSA;