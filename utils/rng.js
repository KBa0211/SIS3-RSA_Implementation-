class CustomRNG {
    constructor() {
        this.state = this.collectEntropy();
    }

    collectEntropy() {
        const now = process.hrtime.bigint();
        const pid = BigInt(process.pid);
        const memory = BigInt(process.memoryUsage().heapUsed);

        let entropy = now ^ (pid << 1n) ^ (memory >> 1n);
        
        entropy ^= (entropy >> 33n);
        entropy *= 0xff51afd7ed558ccdn;
        entropy ^= (entropy >> 33n);
        entropy *= 0xc4ceb9fe1a85ec53n;
        entropy ^= (entropy >> 33n);

        return entropy;
    }

    next() {
        this.state = (this.state * 6364136223846793005n + 1442695040888963407n) & 0xFFFFFFFFFFFFFFFFn;
        return this.state;
    }

    nextByte() {
        const val = (this.next() >> 56n) & 0xFFn;
        return Number(val);
    }

    getBytes(size) {
        const buffer = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            buffer[i] = this.nextByte();
        }
        return buffer;
    }
}

module.exports = CustomRNG;