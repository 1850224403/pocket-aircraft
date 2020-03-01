import { Sound } from "./Sound";

const { ccclass, property } = cc._decorator;

@ccclass
export class WebSound extends Sound {

    public init(): void {
        super.init();
    }

    public playSoundLimit(audio: cc.AudioClip, volume: number): void {
        if (!this.isSound) {
            return;
        }

        let audioId = cc.audioEngine.playEffect(audio, false);
        cc.audioEngine.setVolume(audioId, volume)
        cc.audioEngine.setFinishCallback(audioId, this.hComplete);
        this.countPlay++;
    }

}
