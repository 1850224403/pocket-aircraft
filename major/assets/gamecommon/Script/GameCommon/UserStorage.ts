/**
 * Created by 席庆功
 * Time: 2019/05/24.
 */
/**
 * 用以保存用户的关键信息 与UserData不同，UserData主要用于游戏使用，UserStorage用于与服务器通讯记录
 */
export class UserStorage {
    public static readonly KEY = "userStorage";
    public static data: UserStorage = null;
    // 用户单独存储的uuid
    public uuid: string = null;
    // 用户的openid
    public openId: string = null;
    // 用户的性别
    public gender: number = null;
    // 第一次启动时获取到的跳转appid
    public sourceAppId: string = null
    // 第一次启动时获取到的卡片带入的appid
    public sessionSourceAppId: string = null;
    // 第一次启动时获取到的广告相关数据
    public wxAdInfo: string = null;
    // 第一次启动时获取到的卡片带入的广告相关数据
    public sesseionWxAdInfo: string = null;

    public static parseFromStr(jsonStr: string): boolean {

        this.data = new UserStorage();

        if (jsonStr == null || jsonStr == "" || typeof jsonStr != "string") {
            return false;
        }

        try {
            var jsonData = JSON.parse(jsonStr);

            if (jsonData == null) {
                return false;
            }

            if (jsonData.uuid != null) {
                this.data.uuid = jsonData.uuid;
            }
            if (jsonData.openId != null) {
                this.data.openId = jsonData.openId;
            }
            if (jsonData.sourceAppId != null) {
                this.data.sourceAppId = jsonData.sourceAppId;
            }
            if (jsonData.sessionSourceAppId != null) {
                this.data.sessionSourceAppId = jsonData.sessionSourceAppId;
            }
            if (jsonData.wxAdInfo != null) {
                this.data.wxAdInfo = jsonData.wxAdInfo;
            }
            if (jsonData.sesseionWxAdInfo != null) {
                this.data.sesseionWxAdInfo = jsonData.sesseionWxAdInfo;
            }
            if (jsonData.uuid != null) {
                this.data.uuid = jsonData.uuid;
            }
            if (jsonData.gender != null) {
                this.data.gender = jsonData.gender;
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
 