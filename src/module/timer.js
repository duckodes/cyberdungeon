const timer = (() => {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    return {
        delay: delay
    }
})();

export default timer;