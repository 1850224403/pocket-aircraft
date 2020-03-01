import { UserData } from "./UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export class SoundManager extends cc.Component {
    protected static gameSoundMap: Map<string, cc.AudioClip> = new Map();
    protected static readonly _dic: Map<cc.AudioClip, number> = new Map();

    /**
     * 播放音效 只播放一次
     * @param audioName 音效的名称，在编辑器中的名称
     */
    public static playAudio(audioName: string): void {

        if (!UserData.data.gameSound) {
            return;
        }
        let audioClip: cc.AudioClip = this.getAudioByName(audioName);
        if (audioClip) {
            //关闭正在播放的同种音效
            if (this._dic.has(audioClip)) {
                var id = this._dic.get(audioClip);
                var audio = cc.audioEngine._id2audio[id];
                if (audio != null) {
                    audio.destroy();
                }
            }
            var id = cc.audioEngine.playEffect(audioClip, false);
            this._dic.set(audioClip, id);
            return;
        }
        cc.loader.loadRes("sound/" + audioName, cc.AudioClip, function (err, assets) {
            if (err) {
                cc.error(err);
                return;
            }
            if (!assets) {
                return;
            }
            audioClip = assets;
            SoundManager.gameSoundMap.set(audioName, audioClip);
            var id = cc.audioEngine.playEffect(audioClip, false);
            SoundManager._dic.set(audioClip, id);
        });
    }

    /**
   * 获取音效对应的AudioClip
   * @param audioName 音效的名称，在编辑器中的名称
   */
    protected static getAudioByName(audioName: string): cc.AudioClip {
        if (audioName == null) {
            return;
        }
        return this.gameSoundMap.get(audioName);
    }

    /**
    * 停止播放音效
    * @param audioName 音效的名称，在编辑器中的名称
    */
    public static stop(audioName: string): void {
        var audioClip = this.getAudioByName(audioName);
        if (audioClip == null) {
            return;
        }
        if (this._dic.has(audioClip)) {
            var id = this._dic.get(audioClip);
            var audio = cc.audioEngine._id2audio[id];
            if (audio) {
                audio.stop();
            }
        }
    }

    /**
    * 播放背景音乐
    * @param audioName 
    */
    public static playBGMusic(audioName: string): void {
        if (!UserData.data.gameSound) {
            return;
        }
        let audioClip: cc.AudioClip = this.getAudioByName(audioName);
        if (audioClip) {
            cc.audioEngine.playMusic(audioClip, true);
            return;
        }
        cc.loader.loadRes("sound/" + audioName, cc.AudioClip, function (err, assets) {
            if (err) {
                cc.error(err);
                return;
            }
            if (!assets) {
                return;
            }
            audioClip = assets;
            SoundManager.gameSoundMap.set(audioName, audioClip);
            cc.audioEngine.playMusic(audioClip, true);
        });
    }

    /**
     * 停止播放背景音乐
     * @param audioName 
     */
    public static stopBGMusic(): void {
        cc.audioEngine.stopMusic();
    }

    /**
     * 停止所有正在播放的音效
     */
    public static stopAllAudio(): void {
        cc.audioEngine.stopAll();
    }

}