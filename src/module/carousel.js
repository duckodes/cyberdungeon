const carousel = (() => {
    function render() {
        const infiniteCarousel = document.createElement('div');
        infiniteCarousel.className = 'infinite-carousel';
        document.body.appendChild(infiniteCarousel);
        return infiniteCarousel;
    }
    function add(infiniteCarousel) {
        const carousel = document.createElement('div');
        carousel.className = 'carousel';

        infiniteCarousel.appendChild(carousel);
    }
    return {
        render,
        add
    }
})();

export default carousel;