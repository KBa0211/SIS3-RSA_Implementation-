const { performance } = require('perf_hooks');
const RSA = require('./core/rsa');

console.log("==========================================");
console.log("       PERFORMANCE BENCHMARKS RSA         ");
console.log("==========================================\n");

function runBenchmark(keySize) {
    console.log(`--- Test for ${keySize}-bit key ---`);
    
    const startGen = performance.now();
    const keys = RSA.generateKeys(keySize);
    const endGen = performance.now();
    console.log(`Key generation: ${(endGen - startGen).toFixed(2)} ms`);

    const message = "Test message to measure encryption speed.";

    const startEnc = performance.now();
    let ciphertext = "";
    for(let i = 0; i < 100; i++) {
        ciphertext = RSA.encrypt(message, keys.publicKey);
    }
    const endEnc = performance.now();
    console.log(`Encryption (100 messages): ${(endEnc - startEnc).toFixed(2)} ms`);

    const startDec = performance.now();
    for(let i = 0; i < 100; i++) {
        RSA.decrypt(ciphertext, keys.privateKey);
    }
    const endDec = performance.now();
    console.log(`Decryption (100 messages): ${(endDec - startDec).toFixed(2)} ms\n`);
}

runBenchmark(512);
runBenchmark(1024);
runBenchmark(2048);