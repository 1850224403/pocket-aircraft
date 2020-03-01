import { Sound } from "./Sound";
import { WxEvent } from "../../app/WxEvent";
import { AudioEnum } from "../../const/AudioEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export class WXSound extends Sound {

    private scPool: WXChannel[] = [];

    protected get countLimit(): number {
        return 6;
    }

    public init(): void {
        super.init();

        try {
            let self = this;
            let beginCall = function () {
                self.pauseMusic();
                self.pauseAllSoundLoop();
            };
            let endCall = function () {
                self.recoverMusic();
                self.recoverSoundLoop();
            };

            WxEvent.bindData(beginCall, endCall);
            wx.onAudioInterruptionBegin(beginCall);
            wx.onAudioInterruptionEnd(endCall);
            wx.onHide(beginCall);
            wx.onShow(endCall);
            wx.setInnerAudioOption({ mixWithOther: true, obeyMuteSwitch: true });
        } catch (error) {
            console.error(error);
        }
    }

    public playMusic(audio: cc.AudioClip): void {
        if (!this.isMusic) {
            this.curMusic = audio;
        } else if (this.curMusic == audio && this.bgChannel) {
            this.bgChannel.play();
        } else {
            if (!this.bgChannel) {
                this.bgChannel = wx.createInnerAudioContext();
            }
            if (!this.curMusic) {
                this.curMusic = audio;
            }
            this.bgChannel.loop = true;
            this.bgChannel.autoplay = true;
            this.bgChannel.src = this.baseUrl + this.curMusic.url;
            // FIMEX:会导致第一次无声音
            //this.bgChannel.stop();
            this.bgChannel.volume = 0.2;
            this.bgChannel.play();
        }
    }

    public stopMusic(): void {
        this.bgChannel && this.bgChannel.pause();
        this.curMusic = null;
    }

    public playSound(audio: cc.AudioClip): void {
        this.playSoundLimit(audio, 1);
    }

    public playSoundLoop(audio: cc.AudioClip): any {
        if (!this.isSound) {
            return;
        }

        if (!audio) {
            console.error("audio url is null");
            return;
        }

        console.info("playSoundLoop");
        let audioID = this.loopMap.get(audio);
        if (!audioID) {
            audioID = wx.createInnerAudioContext();
            audioID.src = this.baseUrl + audio.url;
            audioID.loop = true;
            audioID.autoplay = true;
            this.loopMap.set(audio, audioID);
        }

        audioID.play();
        return audioID;
    }

    public playSoundLimit(audio: cc.AudioClip, volume: number): void {
        if (this.countPlay >= this.countLimit || !this.isSound) {
            return;
        }

        if (!audio) {
            console.error("audio is null");
            return;
        }

        let target: WXChannel = null;
        let length = this.scPool.length;
        for (let i = 0; i < length; i++) {
            let data = this.scPool[i];
            if (!data || !data.isEnd) {
                continue;
            }

            target = data;
            break;
        }

        if (!target && length < this.countLimit) {
            target = new WXChannel(this.reduceSoundCount.bind(this));
            this.scPool.push(target);
        }

        target && target.play(this.baseUrl + audio.url, volume);
        this.countPlay++;
    }

    public stopSoundLoop(audio: cc.AudioClip): void {
        let sound = this.loopMap.get(audio);
        let now = Date.now();
        console.info("stopSoundLoop>", now, "sound:", !!sound, "url:", audio);
        if (!sound) {
            console.error("stopSoundLoop> sound is nil", audio);
            return;
        }
        sound.stop();
        this.loopMap.delete(audio);
    }

    protected pauseMusic(): void {
        this.bgChannel && this.bgChannel.pause();
    }

    protected recoverMusic(): void {
        if (!this.isMusic) {
            return;
        }

        this.bgChannel && this.bgChannel.play();
        if (!this.bgChannel) {
            gameContext.audioManager.playBgMusic(AudioEnum.BACKGROUND);
        }
    }

    protected recoverSoundLoop(): void {
        if (!this.isSound) {
            return;
        }
        let now = Date.now();
        this.loopMap.forEach((sound, audio) => {
            console.info("recoverSoundLoop>", now, "sound:", !!sound, "url:", audio);
            if (!sound) {
                this.playSoundLoop(audio);
                return;
            }

            sound.play();
        });
    }

    protected pauseAllSoundLoop(): void {
        let now = Date.now();
        this.loopMap.forEach((sound, audio) => {
            console.info("pauseAllSoundLoop>", now, "sound:", !!sound, "url:", audio);
            if (!sound) {
                return;
            }

            sound.pause();
            sound.stop();
        });
    }

    protected stopAllSoundLoop(): void {
        if (!this.isSound) {
            return;
        }

        this.loopMap.forEach((sound, audio) => {
            if (!sound) {
                return;
            }

            sound.pause();
            sound.stop();
        });
        this.loopMap.clear();
    }

    public stopAllSound(): void {
        this.stopMusic();
        this.stopAllSoundLoop();
    }
}

class WXChannel {

    private static ID: number = 0;

    public isEnd = false;

    public hComp: () => void = null;

    public ad: any = null;

    public id: number = 0;

    public constructor(hComp: () => void) {
        this.hComp = hComp;
        this.id = ++WXChannel.ID;
        this.ad = wx.createInnerAudioContext();
        this.ad.onEnded(this.end.bind(this));
    }
    private end(r): void {
        if (this.isEnd) {
            return;
        }

        this.isEnd = true;
        this.hComp && this.hComp();
    }

    public play(url: string, volume: number): void {
        this.isEnd = false;
        if (!this.ad) {
            this.ad = wx.createInnerAudioContext();
            this.ad.onEnded(this.end.bind(this));
        }
        this.ad.src = url;
        this.ad.stop();
        this.ad.volume = volume;
        volume != 0 && this.ad.play();
        setTimeout(this.end.bind(this), 2e3);
    }
}