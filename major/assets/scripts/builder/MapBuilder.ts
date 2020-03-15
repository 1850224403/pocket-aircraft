import { MapData } from "../data/MapData";
import { IMapBuilder } from "./IMapBuilder";
import { LogUtil } from "../util/LogUtil";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { GameEntityZOrderEnum } from "../const/GameEntityZOrderEnum";
import { PrefabPathEnum, FramePathEnum } from "../const/ResPathEnum";
import { ConstValue } from "../const/ConstValue";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 14:04:33 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-05 00:26:20
 */
const ROAD_Y = ConstValue.ROAD_Y;

export class MapBuilder implements IMapBuilder {

    private _mapParent: cc.Node = null;

    public build(data: MapData): void {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }
        this._mapParent = gameRoot;

        let roadLength = data.roadLength;
        roadLength && this.buildBackground(roadLength, data.id);
    }

    public buildBackground(roadLength: number, id: number): void {
        let path = FramePathEnum.BACKGROUND + id;
        let bgFrame = appContext.resourcesManager.getFrame(path);
        let background = new cc.Node('Background');
        background.zIndex = GameEntityZOrderEnum.BACKGROUND;
        let bgSprite = background.addComponent(cc.Sprite);
        bgSprite.spriteFrame = bgFrame;
        //background.width = 640;
        bgSprite.type = cc.Sprite.Type.TILED;
        background.position = cc.v2(0, 0);
        background.height = roadLength;
        //background.setAnchorPoint(cc.v2(0.5, 0.5));
        this._mapParent.addChild(background);
    }

}