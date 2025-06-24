const timer = (() => {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function loop(ms, callback) {
        let isStop = false;

        const stop = () => {
            isStop = true;
        };

        async function update() {
            while (!isStop) {
                await delay(ms);
                if (!isStop) callback();
            }
        }

        update();
        return { stop };
    }
    return {
        delay: delay,
        loop: loop
    }
})();

export default timer;