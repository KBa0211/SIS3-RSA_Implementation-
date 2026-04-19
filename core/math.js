const CustomRNG = require('../utils/rng');
const rng = new CustomRNG();

function gcd(a, b) {
    while (b !== 0n) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function extendedGCD(a, b) {
    let old_r = a, r = b;
    let old_s = 1n, s = 0n;
    let old_t = 0n, t = 1n;

    while (r !== 0n) {
        let quotient = old_r / r;
        
        let temp_r = r;
        r = old_r - quotient * r;
        old_r = temp_r;

        let temp_s = s;
        s = old_s - quotient * s;
        old_s = temp_s;

        let temp_t = t;
        t = old_t - quotient * t;
        old_t = temp_t;
    }
    return { gcd: old_r, x: old_s, y: old_t };
}

function modExp(base, exponent, modulus) {
    let result = 1n;
    base = base % modulus;
    
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent / 2n;
        base = (base * base) % modulus;
    }
    return result;
}

function generateRandomBigInt(bits) {
    const bytesCount = bits / 8;
    const buf = rng.getBytes(bytesCount);
    
    buf[0] |= 0x80;
    buf[buf.length - 1] |= 0x01;
    
    let hexString = '0x';
    for (let i = 0; i < buf.length; i++) {
        hexString += buf[i].toString(16).padStart(2, '0');
    }
    return BigInt(hexString);
}

function millerRabin(n, k) {
    if (n === 2n || n === 3n) return true;
    if (n <= 1n || n % 2n === 0n) return false;

    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
        d /= 2n;
        r++;
    }

    for (let i = 0; i < k; i++) {
        let a = 2n + (generateRandomBigInt(256) % (n - 3n));
        let x = modExp(a, d, n);
        
        if (x === 1n || x === n - 1n) continue;

        let isComposite = true;
        for (let j = 1n; j < r; j++) {
            x = modExp(x, 2n, n);
            if (x === n - 1n) {
                isComposite = false;
                break;
            }
        }
        
        if (isComposite) return false;
    }
    return true;
}

function generatePrime(bits) {
    const k = bits >= 1024 ? 64 : 40; 
    
    while (true) {
        let candidate = generateRandomBigInt(bits);
        if (millerRabin(candidate, k)) {
            return candidate;
        }
    }
}

module.exports = {
    gcd,
    extendedGCD,
    modExp,
    generatePrime
};