import { FramePathEnum } from "../const/ResPathEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-02-06 09:06:47 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 17:51:37
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class LevelNumber extends cc.Component {

    private _preLevel: number = 0;

    private _postLevel: number = 0;

    private _offset = 50;

    private _width: number = 0;

    private _level: number = 0;
    public get level(): number {
        return this._level;
    }
    public set level(value: number) {
        this.init();
        this._level = value;
        this._preLevel = Math.ceil(this._level / 3);
        this._postLevel = this._level - ((this._preLevel - 1) * 3);
        let str = this._preLevel.toString();
        let x = 0;
        for (let i = 0; i < str.length; i++) {
            this.createNum(str[i], x)
            x += this._offset;
        }
        this.createNum('line', x);
        x += this._offset;
        this.createNum(this._postLevel.toString(), x);
        this.correctNodePos(x);
    }

    private correctNodePos(x: number): void {
        this.node.x = -(x + this._width) / 2 + 15;
    }

    private init(): void {
        this.node.removeAllChildren();
    }

    private createNum(str: string, x: number): void {
        if (!str) return;
        let respath = FramePathEnum.PIC_NUMBER + str;
        let pic = appContext.resourcesManager.getFrame(respath);
        if (!pic) return;
        let numNode = new cc.Node('level');
        numNode.addComponent(cc.Sprite).spriteFrame = pic;
        numNode.x = x;
        if (str === 'line') {
            numNode.setScale(0.6);
        } else {
            numNode.setScale(1.3);
        }

        this._width = numNode.width;
        this.node.addChild(numNode);
    }
}
