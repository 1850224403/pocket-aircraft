import { IContainer } from "./IContainer";
import { MapData } from "../data/MapData";
import { FramePathEnum } from "../const/ResPathEnum";
import { Background } from "./Effect/Background";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-03-05 23:43:29 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-06 00:06:36
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class BackgroundContainer extends cc.Component implements IContainer {

    private _mapData: MapData = null;

    public bindData(mapData: MapData): void {
        this._mapData = mapData;
    }

    private _background: Background = null;

    public build(): void {
        if (!this._mapData) return;
        this._mapData.roadLength && this.buildBackground(this._mapData.roadLength, this._mapData.id);
    }

    public updateSelf(dt: number): void {
        this._background && this._background.updateSelf(dt);
    }

    private buildBackground(roadLength: number, id: number): void {
        let path = FramePathEnum.BACKGROUND + id;
        let bgFrame = appContext.resourcesManager.getFrame(path);
        let background = new cc.Node('Background');
        this._background = background.addComponent(Background);
        let bgSprite = background.addComponent(cc.Sprite);
        bgSprite.spriteFrame = bgFrame;
        bgSprite.type = cc.Sprite.Type.TILED;
        background.position = cc.v2(0, 0);
        background.height = roadLength;
        this.node.addChild(background);
    }
}
