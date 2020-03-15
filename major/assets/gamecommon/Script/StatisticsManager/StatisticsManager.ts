import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameConfig } from "../GameCommon/GameCommon";
import { UserData } from "../GameCommon/UserData";
import { ShareManager, ShareInfo } from "../ShareCommon/ShareManager";

export class StatisticsManager {

    //上传分享图片统计
    public static uploadSharePictureRecord(shareType: string, shareInfo: ShareInfo, phoneModel: string): void {

        var url = ShareManager.newStatisticUrl + "/picture/share";

        let data: any = {};

        data.appId = GameConfig.wxAppId;
        data.pictureName = shareInfo.shareImgName;
        data.pictureType = shareType;
        data.content = shareInfo.shareText;
        data.pictureUrl = shareInfo.shareImgUrl;
        data.uuid = UserData.data.playerId;
        data.phoneModel = phoneModel;
        data.version = GameConfig.versionCode;

        GameCommonHttp.wxHttpPost(url, data, null);
    }

    //上传点击图片统计
    public static uploadClickPictureRecord(shareType: string, shareImgName: string, shareText: string, shareImgUrl: string, shareTime: number, phoneModel: string): void {

        var url = ShareManager.newStatisticUrl + "/picture/click";

        let data: any = {};

        data.appId = GameConfig.wxAppId;
        data.pictureName = shareImgName;
        data.pictureType = shareType;
        data.content = shareText;
        data.pictureUrl = shareImgUrl;
        data.uuid = UserData.data.playerId;
        data.phoneModel = phoneModel;
        data.version = GameConfig.versionCode;
        data.shareTimeMillis = shareTime;

        GameCommonHttp.wxHttpPost(url, data, null);
    }

    //上传跳转小游戏记录
    public static uploadJumpRecord(jumpAppId: string, jumpAppName: string, jumpOperation: string, moduleType: number,
        itemOrder = null, part = null, uploadCallBack: (retCode: number, retData: any) => void = null): void {

        if (jumpOperation == "jumpSuccess") {
            UserData.addDetailExportsData(moduleType, jumpAppId, itemOrder, part);
        }

        if (jumpOperation == "playerClick") {
            UserData.addDetailClicksData(moduleType, jumpAppId, itemOrder, part);
        }
    }

    /**
     * 上传第三方统计事件
     * @param eventName 统计事件的名称 建议使用中文
     * @param eventId 统计事件的id
     * @param params 统计事件的参数
     */
    public static thirdSendEvent(eventName: string, eventId: string = null, params: any = null): void {
        if (eventName == null || cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        if (typeof wx.aldSendEvent === 'function') {
            params == null ? wx.aldSendEvent(eventName) : wx.aldSendEvent(eventName, params);
        }
        if (GameGlobal && GameGlobal.tdAppSdk && typeof GameGlobal.tdAppSdk.event === 'function') {
            params == null ? GameGlobal.tdAppSdk.event({ id: eventId ? eventId : eventName, label: eventName }) : GameGlobal.tdAppSdk.event({ id: eventId ? eventId : eventName, label: eventName, params: params });

        }
    }


    /**
     * 上传阿拉丁关卡事件统计，确认已经接入阿拉丁统计才可以使用
     */
    public static partStart(partNum: number): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME || !wx.aldStage || typeof wx.aldStage.onStart !== 'function') {
            return;
        }

        wx.aldStage.onStart({
            stageId: "" + partNum, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName: "第" + partNum + "关",//关卡名称，该字段必传
            userId: UserData.data.playerId //用户ID
        });
    }

    /*  event 事件类型，默认都是使用道具，具体查看阿拉丁文档http://doc.aldwx.com/aldwx/src/game.html   
        payStart:发起支付
        paySuccess:支付成功
        payFail:支付失败
        tools:使用道具 必须带入itemName
        revive:复活
        award:奖励 */
    public static partRunning(partNum: number, event: string = "tools", params: any = {}): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME || !wx.aldStage || typeof wx.aldStage.onRunning !== 'function') {
            return;
        }

        wx.aldStage.onRunning({
            stageId: "" + partNum, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName: "第" + partNum + "关",//关卡名称，该字段必传
            userId: UserData.data.playerId, //用户ID
            event: event,  //支付成功 关卡进行中，用户触发的操作    该字段必传
            params: params
        });
    }

    public static partEnd(partNum: number, success: boolean): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME || !wx.aldStage || typeof wx.aldStage.onEnd !== 'function') {
            return;
        }

        wx.aldStage.onEnd({
            stageId: "" + partNum, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName: "第" + partNum + "关",//关卡名称，该字段必传
            userId: UserData.data.playerId, //用户ID
            event: success ? "complete" : "fail",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
            params: {
                desc: success ? "关卡完成" : "关卡失败"   //描述
            }
        });
    }

    /*   //关卡开始
      wx.aldStage.onStart({
        stageId : "1",     //关卡ID 该字段必传
        stageName : "第一关", //关卡名称  该字段必传
        userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
      })
      
      
      //关卡中，用户发起支付
      
      wx.aldStage.onRunning({
        stageId : "1",     //关卡ID 该字段必传
        stageName : "第一关", //关卡名称  该字段必传
        userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
        event : "payStart",  //发起支付 关卡进行中，用户触发的操作    该字段必传
        params : {    //参数
          itemName : "火力增强",  //购买商品名称  该字段必传
          itemCount : 5,        //购买商品数量  可选，默认1
          itemMoney : 20        // 购买商品金额  可选 默认0
          desc : "武器库-商店购买"  //商品描述   可选
        }
      })
      
      //关卡中，用户支付成功  
      
      wx.aldStage.onRunning({
        stageId : "1",     //关卡ID 该字段必传
        stageName : "第一关", //关卡名称  该字段必传
        userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
        event : "paySuccess",  //支付成功 关卡进行中，用户触发的操作    该字段必传
        params : {    //参数
          itemName : "火力增强",  //购买商品名称  该字段必传
          itemCount : 5,        //购买商品数量  可选，默认1
          itemMoney : 20        // 购买商品金额  可选 默认0
          desc : "武器库-商店购买"  //商品描述   可选
        }
      })
      
      //关卡中，用户使用道具
      wx.aldStage.onRunning({
        stageId : "1",   //关卡ID 该字段必传
        stageName : "第一关",  //关卡名称  该字段必传
        userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M", //用户ID 可选
        event : "tools",  //使用道具  关卡进行中，用户触发的操作    该字段必传
        params : {
          itemName : "屠龙刀",//使用道具名称 该字段必传
          itemCount : 1,   //使用道具数量  可选
          desc : "+9屠龙刀" //使用道具描述
        }
      })
      
      
      //关卡完成
      wx.aldStage.onEnd({
        stageId : "1",    //关卡ID 该字段必传
        stageName : "第一关", //关卡名称  该字段必传
        userId : "06_bmjrPtlm6_2sgVt7hMZOPfL2M",  //用户ID 可选
        event : "complete",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
        params : {
          desc : "关卡完成"   //描述
        }
      }) */
}