/**
 * Created by 席庆功
 * Time: 2019/05/24.
 */
/**
 * 临时保存微信启动数据
 */
export class LaunchOption {
    public static data: LaunchOption = new LaunchOption();
    // 启动时获取到的跳转appid
    public sourceAppId: string = null;
    // 启动时获取到的卡片带入的appid
    public sessionSourceAppId: string = null;
    // 启动时卡片带入的分享玩家uuid
    public sharePlayerUuid: string = null;
    // 启动场景
    public scene: number = null;
    // 启动时获取到的广告相关数据
    public wxAdInfo: string = null;
    // 启动时获取到的卡片带入的广告相关数据
    public sesseionWxAdInfo: string = null;
}

/**
 * 封装用于上传服务器的启动数据
 */
export class LaunchPacket {
    public static data: LaunchPacket = new LaunchPacket();
    // 标记是否需要向服务器获取userStorage数据
    public needUserStorage: boolean = true;
    // 标记userStorage中openId为空, 需要从服务器重新获取
    public needOpenId = true;
    // 通过wx.login(), 获得code, 
    // 用于后续向服务器换取openId和sessionkey
    public code: string = null;
    // 启动时获取到的跳转appid
    public sourceAppId: string = null;
    // 启动时获取到的卡片带入的appid
    public sessionSourceAppId: string = null;
    // 用户的uuid
    public uuid: string = null;
    // 卡片带入的分享玩家uuid
    public sharePlayerUuid: string = null;
    // 启动场景
    public scene: number = null;
    // 启动时获取到的广告相关数据
    public wxAdInfo: string = null;
    // 启动时获取到的卡片带入的广告相关数据
    public sesseionWxAdInfo: string = null;
}

