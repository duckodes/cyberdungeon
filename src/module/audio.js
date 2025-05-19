import audioutils from "./audioutils.js";

const audio = (() => {
    const audioUtils = new audioutils();
    function init() {
        BGM();
        FX();
    }
    /**
    * background music
    */
    function BGM() {
        audioUtils.loadBackgroundMusic([
            '../src/audio/bgm/audio1.mp3',
            '../src/audio/bgm/audio2.mp3'
        ]);
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
    * sound effects
    */
    function FX() {
        audioUtils.loadSoundEffect('click1', '../src/audio/click/click1.mp3');
        audioUtils.loadSoundEffect('click2', '../src/audio/click/click2.mp3');
        audioUtils.loadSoundEffect('click3', '../src/audio/click/click3.mp3');
        audioUtils.loadSoundEffect('click4', '../src/audio/click/click4.mp3');
    }
    return {
        init
    }
})();

export default audio;