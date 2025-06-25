const math = (() => {
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
    /**
     * Weighted Random Selection (flatten nested sturcture into flattened key names)
     */
    function weightedRandomFlat(data) {
        function flattenData(data, prefix = "") {
            let flat = {};
            for (let key in data) {
                let value = data[key];
                let fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === "object" && value !== null) {
                    Object.assign(flat, flattenData(value, fullKey));
                } else {
                    flat[fullKey] = value;
                }
            }
            return flat;
        }

        let flatData = flattenData(data);
        let entries = Object.entries(flatData);
        let totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
        if (totalWeight === 0) return null;

        let rand = Math.random() * totalWeight;
        for (let [key, weight] of entries) {
            if (rand < weight) return key;
            rand -= weight;
        }
        return null;
    }
    return {
        weightedRandom: weightedRandom,
        weightedRandomFlat: weightedRandomFlat
    }
})();

export default math;