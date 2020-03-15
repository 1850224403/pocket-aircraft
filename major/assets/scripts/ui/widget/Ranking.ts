import { FramePathEnum } from "../../const/ResPathEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export class Ranking extends cc.Component {

    @property({
        displayName: '名次',
        type: cc.Sprite,
    })
    private ranking: cc.Sprite = null;

    private _curRanking: number = 0;

    public update(dt: number): void {
        let rank = gameContext.roleManager.getPlayerRanking();
        if (rank === this._curRanking) {
            return;
        }
        this._curRanking = rank;
        let resPath = FramePathEnum.RANKING + this._curRanking;
        let rankingFrame = appContext.resourcesManager.getFrame(resPath);
        rankingFrame && (this.ranking.spriteFrame = rankingFrame);
    }
}
