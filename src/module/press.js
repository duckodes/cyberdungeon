const press = (() => {
    function InitShortLongPress(element, longPressDuration = 200) {
        let timer;
        let isLongPress = false;
        let longPress = null;
        let shortPress = null;

        const pointerDown = () => {
            isLongPress = false;
            timer = setTimeout(() => {
                isLongPress = true;
                if (longPress) longPress();
            }, longPressDuration);
        };

        const pointerUp = () => {
            clearTimeout(timer);
            if (!isLongPress && shortPress) shortPress();
        };

        const pointerCancel = () => {
            clearTimeout(timer);
        };

        element.addEventListener('pointerdown', pointerDown);
        element.addEventListener('pointerup', pointerUp);
        element.addEventListener('pointercancel', pointerCancel);
        element.addEventListener('pointerleave', pointerCancel);

        return {
            shortPress: (callback) => { shortPress = callback || (() => { }); },
            longPress: (callback) => { longPress = callback || (() => { }); }
        };
    }
    return {
        InitShortLongPress: InitShortLongPress
    }
})();

export default press;