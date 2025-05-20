import AudioUtils from "./audio.utils.js";

const audioSource = (() => {
    const audioUtils = new AudioUtils();
    function init() {
        BGM();
        FX();
    }
    function registerWindowEvent() {
        window.addEventListener('focus', () => {
            audioUtils.isPlaying = false;
        });
        window.addEventListener('blur', () => {
            audioUtils.pauseBackgroundMusic();
        });
        window.addEventListener('click', () => {
            audioUtils.playBackgroundMusic();
        });
    }
    /**
    * Load background music source
    */
    function BGM() {
        audioUtils.loadBackgroundMusic([
            '../src/audio/bgm/audio1.mp3',
            '../src/audio/bgm/audio2.mp3'
        ]);
    }
    /**
    * Load sound effects source
    */
    function FX() {
        audioUtils.loadSoundEffect('click1', '../src/audio/click/click1.mp3');
        audioUtils.loadSoundEffect('click2', '../src/audio/click/click2.mp3');
        audioUtils.loadSoundEffect('click3', '../src/audio/click/click3.mp3');
        audioUtils.loadSoundEffect('click4', '../src/audio/click/click4.mp3');
    }
    function playSoundEffect(name) {
        audioUtils.playSoundEffect(name);
    }
    function render(appUtilsRender, languageData) {
        const createAudioInput = (id, value, text) => {
            const input = document.createElement('input');
            input.className = 'audio-slider';
            input.id = id;
            input.type = 'range';
            input.max = '1';
            input.step = 'any';
            input.value = value;
            const label = document.createElement('label');
            label.className = 'audio-label';
            label.htmlFor = id;
            label.textContent = text;
            const div = document.createElement('div');
            div.textContent = value * 100;
            label.appendChild(input);
            label.appendChild(div);
            appUtilsRender.settings.appendChild(label);
            return {
                input: input,
                div: div
            };
        }
        const audioMS = createAudioInput('audio-ms', '1', languageData.audio.master);
        const audioBG = createAudioInput('audio-bgm', '0.25', languageData.audio.bgm);
        const audioFX = createAudioInput('audio-fx', '0.5', languageData.audio.fx);
        audioMS.input.addEventListener("input", e => {
            audioUtils.setMasterVolume(e.target.value);
            audioMS.div.textContent = parseInt(e.target.value * 100);
        });
        audioBG.input.addEventListener("input", e => {
            audioUtils.setMusicVolume(e.target.value);
            audioBG.div.textContent = parseInt(e.target.value * 100);
        });
        audioFX.input.addEventListener("input", e => {
            audioUtils.setEffectVolume(e.target.value);
            audioFX.div.textContent = parseInt(e.target.value * 100);
        });
        audioFX.input.addEventListener("click", () => {
            audioUtils.playSoundEffect('click1');
        })
    }
    return {
        init: init,
        render: render,
        registerWindowEvent: registerWindowEvent,
        playSoundEffect: playSoundEffect
    }
})();

export default audioSource;