const math = (() => {
    // Truncate decimal places
    function truncateDecimal(num, digits) {
        let factor = 10 ** digits;
        return Math.floor(num * factor) / factor;
    }
    return {
        truncateDecimal: truncateDecimal
    }
})();

export default math;