import { GameCommonUtil } from "./GameCommonUtil";
import { GameConfig } from "./GameCommon";

export class UserActions {
    public adOpen: number = 0;//打开激励视频的次数
    public adSuccess: number = 0;//看完激励视频的次数
    public shareSuccess: number = 0;//分享成功的次数
}

export class UserData {

    public static userActions = new UserActions();

    public static resetUserActions(): void {
        this.userActions.adOpen = 0;
        this.userActions.adSuccess = 0;
        this.userActions.shareSuccess = 0;
    }

    public static readonly storageKey: string = "userData";
    public static readonly maxFreeDialCard: number = 3;
    public static readonly maxShareDialCard: number = 2;
    public static readonly maxVideoDialCard: number = 50;

    public static data: UserData = new UserData();

    public static init: boolean = false;//是否完成初始化数据

    public static newUser: boolean = true;//是否新玩家

    public static lastOnShowTime: number = 0;

    public playerId: string = GameCommonUtil.uuid();

    public openId: string = null;

    // 用户登陆获取的sessionKey
    public sessionKey: string = null;

    public coin: number = 0;

    public gameSound: boolean = true;//游戏音乐的开关，默认打开

    public otherData: any = null;

    public loginRewardCanRecieveCount: number = 1;//登陆奖励可领取的数量
    public loginRewardRecievedCount: number = 0;//登陆奖励已领取的数量

    public lastLoginTime: number = Date.now();//上一次登陆的时间

    public freeDialCard: number = UserData.maxFreeDialCard;//免费转盘券数量
    public shareDialCard: number = UserData.maxShareDialCard;//分享转盘券数量
    public videoDialCard: number = UserData.maxVideoDialCard;//视频转盘券数量

    public levelShareSuccCount: number = 0;

    public recieveAddGameReward: boolean = false;

    // 用户点击视频的次数
    public adOpen: number = 0;

    // 用户成功观看视频的次数
    public adSuccess: number = 0;

    // 用户成功分享的次数
    public shareSuccess: number = 0;

    // 用户停留时间
    public stayTime: number = 0;

    // 用户通过的关数
    public passPart: number = 0;

    // 用户的跳转导出数据
    public detailExports: DetailExport[] = [];

    // 用户点击跳转的数据
    public detailClicks: DetailExport[] = [];

    // 用户展示导出模块的次数
    public moduleShows: ExportModuleShow[] = [];

    // 用户上传的事件
    public uploadEventData: any = null;

    // 用户的性别
    public gender: number = null;

    public static addModuleShows(moduleType: number, count: number): void {
        for (let i = 0; i < this.data.moduleShows.length; i++) {
            let moduleShow = this.data.moduleShows[i];
            if (!moduleShow) {
                continue;
            }

            // 需要合并key相同的moduleShows数据
            if (moduleShow.moduleType == moduleType) {
                moduleShow.count += count;
                return;
            }
        }

        let moduleShow = new ExportModuleShow();
        moduleShow.moduleType = moduleType;
        moduleShow.count = count;

        // 如果不存在，则添加
        this.data.moduleShows.push(moduleShow);
    }

    public static addDetailExportsData(moduleType: number, targetAppId: string, itemOrder = null, part = null, count = 1): void {
        for (let i = 0; i < this.data.detailExports.length; i++) {
            let detailExport = this.data.detailExports[i];
            if (!detailExport) {
                continue;
            }

            // 需要合并key相同的export数据
            if (detailExport.moduleType == moduleType &&
                detailExport.targetAppId == targetAppId &&
                detailExport.itemOrder == itemOrder &&
                detailExport.part == part) {
                detailExport.count += count;
                return;
            }
        }

        let detailExport = new DetailExport();
        detailExport.moduleType = moduleType;
        detailExport.targetAppId = targetAppId;
        detailExport.itemOrder = itemOrder;
        detailExport.part = part;
        detailExport.count = count;

        // 如果不存在，则添加
        this.data.detailExports.push(detailExport);
    }

    public static addDetailClicksData(moduleType: number, targetAppId: string, itemOrder = null, part = null, count = 1): void {
        for (let i = 0; i < this.data.detailClicks.length; i++) {
            let detailClick = this.data.detailClicks[i];
            if (!detailClick) {
                continue;
            }

            // 需要合并key相同的export数据
            if (detailClick.moduleType == moduleType &&
                detailClick.targetAppId == targetAppId &&
                detailClick.itemOrder == itemOrder &&
                detailClick.part == part) {
                detailClick.count += count;
                return;
            }
        }

        let detailClick = new DetailExport();
        detailClick.moduleType = moduleType;
        detailClick.targetAppId = targetAppId;
        detailClick.itemOrder = itemOrder;
        detailClick.part = part;
        detailClick.count = count;

        // 如果不存在，则添加
        this.data.detailClicks.push(detailClick);
    }

    public static getJsonStr(): string {
        var str = JSON.stringify(this.data);
        console.log(str);
        return str;
    }

    public static parseFromStr(jsonStr: string): void {

        this.init = true;

        if (jsonStr == null || jsonStr == "" || typeof jsonStr != "string") {
            return;
        }

        this.newUser = false;

        try {
            var jsonData = JSON.parse(jsonStr);

            if (jsonData == null) {
                return;
            }

            if (jsonData.playerId != null) {
                this.data.playerId = jsonData.playerId;
            }
            if (jsonData.openId != null) {
                this.data.openId = jsonData.openId;
            }
            if (jsonData.coin != null) {
                this.data.coin = jsonData.coin;
            }
            if (jsonData.gameSound != null) {
                this.data.gameSound = jsonData.gameSound;
            }
            if (jsonData.otherData != null) {
                this.data.otherData = jsonData.otherData;
            }
            if (jsonData.loginRewardRecievedCount != null) {
                this.data.loginRewardRecievedCount = jsonData.loginRewardRecievedCount;
            }
            if (jsonData.loginRewardCanRecieveCount != null) {
                this.data.loginRewardCanRecieveCount = jsonData.loginRewardCanRecieveCount;
            }
            if (jsonData.lastLoginTime != null) {
                if (!GameCommonUtil.isToday(jsonData.lastLoginTime)) {
                    //如果不是同一天则可领取奖励次数+1
                    this.data.loginRewardCanRecieveCount = this.data.loginRewardRecievedCount + 1;
                    this.data.freeDialCard = UserData.maxFreeDialCard;
                    this.data.shareDialCard = UserData.maxShareDialCard;
                    this.data.videoDialCard = UserData.maxVideoDialCard;
                } else {
                    if (jsonData.freeDialCard != null) {
                        this.data.freeDialCard = jsonData.freeDialCard;
                    }
                    if (jsonData.shareDialCard != null) {
                        this.data.shareDialCard = jsonData.shareDialCard;
                    }
                    if (jsonData.videoDialCard != null) {
                        this.data.videoDialCard = jsonData.videoDialCard;
                    }
                }
            }
            this.data.lastLoginTime = Date.now();

            if (jsonData.levelShareSuccCount != null) {
                this.data.levelShareSuccCount = jsonData.levelShareSuccCount;
            }

            if (jsonData.recieveAddGameReward != null) {
                this.data.recieveAddGameReward = jsonData.recieveAddGameReward;
            }

            if (jsonData.sessionKey != null) {
                this.data.sessionKey = jsonData.sessionKey;
            }

            if (jsonData.stayTime != null) {
                this.data.stayTime = jsonData.stayTime;
            }

            if (jsonData.passPart != null) {
                this.data.passPart = jsonData.passPart;
            }

            if (jsonData.detailClicks) {
                this.data.detailClicks = jsonData.detailClicks;
            }

            if (jsonData.detailExports) {
                this.data.detailExports = jsonData.detailExports;
            }

            if (jsonData.shareSuccCount) {
                this.data.shareSuccess = jsonData.shareSuccCount;
            }

            if (jsonData.videoSuccCount) {
                this.data.adSuccess = jsonData.videoSuccCount;
            }

            if (jsonData.adOpen != null) {
                this.data.adOpen = jsonData.adOpen;
            }

            if (jsonData.adSuccess != null) {
                this.data.adSuccess = jsonData.adSuccess;
            }

            if (jsonData.shareSuccess != null) {
                this.data.shareSuccess = jsonData.shareSuccess;
            }

            if (jsonData.uploadEventData != null) {
                this.data.uploadEventData = jsonData.uploadEventData;
            }

            if (jsonData.gender != null) {
                this.data.gender = jsonData.gender;
            }

            if (jsonData.moduleShows != null) {
                this.data.moduleShows = jsonData.moduleShows;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 获取上传事件的数据
    public static getUploadEventData(): any {

        let oldUploadEventData = UserData.data.uploadEventData;

        let data: any = {};
        data.eventId = oldUploadEventData ? oldUploadEventData.eventId : GameCommonUtil.uuid();
        data.uuid = UserData.data.playerId;
        data.stayTime = oldUploadEventData ? (oldUploadEventData.stayTime + UserData.data.stayTime) : UserData.data.stayTime;
        data.version = GameConfig.versionCode;
        if (this.data.gender != null) {
            data.gender = this.data.gender;
        }

        if (UserData.data.passPart > 0) {
            let events = [];
            let oldPassPart = oldUploadEventData != null && oldUploadEventData.events != null && oldUploadEventData.events[0] != null ? (oldUploadEventData.events[0].value) : 0;
            events.push({ "code": "passPart", "value": UserData.data.passPart + oldPassPart });
            data.events = events;
        } else if (oldUploadEventData != null && oldUploadEventData.events != null) {
            data.events = oldUploadEventData.events;
        }

        if (UserData.data.detailExports != null && UserData.data.detailExports.length > 0) {
            if (oldUploadEventData != null && oldUploadEventData.detailExports != null) {
                for (let oldDetailExport of oldUploadEventData.detailExports) {
                    if (oldDetailExport == null) {
                        continue;
                    }
                    UserData.addDetailExportsData(oldDetailExport.moduleType, oldDetailExport.targetAppId, oldDetailExport.itemOrder, oldDetailExport.part, oldDetailExport.count);
                }
            }
            data.detailExports = UserData.data.detailExports;
        } else if (oldUploadEventData != null && oldUploadEventData.detailExports != null) {
            data.detailExports = oldUploadEventData.detailExports;
        }

        if (UserData.data.detailClicks != null && UserData.data.detailClicks.length > 0) {
            if (oldUploadEventData != null && oldUploadEventData.detailClicks != null) {
                for (let oldDetailClick of oldUploadEventData.detailClicks) {
                    if (oldDetailClick == null) {
                        continue;
                    }
                    UserData.addDetailClicksData(oldDetailClick.moduleType, oldDetailClick.targetAppId, oldDetailClick.itemOrder, oldDetailClick.part, oldDetailClick.count);
                }
            }
            data.detailClicks = UserData.data.detailClicks;
        } else if (oldUploadEventData != null && oldUploadEventData.detailClicks != null) {
            data.detailClicks = oldUploadEventData.detailClicks;
        }

        if (UserData.data.moduleShows != null && UserData.data.moduleShows.length > 0) {
            if (oldUploadEventData != null && oldUploadEventData.moduleShows != null) {
                for (let oldModuleShow of oldUploadEventData.moduleShows) {
                    if (oldModuleShow == null) {
                        continue;
                    }
                    UserData.addModuleShows(oldModuleShow.moduleType, oldModuleShow.count);
                }
            }
            data.moduleShows = UserData.data.moduleShows;
        } else if (oldUploadEventData != null && oldUploadEventData.moduleShows != null) {
            data.moduleShows = oldUploadEventData.moduleShows;
        }

        if (UserData.userActions != null) {
            let userActions = [];
            if (oldUploadEventData != null && oldUploadEventData.actions != null) {
                for (let action of oldUploadEventData.actions) {
                    if (action == null) {
                        continue;
                    }
                    if (action.code == "adOpen") {
                        UserData.userActions.adOpen += action.value;
                    }
                    if (action.code == "adSuccess") {
                        UserData.userActions.adSuccess += action.value;
                    }
                    if (action.code == "shareSuccess") {
                        UserData.userActions.shareSuccess += action.value;
                    }
                }
            }
            userActions.push({ "code": "adOpen", "value": UserData.userActions.adOpen });
            userActions.push({ "code": "adSuccess", "value": UserData.userActions.adSuccess });
            userActions.push({ "code": "shareSuccess", "value": UserData.userActions.shareSuccess });
            // 为了区分错误版本的上传数据，特殊的修改为另一个名称“actions”
            data.actions = userActions;
        } else if (oldUploadEventData != null && oldUploadEventData.actions != null) {
            data.actions = oldUploadEventData.actions;
        }

        UserData.resetUserActions();
        UserData.data.stayTime = 0;
        UserData.data.passPart = 0;
        UserData.data.detailExports = [];
        UserData.data.detailClicks = [];
        UserData.data.moduleShows = [];

        UserData.data.uploadEventData = data;

        return data;
    }
}

export class DetailExport {
    public moduleType: number = ExportTypeEnum.CAROUSEL_BUTTON;
    public targetAppId: string = null;
    public itemOrder: number = null;
    public part: number = null;
    public count: number = null;
}

export class ExportModuleShow {
    public moduleType: number = ExportTypeEnum.CAROUSEL_BUTTON;
    public count: number = 0;
}

export enum ExportTypeEnum {

    /**
     * 轮播Icon导出模块
     */
    CAROUSEL_BUTTON = 1,

    /**
     * 九宫格盒子导出模块
     */
    MORE_GAME = 2,

    /**
     * 导量跑马灯导出模块
     */
    HORIZONTA_GAME_BOX = 3,

    /**
     * 通关盒子导出模块
     */
    PASS_MORE_GAME = 4,

    /**
     * 全屏盒子导出模块
     */
    NEW_MORE_GAME = 5,

    /**
     * 过关盒子导出模块
     */
    PASS_PART_MORE_GAME = 6,

    /**
     * 返回主页导出模块
     */
    BACK_HOME_MORE_GAME = 7,

    /**
     * 男性用户导出模块
     */
    BOY_MORE_GAME = 8,

    /**
     * 动态图导出模块
     */
    AD_FRAMES_MORE_GAME = 9,

    /**
     * 其他导出模块
     */
    OTHER_MORE_GAME = 100
}
