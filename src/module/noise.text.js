import timer from "./timer.js";

const noiseText = (() => {
    function render(text, textColor, parent) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let W = (canvas.width = 50);
        let H = (canvas.height = Math.max(Math.min(window.innerWidth / 8, 70), 30));

        const imgCv = document.createElement("canvas");
        const imgCtx = imgCv.getContext("2d");
        const imgText = new Image();

        let noiseRange = 5;
        let start = true;
        W = String(text).length * (H / 2);
        canvas.width = W;
        drawText(text, textColor);
        setImageCanvas(parent);

        imgText.onload = function () {
            if (start) {
                animation();
                start = false;
            }
        };
        window.addEventListener('resize', () => {
            H = (canvas.height = Math.max(Math.min(window.innerWidth / 8, 70), 30));
            drawText(text, textColor);
        });

        function drawText(text, textColor) {
            ctx.clearRect(0, 0, W, H);

            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.shadowColor = textColor;
            ctx.shadowBlur = 10;
            ctx.font = `bold ${H / 2}px "Arial"`;
            ctx.fillStyle = "#fff";
            ctx.fillText(text, W / 2, H / 2 + (H / 16));

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
            drawText: drawText,
            setNoise: (value) => {
                noiseRange = value;
            }
        }
    }
    function renderTyping(text, textColor, parent, speed, maxNoise, startText = 1, typeWhiteSpace = false) {
        let displayTextLength = startText;
        let currentNoise = maxNoise;
        const typeNoise = render(text, textColor, parent);
        const noiseLoop = timer.loop(speed, async () => {
            if (displayTextLength > text.length) {
                noiseLoop.stop();
                typeNoise.drawText(text.substring(0, displayTextLength), '#68aca3');
                typeNoise.setNoise(2);
                return;
            }
            if (currentNoise < 1 || !typeWhiteSpace && /^\s+$/.test(text.substring(displayTextLength - 1, displayTextLength))) {
                displayTextLength++;
                currentNoise = maxNoise;
                return;
            }
            typeNoise.drawText(text.substring(0, displayTextLength), '#68aca3');
            typeNoise.setNoise(currentNoise);
            currentNoise--;
        });
    }
    return {
        render: render,
        renderTyping: renderTyping
    }
})();

export default noiseText;