const noiseText = (() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = 50);
    let H = (canvas.height = 50);

    const imgCv = document.createElement("canvas");
    const imgCtx = imgCv.getContext("2d");
    const imgText = new Image();

    let noiseRange = 5;
    let start = true;

    function render(text, textColor, parent) {
        drawText(text, textColor);
        setImageCanvas(parent);

        imgText.onload = function () {
            if (start) {
                animation();
                start = false;
            }
        };
    }

    function drawText(text, textColor) {
        ctx.clearRect(0, 0, W, H);

        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.shadowColor = textColor;
        ctx.shadowBlur = 10;
        ctx.font = `bold ${H / 2}px "Arial"`;
        ctx.fillStyle = "#fff";
        ctx.fillText(text, W / 2, H / 2);

        changeImg();
    }

    function changeImg() {
        let imgPngUrl = canvas.toDataURL();
        imgText.src = imgPngUrl;
    }

    function setImageCanvas(parent) {
        imgCv.setAttribute("width", W);
        imgCv.setAttribute("height", H);
        parent.appendChild(imgCv);
    }

    function initAnimation() {
        imgCtx.clearRect(0, 0, W, H);
        effectVibe();
    }

    function effectVibe() {
        for (let i = 0; i < H; i += 2) {
            let randomPos = Math.floor(Math.random() * noiseRange);
            imgCtx.drawImage(imgText, 0, i, W, 1, randomPos, i, W, 1);
        }
    }

    function animation() {
        function animationLoop() {
            initAnimation();
            requestAnimationFrame(animationLoop);
        }
        animationLoop();
    }

    window.requestAnimationFrame = (function () {
        return (
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    })();
    return {
        render: render,
        setNoise: (value) => {
            noiseRange = value;
        }
    }
})();

export default noiseText;