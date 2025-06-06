class AudioUtils {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.backgroundMusic = [];
        this.currentTrackIndex = 0;
        this.soundEffects = {};
        this.masterVolume = 1.0;
        this.musicVolume = 0.25;
        this.effectVolume = 0.5;
        this.backgroundSource = null;
        this.isPlaying = false;
        this.currentTime = 0; // Track the current playback time
        this.musicGainNode = this.context.createGain();
        this.musicGainNode.gain.value = this.musicVolume * this.masterVolume;
        this.musicGainNode.connect(this.context.destination);
        this.audioCache = new WeakMap();
    }

    async loadBackgroundMusic(urls) {
        this.backgroundMusic = await Promise.all(urls.map(url => this.loadAudio(url)));
    }

    async loadAudio(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        const audioObj = {};
        this.audioCache.set(audioObj, audioBuffer);
        return audioBuffer;
    }

    playBackgroundMusic() {
        if (this.backgroundMusic.length > 0) {
            if (!this.isPlaying) {
                // If music was previously paused, resume from the saved current time
                this.playTrack(this.currentTrackIndex, this.currentTime);
            } else {
                // If music is already playing, do nothing
                return;
            }
        }
    }

    async playTrack(index, startTime = 0) {
        if (this.context.state === "interrupted" || this.context.state === "suspended") {
            await this.context.resume();
            return this.playTrack(index, startTime);
        }

        this.stopCurrentTrack();
        this.currentTrackIndex = index;
        this.backgroundSource = this.context.createBufferSource();
        this.backgroundSource.buffer = this.backgroundMusic[this.currentTrackIndex];

        this.backgroundSource.connect(this.musicGainNode);
        this.backgroundSource.onended = () => {
            if (this.isPlaying) {
                this.playNextTrack();
            }
        };

        // Ensure startTime is valid
        startTime = isFinite(startTime) && startTime >= 0 ? startTime : 0;

        // Start playback from the specified time
        this.backgroundSource.start(0, startTime);
        this.isPlaying = true;

        // Store the current playback time when starting
        this.currentTime = startTime;
        this.backgroundSource.startTime = this.context.currentTime; // Record when playback starts
    }

    pauseBackgroundMusic() {
        if (this.isPlaying) {
            this.stopCurrentTrack();
        }
    }

    stopCurrentTrack() {
        if (this.backgroundSource) {
            // Update currentTime based on how long the track played
            const now = this.context.currentTime;
            const elapsedTime = now - this.backgroundSource.startTime;
            this.currentTime += elapsedTime; // Update currentTime with the elapsed time
            this.backgroundSource.stop();
            this.backgroundSource.disconnect();
            this.isPlaying = false; // Mark as not playing
        }
    }

    playNextTrack() {
        this.stopCurrentTrack();
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.backgroundMusic.length;
        this.playTrack(this.currentTrackIndex);
    }

    async loadSoundEffect(name, url) {
        this.soundEffects[name] = await this.loadAudio(url);
    }

    playSoundEffect(name) {
        if (this.soundEffects[name]) {
            const soundSource = this.context.createBufferSource();
            soundSource.buffer = this.soundEffects[name];
            const gainNode = this.context.createGain();
            gainNode.gain.value = this.effectVolume * this.masterVolume;

            soundSource.connect(gainNode);
            gainNode.connect(this.context.destination);
            soundSource.start(0);
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = volume;
        this.musicGainNode.gain.value = this.musicVolume * this.masterVolume;
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.musicVolume * this.masterVolume;
        }
    }

    setEffectVolume(volume) {
        this.effectVolume = volume;
    }
}

export default AudioUtils;