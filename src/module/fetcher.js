const fetcher = (() => {
    async function load(path) {
        return (await fetch(path)).json();
    }

    return {
        load: load
    }
})();

export default fetcher;