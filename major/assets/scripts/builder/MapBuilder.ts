import { MapData } from "../data/MapData";
import { IMapBuilder } from "./IMapBuilder";
import { LogUtil } from "../util/LogUtil";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { SlopeData } from "../data/SlopeData";
import { SlopeEnum } from "../const/SlopeEnum";
import { GameEntityZOrderEnum } from "../const/GameEntityZOrderEnum";
import { ItemData } from "../data/ItemData";
import { ItemEnum } from "../const/ItemEnum";
import { PrefabPathEnum, FramePathEnum } from "../const/ResPathEnum";
import { PoolEnum } from "../const/PoolEnum";
import { Item } from "../entity/Item";
import { ModifiableAction } from "../animation/ModifiableAction";
import { AnimationEnum } from "../const/AnimationEnum";
import { RoadBlockData } from "../data/RoadBlockData";
import { SundriesData } from "../data/SundriesData";
import { SundriesEnum } from "../const/SundriesEnum";
import { RoadEnum } from "../const/RoadEnum";
import { ConstValue } from "../const/ConstValue";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 14:04:33 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-15 10:18:26
 */
const ROAD_Y = ConstValue.ROAD_Y;

export class MapBuilder implements IMapBuilder {

    private _mapParent: cc.Node = null;

    public build(data: MapData, roundCount: number = 1): void {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }
        this._mapParent = gameRoot;

        let roadLength = data.roadLength;
        roadLength && this.buildBackground(roadLength, roundCount);

        this.buildStartPos();

        this.buildEndPos();

        let sundriesList = data.sundriesList;
        sundriesList && this.buildSundries(sundriesList, roadLength, roundCount);

        let roadList = data.slopeList;
        roadList && this.buildSlope(roadList, roadLength, roundCount);

        let roadBlockList = data.roadBlockList;
        roadBlockList && this.buildRoadBlock(roadBlockList, roadLength, roundCount);

        let itemList = data.itemList;
        itemList && this.buildItems(itemList, roadLength, roundCount);
    }

    public buildBackground(roadLength: number, roundCount: number): void {
        let bgFrame = appContext.resourcesManager.getFrame(FramePathEnum.BACKGROUND);
        let background = new cc.Node('Background');
        background.zIndex = GameEntityZOrderEnum.BACKGROUND;
        let bgSprite = background.addComponent(cc.Sprite);
        bgSprite.spriteFrame = bgFrame;
        bgSprite.type = cc.Sprite.Type.TILED;
        background.position = cc.v2(0, 331);
        background.width = roadLength * roundCount;
        background.anchorX = 0;
        this._mapParent.addChild(background);
    }

    public buildSundries(sundriesList: SundriesData[], roadLength: number, roundCount: number): void {
        let num = Math.ceil(roadLength * roundCount / 2200);
        for (let i = 0; i < num; i++) {
            for (const sundries of sundriesList) {
                let sundriesNode = new cc.Node('Sundries');
                let resPath = null;
                if (i > 0 && sundries.type === 2) continue;
                switch (sundries.type) {
                    case SundriesEnum.COCONUT:
                        resPath = FramePathEnum.COCONUT;
                        break;

                    case SundriesEnum.RED_ROADSIGN:
                        resPath = FramePathEnum.RED_ROADSIGN;
                        break;

                    case SundriesEnum.GREEN_ROADSIGN:
                        resPath = FramePathEnum.GREEN_ROADSIGN;
                        break;

                    case SundriesEnum.HIGH_ROADBLOCK:
                        resPath = FramePathEnum.HIGH_ROADBLOCK;
                        break;

                    case SundriesEnum.LOW_ROADBLOCK:
                        resPath = FramePathEnum.LOW_ROADBLOCK;
                        break;

                    case SundriesEnum.WHEEL:
                        resPath = FramePathEnum.WHEEL;
                        break;

                    case SundriesEnum.UMBRELLA:
                        resPath = FramePathEnum.UMBRELLA;
                        break;

                    case SundriesEnum.SQUARE_ONE:
                        resPath = FramePathEnum.SQUARE_ONE;
                        break;

                    case SundriesEnum.SQUARE_TWO:
                        resPath = FramePathEnum.SQUARE_TWO;
                        break;

                    default:
                        LogUtil.err('no road type ', sundries.type);
                        break;
                }
                let sundriesSprite = sundriesNode.addComponent(cc.Sprite);
                let sundriesFrame = appContext.resourcesManager.getFrame(resPath);
                if (!sundriesFrame) continue;
                sundriesNode.x = sundries.x + i * 2200;
                sundriesNode.y = sundries.y;
                if (sundries.y < 0) {
                    sundriesNode.zIndex = sundries.y + 1000;
                } else {
                    sundriesNode.zIndex = - sundries.y - 3000;
                }
                sundriesSprite.spriteFrame = sundriesFrame;
                this._mapParent.addChild(sundriesNode);
            }
        }
    }

    public buildStartPos(): void {
        let startPos = new cc.Node('StartPos');
        startPos.x = 290;
        startPos.y = -100;
        let startSprite = startPos.addComponent(cc.Sprite);
        let resPath = FramePathEnum.STARTLINE + '1';
        let startFrame = appContext.resourcesManager.getFrame(resPath);
        if (!startFrame) return;
        startSprite.spriteFrame = startFrame;
        startPos.zIndex = GameEntityZOrderEnum.STARTPOS;
        let startAnim = startPos.addComponent(ModifiableAction);
        startAnim.addClipFrame(1, 6, FramePathEnum.STARTLINE, AnimationEnum.STARTRUN);
        this._mapParent.addChild(startPos);
    }

    public buildEndPos(): void {
        let endPos = new cc.Node('EndPos');
        let x = gameContext.mapManager.getEndX();
        endPos.x = x;
        endPos.y = -110;
        let endSprite = endPos.addComponent(cc.Sprite);
        let resPath = FramePathEnum.ENDLINE;
        let endFrame = appContext.resourcesManager.getFrame(resPath);
        if (!endFrame) return;
        endSprite.spriteFrame = endFrame;
        endPos.zIndex = GameEntityZOrderEnum.ENDPOS;
        this._mapParent.addChild(endPos);
    }

    public buildSlope(slopeList: SlopeData[], roadLength: number, roundCount: number): void {
        for (let i = 0; i < roundCount; i++) {
            for (const slope of slopeList) {
                let roadNode = new cc.Node('Slope');
                roadNode.x = slope.x + i * roadLength;
                roadNode.zIndex = GameEntityZOrderEnum.ROAD;
                let y = 0;
                switch (slope.type) {
                    case SlopeEnum.ONE:
                        y = -72;
                        break;

                    case SlopeEnum.TWO:
                        y = -49;
                        break;

                    case SlopeEnum.THREE:
                        y = -49;
                        break;

                    case SlopeEnum.FORU:
                        y = -21;
                        break;

                    case SlopeEnum.FIVE:
                        y = 14;
                        break;

                    case SlopeEnum.SIX:
                        y = 12;
                        break;

                    default:
                        LogUtil.err('no road type ', slope.type);
                        break;
                }
                roadNode.y = y;
                let roadSprite = roadNode.addComponent(cc.Sprite);
                let resPath = slope.type < 10 ? 'texture/map/slope/slope0' + slope.type : 'texture/map/slope/slope' + slope.type;
                let roadFrame = appContext.resourcesManager.getFrame(resPath);
                if (!roadFrame) continue;
                roadSprite.spriteFrame = roadFrame;
                this._mapParent.addChild(roadNode);
            }
        }
    }

    public buildRoadBlock(roadBlockList: RoadBlockData[], roadLength: number, roundCount: number): void {
        for (let i = 0; i < roundCount; i++) {
            for (const roadBlock of roadBlockList) {
                let zOrder = GameEntityZOrderEnum.ROAD;
                let poolType = null;
                let prefabPath = null;
                switch (roadBlock.type) {
                    case RoadEnum.SAND:
                        zOrder = GameEntityZOrderEnum.SAND;
                        poolType = PoolEnum.SAND;
                        prefabPath = PrefabPathEnum.SAND;
                        break;

                    default:
                        break;
                }
                if (!poolType || !prefabPath) return;
                let prefab = appContext.resourcesManager.getPrefab(prefabPath);
                if (!prefab) return;
                let node = appContext.poolManager.get(poolType, prefab);
                if (!node) return;
                node.x = roadBlock.x + i * roadLength;
                let roadY = ROAD_Y[roadBlock.road - 1];
                node.y = gameContext.mapManager.getY(roadBlock.x, roadY);
                node.zIndex = zOrder;
                this._mapParent.addChild(node);
            }
        }
    }

    public buildItems(itemList: ItemData[], roadLength: number, roundCount: number): void {
        for (let i = 0; i < roundCount; i++) {
            for (const item of itemList) {
                let resPath = null;
                let poolType = null;
                let yOffset = 0;
                switch (item.type) {
                    case ItemEnum.GOLD:
                        yOffset = -10;
                        poolType = PoolEnum.ITEM_GOLD;
                        resPath = PrefabPathEnum.ITEM_GOLD;
                        break;

                    case ItemEnum.ROCKET:
                        yOffset = -23;
                        poolType = PoolEnum.ITEM_ROCKET;
                        resPath = PrefabPathEnum.ITEM_ROCKET;
                        break;

                    case ItemEnum.NITROGEN:
                        yOffset = -16;
                        poolType = PoolEnum.ITEM_NITROGEN;
                        resPath = PrefabPathEnum.ITEM_NITROGEN;
                        break;

                    case ItemEnum.INVINCIBLE:
                        yOffset = -10;
                        poolType = PoolEnum.ITEM_INVINCIBLE;
                        resPath = PrefabPathEnum.ITEM_INVINCIBLE;
                        break;

                    default:
                        break;
                }
                if (!resPath || !poolType) {
                    LogUtil.err('can not get resPath or poolType ', resPath, poolType);
                    continue;
                }
                let itemPrefab = appContext.resourcesManager.getPrefab(resPath);
                if (!itemPrefab) {
                    LogUtil.err('can not get item prefab ', item.type);
                    continue;
                }
                let itemNode = appContext.poolManager.get(poolType, itemPrefab);
                if (!itemNode) {
                    LogUtil.err('can not spawn item ', item.type);
                    continue;
                }
                itemNode.x = item.x + i * roadLength;
                let roadY = ROAD_Y[item.road - 1] + yOffset;
                itemNode.y = gameContext.mapManager.getY(item.x, roadY);
                itemNode.zIndex = -roadY;
                let itemComp = itemNode.getComponent(Item);
                if (!itemComp) {
                    LogUtil.err('can not find item comp ', item.type);
                    continue;
                }
                itemComp.bindData(item);
                this._mapParent.addChild(itemNode);
            }
        }
    }

}