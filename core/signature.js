const { sha256Buffer } = require('../utils/sha256');
const { modExp } = require('./math');

const SHA256_DIGEST_INFO = Buffer.from([
    0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01, 0x05, 0x00, 0x04, 0x20
]);

class Signature {
    static sign(messageText, privateKey) {
        const messageBuffer = Buffer.from(messageText, 'utf8');
        const hash = sha256Buffer(messageBuffer);

        const keySizeBytes = privateKey.keySize / 8;
        const tLen = SHA256_DIGEST_INFO.length + hash.length;
        const psLen = keySizeBytes - tLen - 3;

        if (psLen < 8) {
            throw new Error("Key is too short for SHA-256 signature scheme.");
        }

        const ps = Buffer.alloc(psLen, 0xff);

        const paddedBuffer = Buffer.concat([
            Buffer.from([0x00, 0x01]),
            ps,
            Buffer.from([0x00]),
            SHA256_DIGEST_INFO,
            hash
        ]);

        const paddedBigInt = BigInt('0x' + paddedBuffer.toString('hex'));
        const signatureBigInt = modExp(paddedBigInt, privateKey.d, privateKey.n);

        let hex = signatureBigInt.toString(16);
        return hex.padStart(keySizeBytes * 2, '0');
    }

    static verify(messageText, signatureHex, publicKey) {
        const keySizeBytes = publicKey.keySize / 8;
        const signatureBigInt = BigInt('0x' + signatureHex);
        
        const decryptedBigInt = modExp(signatureBigInt, publicKey.e, publicKey.n);
        
        let hex = decryptedBigInt.toString(16);
        hex = hex.padStart(keySizeBytes * 2, '0');
        const decryptedBuffer = Buffer.from(hex, 'hex');

        if (decryptedBuffer[0] !== 0x00 || decryptedBuffer[1] !== 0x01) {
            return false;
        }

        const zeroIdx = decryptedBuffer.indexOf(0x00, 2);
        if (zeroIdx === -1 || zeroIdx < 10) return false;

        for (let i = 2; i < zeroIdx; i++) {
            if (decryptedBuffer[i] !== 0xff) return false;
        }

        const hashInfo = decryptedBuffer.slice(zeroIdx + 1);
        
        const messageBuffer = Buffer.from(messageText, 'utf8');
        const expectedHash = sha256Buffer(messageBuffer);
        const expectedHashInfo = Buffer.concat([SHA256_DIGEST_INFO, expectedHash]);

        return hashInfo.equals(expectedHashInfo);
    }
}

module.exports = Signature;