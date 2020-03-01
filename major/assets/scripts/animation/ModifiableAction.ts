import { Clip } from "./Clip";
import { WorldEventManager } from "../../gamecommon/Script/GameCommon/WorldEventManager";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-07 16:04:28 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-10 14:08:49
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class ModifiableAction extends cc.Component {

    private _index: number = 0;

    private _animSprite: cc.Sprite = null;

    private _curClip: Clip = null;

    private _isHidden: boolean = false;

    private _clipMap: Map<string, Clip> = new Map();

    private _clipName: string = '';

    public addClipFrame(first: number, last: number, res: string, name: string): void {
        this._animSprite = this.node.getComponent(cc.Sprite);
        if (!this._animSprite) {
            this._animSprite = this.node.addComponent(cc.Sprite);
        }
        this._animSprite.trim = false;
        this._animSprite.sizeMode = cc.Sprite.SizeMode.RAW;
        if (!this._clipMap.get(name)) {
            let clip = new Clip();
            this._clipMap.set(name, clip);
        }
        if (first <= last) {
            for (let i = first; i <= last; i++) {
                let pic = appContext.resourcesManager.getFrame(res + i);
                pic && this._clipMap.get(name).addFrame(pic);
            }
        } else {
            for (let i = first; i >= last; i--) {
                let pic = appContext.resourcesManager.getFrame(res + i);
                pic && this._clipMap.get(name).addFrame(pic);
            }
        }

    }

    public clearFrame(): void {
        this._clipMap.clear;
    }

    public play(time: number, name: string, isHidden: boolean): void {
        this.node.active = true;
        this._isHidden = isHidden;
        this._clipName = name;
        this._curClip = this._clipMap.get(name);
        if (!this._curClip) return;
        this._index = 0;
        this.schedule(this.changePic, time);
    }
    private changePic(): void {
        let pic = this._curClip.frames[this._index];
        if (pic) {
            this._animSprite.spriteFrame = pic;
        }
        this._index++;
        if (this._index >= this._curClip.frames.length) {
            this.unschedule(this.changePic);
            WorldEventManager.triggerEvent(this._clipName, null);
            if (!this._isHidden) return;
            this.scheduleOnce(this.hide, 0.5);
        }
    }

    private hide(): void {
        this.node.active = false;
    }
}
