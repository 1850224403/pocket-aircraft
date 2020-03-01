import { ISound } from "./ISound";

const { ccclass, property } = cc._decorator;

@ccclass
export class Sound extends cc.Component implements ISound {

    protected baseUrl: string = "";

    protected hMusicComp: () => void = null;

    protected curMusic: cc.AudioClip = null;

    protected bgChannel: any = null;

    protected countPlay: number = 0;

    protected isAudioOn: boolean = true;

    protected get countLimit(): number {
        return 9;
    }

    protected hComplete: () => void = null;

    protected loopMap: Map<cc.AudioClip, any> = new Map();

    public get isMusic(): boolean {
        return appContext.userDataStorage.isAudioOn;
    }

    public get isSound(): boolean {
        return appContext.userDataStorage.isAudioOn;
    }

    public get isAudio(): boolean {
        return appContext.userDataStorage.isAudioOn;
    }

    public init(): void {
        this.baseUrl = "";
        this.hComplete = this.reduceSoundCount.bind(this);
        this.hMusicComp = this.delayReplay.bind(this);
        this.isAudioOn = appContext.userDataStorage.isAudioOn;
    }

    public switchAudio(): void {
        appContext.userDataStorage.switchAudio();
        this.switchMusic();
        this.switchSound();
    }

    public switchMusic(): void {
        if (!this.isMusic) {
            this.pauseMusic();
        } else {
            this.recoverMusic();
        }
    }

    public switchSound(): void {
        if (!this.isSound) {
            this.stopAllSound();
        }
    }

    public playSound(audio: cc.AudioClip): void {
        if (!this.isSound) {
            return;
        }

        cc.audioEngine.playEffect(audio, false);
    }

    public playSoundLoop(audio: cc.AudioClip): any {
        if (!this.isSound) {
            return;
        }

        let audioId = cc.audioEngine.playEffect(audio, true);
        this.loopMap.set(audio, audioId);

        return audioId;
    }

    public playSoundLimit(audio: cc.AudioClip, volume: number): void {
        if (!this.isSound) {
            return;
        }

        if (this.countPlay >= this.countLimit) {
            return;
        }

        let audioId = cc.audioEngine.playEffect(audio, false);
        cc.audioEngine.setVolume(audioId, volume)
        cc.audioEngine.setFinishCallback(audioId, this.hComplete);
        this.countPlay++;
    }

    public stopSoundLoop(audio: cc.AudioClip): void {
        let audioId = this.loopMap.get(audio);
        if (audioId == null) {
            console.error("stopSoundLoop> audio ID is nil", audio);
            return;
        }
        cc.audioEngine.stopEffect(audioId);
    }

    protected pauseAllSoundLoop(): void {
        this.loopMap.forEach((audioId, audio) => {
            if (audio == null || !audioId) {
                return;
            }

            cc.audioEngine.pause(audioId);
        });
    }

    public playMusic(audio: cc.AudioClip): void {
        if (!this.isMusic) {
            return;
        }

        this.curMusic = audio;
        this.bgChannel = cc.audioEngine.playMusic(audio, true);
    }

    public stopSound(audio: cc.AudioClip): void {
        let audioId = this.loopMap.get(audio);
        if (audioId == null) {
            console.error("stopSound> audio ID is nil", audio);
            return;
        }
        cc.audioEngine.stopEffect(audioId);
    }

    public stopMusic(): void {
        this.bgChannel != null && cc.audioEngine.stopMusic();
        this.bgChannel = null;
    }

    protected pauseMusic(): void {
        this.bgChannel != null && cc.audioEngine.pause(this.bgChannel);
    }

    protected recoverSoundLoop(): void {
        if (!this.isSound) {
            return;
        }

        this.loopMap.forEach((audioId, audio) => {
            if (!audioId) {
                this.playSoundLoop(audio);
                return;
            }

            cc.audioEngine.resume(audioId);
        });
    }

    protected recoverMusic(): void {
        if (!this.isMusic) {
            return;
        }

        if (this.bgChannel) {
            cc.audioEngine.resumeMusic();
        } else {
            this.curMusic != null && this.playMusic(this.curMusic);
        }
    }

    protected reduceSoundCount(): void {
        this.countPlay--;
        if (this.countPlay < 0) {
            this.countPlay = 0;
        }
    }

    public stopAllSound(): void {
        this.countPlay = 0;
        cc.audioEngine.stopAll();
        this.bgChannel = null;
        this.loopMap.clear();
    }

    protected delayReplay(): void {
        this.scheduleOnce(this.recoverMusic.bind(this), 8e3 * Math.random() + 2e3);
    }
}