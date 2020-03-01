import { WebSound } from "./WebSound";
import { Sound } from "./Sound";
import { WXSound } from "./WXSound";
import { Util } from "../../util/Util";
import { LogUtil } from "../../util/LogUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class MainAudioManager extends cc.Component {

    private webSound: WebSound = null;

    private wxSound: WXSound = null;

    public get sound(): Sound {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!this.wxSound) {
                this.wxSound = Util.createComp(this.node, "WXSound", WXSound);
            }

            return this.wxSound;
        }

        if (!this.webSound) {
            this.webSound = Util.createComp(this.node, "WebSound", WebSound);
        }

        return this.webSound;
    }

    public onLoad(): void {
        this.sound.init();
    }

    public createAudio(audioPath: cc.AudioClip): void {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }

        if (!audioPath) {
            console.error("audio url is null");
            return;
        }

        this.sound.playSoundLimit(audioPath, 0);
    }

    public playMusic(musicPath: cc.AudioClip): void {
        this.sound.playMusic(musicPath);
    }

    public stopMusic(): void {
        this.sound.stopMusic();
    }

    public switchAudio(): void {
        this.sound.switchAudio();
    }

    public switchMusic(): void {
        this.sound.switchMusic();
    }

    public switchSound(): void {
        this.sound.switchSound();
    }

    public playSound(soundPath: cc.AudioClip): void {
        // TODO:判断开关
        if (!this.sound.isSound) {
            return;
        }

        this.sound.playSound(soundPath);
    }

    public playSoundWithVolume(soundPath: cc.AudioClip, volume: number, isForce: boolean = false): void {
        // TODO:判断开关
        // if (!开关) {
        //     return;
        // }

        // let volume = this.calcateVolume(distance, isForce);
        let sound = this.sound.playSoundLimit(soundPath, volume);
    }

    private maxDistance: number = 150;

    private calcateVolume(distance: number, isForce: boolean = false): number {
        let volume = 1 - distance / this.maxDistance;
        if (isForce) {
            volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
        } else {
            volume = volume < 0.1 ? 0.1 : volume > 1 ? 1 : volume;
        }
        return volume;
    }

    public playLoopSound(audio: cc.AudioClip): void {
        this.sound.playSoundLoop(audio);
    }

    public stopSoundLoop(audio: cc.AudioClip): void {
        this.sound.stopSoundLoop(audio);
    }

    public stopAllSound(): void {
        this.sound.stopAllSound();
    }
}