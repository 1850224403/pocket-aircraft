import { NumberToString } from "./NumberToString";
import { FramePathEnum } from "../const/ResPathEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-19 16:34:58 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 17:48:15
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class ImageNumber extends cc.Component {

    private _lastNumberStr: string = '';

    private _offset: number = 15;

    private _value: number = 0;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        if (value >= Number.MAX_SAFE_INTEGER) {
            value = Number.MAX_SAFE_INTEGER;
        }
        //转换数
        let newNumberStr = NumberToString.getFloatNumberStr(value);
        if (newNumberStr.length === this._lastNumberStr.length) {
            this.changeNumPic(newNumberStr);
            return;
        }
        let x = 0;
        this.node.destroyAllChildren();
        let hasPoint: boolean = false;
        for (let i = 0; i < newNumberStr.length; i++) {
            if (newNumberStr[i] === 'p') {
                x += 13;
                hasPoint = true;
            } else {
                x += this._offset;
                if (i === newNumberStr.length - 1 && hasPoint) {
                    x += 5;
                }
            }
            this.createNum(newNumberStr[i], x);
        }
        this._lastNumberStr = newNumberStr;
    }

    public init(): void {
        this._lastNumberStr = '';
    }

    private createNum(str: string, x: number): void {
        if (!str) return;
        let respath = FramePathEnum.PIC_NUMBER + str;
        let pic = appContext.resourcesManager.getFrame(respath);
        if (!pic) return;
        let numNode = new cc.Node('number');
        numNode.addComponent(cc.Sprite).spriteFrame = pic;
        numNode.setScale(0.7);
        numNode.x = x;
        if (str === 'p') {
            numNode.y = -10;
        }
        this.node.addChild(numNode);
    }

    private changeNumPic(newNumberStr: string): void {
        let numsNode = this.node.children;
        for (let key in numsNode) {
            let name = newNumberStr[key];
            let respath = FramePathEnum.PIC_NUMBER + name;
            let pic = appContext.resourcesManager.getFrame(respath);
            if (!pic) continue;
            let spriteComp = numsNode[key].getComponent(cc.Sprite);
            if (spriteComp) spriteComp.spriteFrame = pic;
        }
    }
}