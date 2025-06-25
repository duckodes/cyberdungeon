const wasmUtils = (() => {
    async function math() {
        const importObject = {
            env: {
                Math_random: Math.random,
                Math_pow: Math.pow,
                Math_floor: Math.floor
            }
        };
        const response = await WebAssembly.instantiateStreaming(
            fetch('../c2wasm/wasm/math.wasm'),
            importObject
        );
        return {
            response: response
        }
    }
    return {
        math: math
    }
})();

const wasm = {
    math: (await wasmUtils.math()).response.instance.exports
}

export default wasm;