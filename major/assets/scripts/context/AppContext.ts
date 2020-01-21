
const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        appContext: AppContext;
    }
    let appContext: AppContext;
}

@ccclass
export class AppContext extends cc.Component {



    public onLoad(): void {
        window.appContext = this;
        cc.game.addPersistRootNode(this.node);

    }

    public enterGame(): void {
        this.initNode();

    }

    private initNode(): void {
        let canvas = cc.Canvas.instance.node;

        let game = new cc.Node(NodeNameEnum.GAME_ROOT);
        game.group = GroupEnum.GAME;
        game.zIndex = ZOrderEnum.GAME;
        // 让游戏节点的位置在屏幕左侧，方便构建地图
        game.x = -canvas.width / 2;

        let ui = new cc.Node(NodeNameEnum.UI_ROOT);
        ui.zIndex = ZOrderEnum.UI;

        canvas.addChild(game);
        canvas.addChild(ui);
    }

}