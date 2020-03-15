/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-09 09:44:57 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-09 10:03:22
 */

export class Clip {

    private _frames: Array<cc.SpriteFrame> = new Array();
    public get frames(): Array<cc.SpriteFrame> {
        return this._frames;
    }

    public addFrame(frame: cc.SpriteFrame): void {
        this._frames.push(frame);
    }

    public clearFrame(): void {
        for (let i = 0; i < this._frames.length; i++) {
            this._frames.pop();
        }
    }
}