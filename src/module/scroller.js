const scroller = (() => {
    const scrollPosition = {
        x: 0,
        y: 0
    };
    function savePosition(element) {
        scrollPosition.x = element.scrollLeft;
        scrollPosition.y = element.scrollTop;
    }
    async function resetPosition(element) {
        await timer.delay(1);
        element.scrollLeft = scrollPosition.x;
        element.scrollTop = scrollPosition.y;
    }
    function to(element, behavior, block) {
        element.scrollIntoView({ behavior: behavior, block: block });
    }
    return {
        savePosition: savePosition,
        resetPosition: resetPosition,
        to: to
    }
})();

export default scroller;