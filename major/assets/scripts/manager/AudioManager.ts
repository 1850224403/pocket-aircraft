import { AudioPathEnum } from "../const/ResPathEnum";
import { AudioEnum } from "../const/AudioEnum";
import { LogUtil } from "../util/LogUtil";
import { RoleData } from "../data/RoleData";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-20 10:30:06 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-17 15:57:14
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class AudioManager {

    private _roleAudio: cc.AudioClip = null;

    private _roleAudioType: AudioEnum = null;

    private _bgMusic: cc.AudioClip = null;

    private _bgMusicType: AudioEnum = null;

    public init(): void {
        this._roleAudioType = null;
        this._roleAudio = null;
        this._bgMusic = null;
        this._bgMusicType = null;
        this.playBgMusic(AudioEnum.HALL_MUSIC);
    }

    public playTempAudio(roleData: RoleData, audioType: AudioEnum): void {
        //在屏幕外不播放
        if (roleData && roleData.id !== 1) {
            let inScreen = gameContext.cameraManager.isInScreen(roleData.pos);
            if (!inScreen) return;
        }
        let resPath = null;
        switch (audioType) {
            case AudioEnum.COUNT_DOWN:
                resPath = AudioPathEnum.COUNT_DOWN;
                break;

            case AudioEnum.COIN:
                resPath = AudioPathEnum.COIN;
                break;

            case AudioEnum.COLLISION:
                resPath = AudioPathEnum.COLLISION;
                break;

            case AudioEnum.HORN:
                resPath = AudioPathEnum.MOVE;
                break;

            case AudioEnum.PASS_LEVEL:
                resPath = AudioPathEnum.PASS_LEVEL;
                break;

            case AudioEnum.THROTTLE:
                resPath = AudioPathEnum.THROTTLE;
                break;

            case AudioEnum.EXPLODE:
                resPath = AudioPathEnum.EXPLODE;
                break;

            case AudioEnum.LOW_NITROGEN:
                resPath = AudioPathEnum.LOW_NITROGEN;
                break;

            case AudioEnum.HIGH_NITROGEN:
                resPath = AudioPathEnum.HIGH_NITROGEN;
                break;

            default:
                LogUtil.err('no audio type ', audioType);
                break;
        }
        let audio = appContext.resourcesManager.getAudio(resPath);
        if (!audio) {
            console.error("audio is niu", resPath);
            return;
        }
        appContext.mainAudioManager.playSound(audio);
    }

    public playRoleAudio(audioType: AudioEnum, isLoop: boolean): void {
        let resPath = null;
        if (this._roleAudioType === audioType) return;
        this._roleAudioType = audioType;

        switch (audioType) {

            case AudioEnum.SPEED_UP:
                resPath = AudioPathEnum.SPEED_UP;
                break;

            case AudioEnum.START_UP:
                resPath = AudioPathEnum.START_UP;
                break;

            case AudioEnum.MOVE:
                resPath = AudioPathEnum.MOVE;
                break;

            default:
                LogUtil.err('no audio type ', audioType);
                break;
        }
        this.stopRoleAudio();
        let audio = appContext.resourcesManager.getAudio(resPath);
        if (!audio) {
            console.error("playRoleAudio> audio is nil", resPath);
            return;
        }
        if (isLoop) {
            appContext.mainAudioManager.playLoopSound(audio);
        } else {
            appContext.mainAudioManager.playSound(audio);
        }
        this._roleAudio = audio;
    }

    public stopRoleAudio(): void {
        if (!this._roleAudio) {
            return;
        }

        appContext.mainAudioManager.stopSoundLoop(this._roleAudio);
        this._roleAudioType = null;
    }

    public playBgMusic(audioType: AudioEnum): void {
        let resPath = null;
        switch (audioType) {

            case AudioEnum.HALL_MUSIC:
                resPath = AudioPathEnum.HALL_MUSIC;
                break;

            case AudioEnum.BACKGROUND:
                resPath = AudioPathEnum.BACKGROUND;
                break;

            default:
                LogUtil.err('no audio type ', audioType);
                break;
        }
        appContext.mainAudioManager.stopMusic();
        let audio = appContext.resourcesManager.getAudio(resPath);
        if (!audio) {
            console.error("backgroundAudio audio is nil");
            return;
        }
        appContext.mainAudioManager.playMusic(audio);
        this._bgMusic = audio;
    }

    public resumeBgMusic(): void {
        this._bgMusicType !== null && this.playBgMusic(this._bgMusicType);
    }

    public closeAudio(): void {
        appContext.mainAudioManager.stopAllSound();
    }

    public switchAudio(): void {
        appContext.mainAudioManager.switchAudio();
    }
}
