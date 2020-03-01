import { MapBuilder } from "../builder/MapBuilder";
import { LogUtil } from "../util/LogUtil";
import { MapData } from "../data/MapData";
import { SlopeEnum } from "../const/SlopeEnum";
import { ModifiableAction } from "../animation/ModifiableAction";
import { AnimationEnum } from "../const/AnimationEnum";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { RoadEnum } from "../const/RoadEnum";
import { RoadTrapezoidData } from "../data/RoadTrapezoidData";
import { ConstValue } from "../const/ConstValue";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:36:30 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-15 10:54:21
 */
const { ccclass, property } = cc._decorator;

const ROAD_Y = ConstValue.ROAD_Y;
/** 玩家到轮子的距离 */
const ROLE_WHEEL_OFFSET: number = 38;

@ccclass
export class MapManager {

    private _data: MapData = null;

    private _roundCount: number = 1;

    private _mapBuilder: MapBuilder = new MapBuilder();

    public getStartX(): number {
        return 290;
    }

    public getEndX(): number {
        return this._data.roadLength * this._roundCount - 1000;
    }

    public init(): void {
        let currentLevel = appContext.userDataStorage.currentLevel;
        let a = Math.ceil(currentLevel / 3);
        let id = a;
        let mapMap = appContext.configManager.getMapMap();
        if (!mapMap) return;
        let mapData = mapMap.get(id);
        if (!mapData) {
            LogUtil.err('no map data with id ', id);
            return;
        }
        this._data = mapData;
        this._data.roadBlockList && this._data.roadBlockList.sort((a, b) => {
            return a.x - b.x;
        });
        this._data.itemList && this._data.itemList.sort((a, b) => {
            return a.x - b.x;
        });
        let levelData = gameContext.battleData.levelData;
        levelData && (this._roundCount = levelData.roundCount);
        this._mapBuilder.build(mapData, this._roundCount);
    }

    public getGroundY(roadY: number): number {
        let y = -284 + roadY;
        return y;
    }

    public getRoadNo(roadY: number): number {
        for (let i = 0; i < ROAD_Y.length; i++) {
            const y = ROAD_Y[i];
            if (roadY < y) {
                return i + 1;
            }
        }
        return 1;
    }

    public getRoundCount(x: number): number {
        return Math.ceil(x / this._data.roadLength);
    }

    public clacRoundX(x: number): number {
        if (!this._data) return x;
        let round = this.getRoundCount(x);
        let roadLength = this._data.roadLength;
        return x - (round - 1) * roadLength;
    }

    public getY(x: number, roadY: number): number {
        x = this.clacRoundX(x);
        let y = this.getGroundY(roadY);
        if (!this._data) return y;
        let roadList = this._data.slopeList;
        if (!roadList) return y;
        for (const slope of roadList) {
            let data = this.getTrapezoidData(slope.type);
            let rate, slopeY = 0;
            let height = data.topLeft.y - data.bottomLeft.y;
            let offset = x - slope.x;
            if (offset > data.topLeft.x && offset < data.topRight.x) {
                return y + height;
            } else if (offset < data.topLeft.x && offset > data.bottomLeft.x) {
                rate = 1 - Math.abs(offset - data.topLeft.x) / (data.topLeft.x - data.bottomLeft.x);
                slopeY = height * rate;
                return y + slopeY;
            } else if (offset > data.topRight.x && offset < data.bottomRight.x) {
                rate = 1 - Math.abs(offset - data.topRight.x) / (data.bottomRight.x - data.topRight.x);
                slopeY = height * rate;
                return y + slopeY;
            }
        }
        return y;
    }

    public getRoleY(x: number, roadY: number): number {
        return this.getY(x, roadY + ROLE_WHEEL_OFFSET);
    }

    public getVelocity(x: number): cc.Vec2 {
        x = this.clacRoundX(x);
        // 默认速度向前
        let v = cc.Vec2.RIGHT.clone();
        if (!this._data) return v;
        let roadList = this._data.slopeList;
        if (!roadList) return v;
        for (const slope of roadList) {
            let data = this.getTrapezoidData(slope.type);
            let offset = x - slope.x;
            if (offset > data.topLeft.x && offset < data.topRight.x) {
                return v;
            } else if (offset < data.topLeft.x && offset > data.bottomLeft.x) {
                return data.topLeft.sub(data.bottomLeft).normalize();
            } else if (offset > data.topRight.x && offset < data.bottomRight.x) {
                return data.bottomRight.sub(data.topRight).normalize();
            }
        }
        return v;
    }

    public checkPassHeight(lastX: number, currrentX: number): boolean {
        lastX = this.clacRoundX(lastX);
        currrentX = this.clacRoundX(currrentX);
        if (!this._data) return false;
        let roadList = this._data.slopeList;
        if (!roadList) return false;
        for (const slope of roadList) {
            let data = this.getTrapezoidData(slope.type);
            let lastOffset = lastX - slope.x;
            let currentOffset = currrentX - slope.x;
            if (lastOffset < data.topLeft.x && currentOffset > data.topLeft.x) {
                return true;
            }
        }
        return false;
    }

    public getTrapezoidData(type: SlopeEnum): RoadTrapezoidData {
        let data = new RoadTrapezoidData();
        switch (type) {
            case SlopeEnum.ONE:
                data.topLeft = cc.v2(-59, -143);
                data.topRight = cc.v2(59, -143);
                data.bottomLeft = cc.v2(-144, -240);
                data.bottomRight = cc.v2(144, -240);
                break;

            case SlopeEnum.TWO:
                data.topLeft = cc.v2(-15, -94);
                data.topRight = cc.v2(15, -94);
                data.bottomLeft = cc.v2(-168, -237);
                data.bottomRight = cc.v2(168, -237);
                break;

            case SlopeEnum.THREE:
                data.topLeft = cc.v2(24, -94);
                data.topRight = cc.v2(58, -94);
                data.bottomLeft = cc.v2(-155, -237);
                data.bottomRight = cc.v2(155, -237);
                break;

            case SlopeEnum.FORU:
                data.topLeft = cc.v2(-108, -87);
                data.topRight = cc.v2(108, -87);
                data.bottomLeft = cc.v2(-264, -286);
                data.bottomRight = cc.v2(264, -286);
                break;

            case SlopeEnum.FIVE:
                data.topLeft = cc.v2(-25, -17);
                data.topRight = cc.v2(25, -17);
                data.bottomLeft = cc.v2(-283, -286);
                data.bottomRight = cc.v2(283, -286);
                break;

            case SlopeEnum.SIX:
                data.topLeft = cc.v2(44, -21);
                data.topRight = cc.v2(108, -21);
                data.bottomLeft = cc.v2(-290, -286);
                data.bottomRight = cc.v2(290, -286);
                break;

            default:
                LogUtil.err('no road type ', type);
                break;
        }
        return data;
    }

    public updateSelf(dt: number): void {
        // ...
    }

    public getRoadLength(): number {
        return this._data.roadLength - 320;
    }

    public startPosAnim(): void {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }
        let startAnim = gameRoot.getComponentInChildren(ModifiableAction);
        startAnim && startAnim.play(0.05, AnimationEnum.STARTRUN, false);
    }

    public getFrontBlock(x: number): cc.Vec2 {
        if (!this._data) return null;
        x = this.clacRoundX(x);
        let blockList = this._data.roadBlockList;
        if (!blockList) return null;
        for (const block of blockList) {
            if (block.x > x) {
                let roadY = ROAD_Y[block.road - 1];
                return cc.v2(block.x, roadY);
            }
        }
        return null;
    }

    public getFrontItem(x: number): cc.Vec2 {
        if (!this._data) return null;
        x = this.clacRoundX(x);
        let itemList = this._data.itemList;
        if (!itemList) return null;
        for (const item of itemList) {
            if (item.x > x) {
                let roadY = ROAD_Y[item.road - 1];
                return cc.v2(item.x, roadY);
            }
        }
        return null;
    }

    /** 获取当前位置地面类型 */
    public getPosGround(pos: cc.Vec2): RoadEnum {
        let posX = pos.x;
        let posY = pos.y;
        posX = this.clacRoundX(posX);
        let roadType = RoadEnum.NORMAL_GROUND;
        if (!this._data) return roadType;
        let roadBlockList = this._data.roadBlockList;
        for (const block of roadBlockList) {
            switch (block.type) {
                case RoadEnum.SAND:
                    let xOffset = 123;
                    let yOffset = 33;
                    let nearX = Math.abs(posX - block.x) < xOffset;
                    let roadY = ROAD_Y[block.road - 1];
                    let y = this.getY(block.x, roadY);
                    let nearY = Math.abs(posY - ROLE_WHEEL_OFFSET - y) < yOffset;
                    if (nearX && nearY) {
                        roadType = RoadEnum.SAND;
                    }
                    break;

                default:
                    break;
            }
        }
        return roadType;
    }

}