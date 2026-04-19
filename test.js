const assert = require('assert');
const { modExp } = require('./core/math');
const RSA = require('./core/rsa');
const Signature = require('./core/signature');

console.log("=== RUNNING AUTOMATED TESTS ===\n");

console.log("[1] Testing mathematical core...");
try {
    const p = 61n;
    const q = 53n;
    const n = 3233n;
    const e = 17n;
    const d = 2753n;
    
    const originalMessage = 65n;
    
    const ciphertext = modExp(originalMessage, e, n);
    assert.strictEqual(ciphertext, 2790n, "Math error during encryption!");

    const decrypted = modExp(ciphertext, d, n);
    assert.strictEqual(decrypted, originalMessage, "Math error during decryption!");
    
    console.log("[PASS] Mathematical core works flawlessly.");
} catch (err) {
    console.error("[FAIL] Math test failed:", err.message);
}

console.log("\n[2] Testing PKCS#1 v1.5 and key generation (512 bits)...");
try {
    const keys = RSA.generateKeys(512);
    const text = "KBTU Backend Security Test 2026";
    
    const encrypted = RSA.encrypt(text, keys.publicKey);
    const decrypted = RSA.decrypt(encrypted, keys.privateKey);
    assert.strictEqual(decrypted, text, "Decrypted text does not match the original!");

    const encrypted2 = RSA.encrypt(text, keys.publicKey);
    assert.notStrictEqual(encrypted, encrypted2, "Vulnerability: ciphertexts are identical (random padding failed)!");

    console.log("[PASS] Key generation and PKCS#1 v1.5 work normally.");
} catch (err) {
    console.error("[FAIL] Encryption test failed:", err.message);
}

console.log("\n[3] Testing digital signatures...");
try {
    const keys = RSA.generateKeys(1024);
    const document = "Important contract for one million tenge.";
    const fakeDocument = "Important contract for one billion tenge.";

    const signature = Signature.sign(document, keys.privateKey);
    const isValid = Signature.verify(document, signature, keys.publicKey);
    assert.strictEqual(isValid, true, "Signature failed verification!");

    const isFakeValid = Signature.verify(fakeDocument, signature, keys.publicKey);
    assert.strictEqual(isFakeValid, false, "Critical vulnerability: forged document passed verification!");

    const corruptedSignature = signature.substring(0, signature.length - 4) + "0000";
    const isCorruptedValid = Signature.verify(document, corruptedSignature, keys.publicKey);
    assert.strictEqual(isCorruptedValid, false, "Critical vulnerability: corrupted signature passed verification!");

    console.log("[PASS] Hash-and-Sign scheme securely protects data.");
} catch (err) {
    console.error("[FAIL] Signature test failed:", err.message);
}

console.log("\n=== ALL TESTS COMPLETED ===");