import timer from "./timer.js";

const progress = (() => {
    function render(app) {
        const progress = document.createElement('div');
        progress.className = 'progress';
        const progressBar = document.createElement('progress');
        progressBar.className = 'progress-bar';
        progressBar.max = '100';
        progressBar.value = '0';
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        const progressState = {
            saveText: '',
            dotCount: 0,
            increasing: true,
            loadText: '',
            animationId: null
        };
        const dotAnimation = () => {
            if (!progressState.loadText) return;
            progressState.animationId = setTimeout(() => {
                if (!progressState.loadText) return;

                progressState.dotCount += progressState.increasing ? 1 : -1;
                if (progressState.dotCount === 3) progressState.increasing = false;
                if (progressState.dotCount === 1) progressState.increasing = true;

                progressText.textContent = progressState.saveText + progressState.loadText.repeat(progressState.dotCount);
                dotAnimation();
            }, 200);
        };

        progress.appendChild(progressBar);
        progress.appendChild(progressText);

        app.appendChild(progress);

        return {
            set: async (value, text = '', delay = 100, loadText = '') => {
                progressBar.value = value;
                progressState.loadText = loadText;

                if (text) progressState.saveText = text;
                progressText.textContent = progressState.saveText + (loadText ? loadText.repeat(progressState.dotCount) : '');

                if (loadText) {
                    clearTimeout(progressState.animationId);
                    dotAnimation();
                } else {
                    progressState.dotCount = 0;
                    progressState.increasing = true;
                    clearTimeout(progressState.animationId);
                }

                await timer.delay(delay);
                if (value < 100) return;
                await timer.delay(2000);
                progressBar.classList.add('fade-out-noise');
                progressBar.addEventListener('animationend', () => {
                    progressText.classList.add('fade-out-noise');
                    progressText.addEventListener('animationend', () => {
                        clearTimeout(progressState.animationId);
                        progress.remove();
                    });
                });
            }
        }
    }
    return {
        render: render
    }
})();

export default progress;