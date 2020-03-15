import { RoundCounter } from "./RoundCounter";
import { TimeCounter } from "./TimeCounter";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-14 17:03:32 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-14 17:12:13
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GameCounterUI extends cc.Component {

    @property({
        displayName: '圈数统计',
        type: RoundCounter
    })
    private roundCounter: RoundCounter = null;

    @property({
        displayName: '时间计时器',
        type: TimeCounter
    })
    private timeCounter: TimeCounter = null;

    public init(): void {
        this.roundCounter.init();
    }    

}