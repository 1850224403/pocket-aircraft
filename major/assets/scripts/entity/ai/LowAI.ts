import { AI } from "./AI";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-14 14:40:25 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-17 14:30:50
 */
export class LowAI extends AI {

    public updateSelf(dt: number): void {
        super.updateSelf(dt);
        if (!this._role || !this._isStarting) return;
    }

}