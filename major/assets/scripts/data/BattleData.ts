import { RoleData } from "./RoleData";
import { MotionCameraData } from "./MotionCameraData";
import { LevelData } from "./LevelData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:55:04 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-14 16:40:16
 */
export class BattleData {

    /** 关卡数据 */
    public levelData: LevelData = null;

    /** 玩家数据 */
    public playerData: RoleData = null;

    /** 运动相机数据 */
    public motionCamData: MotionCameraData = null;

    public clear(): void {
        this.levelData = null;
        this.playerData = null;
        this.motionCamData = null;
    }

}