import AudioUtils from "./audio.utils.js";
import authData from "./auth.data.js";
import math from "./math.js";

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
    async function render(appUtilsRender, languageData) {
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
        const audioDataKey = 'audio';
        const defaultAudioData = {
            MS: 1,
            BG: 0.25,
            FX: 0.5
        }
        let audioData = await authData.getData(audioDataKey);
        if (!audioData) {
            audioData = defaultAudioData;
            authData.setData(audioDataKey, audioData);
        }
        audioUtils.setMasterVolume(audioData.MS);
        audioUtils.setMusicVolume(audioData.BG);
        audioUtils.setEffectVolume(audioData.FX);
        const audioMS = createAudioInput('audio-ms', audioData.MS, languageData.audio.master);
        const audioBG = createAudioInput('audio-bgm', audioData.BG, languageData.audio.bgm);
        const audioFX = createAudioInput('audio-fx', audioData.FX, languageData.audio.fx);
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
        audioFX.input.addEventListener("change", () => {
            audioUtils.playSoundEffect('click1');
        });
        audioFX.input.addEventListener("click", () => {
            audioUtils.playSoundEffect('click1');
        });

        // data
        audioMS.input.addEventListener('change', async e => {
            let audioData = await authData.getData(audioDataKey);
            audioData.MS = math.truncateDecimal(parseFloat(e.target.value), 2);
            authData.setData(audioDataKey, audioData);
        });
        audioBG.input.addEventListener('change', async e => {
            let audioData = await authData.getData(audioDataKey);
            audioData.BG = math.truncateDecimal(parseFloat(e.target.value), 2);
            authData.setData(audioDataKey, audioData);
        });
        audioFX.input.addEventListener('change', async e => {
            let audioData = await authData.getData(audioDataKey);
            audioData.FX = math.truncateDecimal(parseFloat(e.target.value), 2);
            authData.setData(audioDataKey, audioData);
        });
    }
    return {
        init: init,
        render: render,
        registerWindowEvent: registerWindowEvent,
        playSoundEffect: playSoundEffect
    }
})();

export default audioSource;