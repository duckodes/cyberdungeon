const mathForC = (() => {
    /**
     * Truncate decimal places
     * @param {*} num decimal numbers
     * @param {*} digits directly truncate the last few decimal places
     */
    function truncateDecimal(num, digits) {
        let factor = 10 ** digits;
        return Math.floor(num * factor) / factor;
    }
})();