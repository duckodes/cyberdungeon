const math = (() => {
    /**
     * Truncate decimal places
     * @param {*} num decimal numbers
     * @param {*} digits directly truncate the last few decimal places
     */
    function truncateDecimal(num, digits) {
        let factor = 10 ** digits;
        return Math.floor(num * factor) / factor;
    }
    /**
     * min ~ max - 1
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * min ~ max
     */
    function getRandomIntIncludeMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
     * min ~ max
     */
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    /**
     * get random bool
     */
    function getRandomBool() {
        return Math.random() < 0.5;
    }
    /**
     * Weighted Random Selection
     */
    function weightedRandom(data) {
        let entries = Object.entries(data);
        let weightedArray = [];

        entries.forEach(([key, weight]) => {
            for (let i = 0; i < weight; i++) {
                weightedArray.push(key);
            }
        });

        let randomIndex = Math.floor(Math.random() * weightedArray.length);
        return weightedArray[randomIndex];
    }
    return {
        truncateDecimal: truncateDecimal,
        getRandomInt: getRandomInt,
        getRandomIntIncludeMax: getRandomIntIncludeMax,
        getRandomFloat: getRandomFloat,
        getRandomBool: getRandomBool,
        weightedRandom: weightedRandom
    }
})();

export default math;