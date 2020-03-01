/**
 * Created by 席庆功
 * Time: 2019/05/24.
 */
export class TaskManager {

    private static instance: TaskManager = null;

    // 最多并行执行的任务数量
    private concurrency = 5;
    // 即将要执行的任务队列，会按照队列的顺序执行
    private queue = [];
    // 当前所有的任务的集合（包括执行中的和即将要执行的）
    private tasks = [];
    // 当前正在执行的任务数量
    private activeCount = 0;

    private push(task: () => Promise<any>): void {
        let self = this;
        this.tasks.push(new Promise(function (t, r) {
            var a = function () {
                self.activeCount++;
                try {
                    task().then(function (e) {
                        t(e);
                    }).then(function () {
                        self.next();
                    }).catch((error) => {
                        self.next();
                        console.error(error);
                    });
                } catch (error) {
                    self.next();
                    console.error(error);
                }
            };
            self.activeCount < self.concurrency ? a() : self.queue.push(a);
        }));
    };

    private all(): any {
        return Promise.all(this.tasks);
    };

    private next(): void {
        this.activeCount--;
        this.queue.length > 0 && this.queue.shift()();
    };

    private addTask(task: (success: () => void, fail: () => void) => void): void {

        function promiseTask() {
            return new Promise(function (resolve, reject) {
                task(
                    () => {
                        resolve("");
                    },
                    () => {
                        resolve("");
                    }
                );
            })
        }

        this.push(promiseTask);
    }

    /**
     * 添加需要执行的任务
     * @param task 必须包含成功和失败回调参数,同时保证回调必须被执行一次，否则会导致并行的任务无法取消
     */
    public static addTask(task: (success: () => void, fail: () => void) => void): void {
        if (this.instance == null) {
            this.instance = new TaskManager();
        }
        this.instance.addTask(task);
    }
}

// TaskManager Exzample
/* let taskNext = (success: () => void, fail: () => void) => {

    console.log("任务2开始执行");

    var url = ShareManager.statisticUrl + "/playerJump";

    let data: any = {};

    data.appId = GameConfig.wxAppId;
    data.playerId = UserData.data.openId;
    data.uuid = UserData.data.playerId;
    data.weixinadinfo = UserData.data.weixinadinfo;
    data.adChannel = UserData.data.adChannel;
    data.adUserId = UserData.data.adUserId;

    let httpCallback = (retCode: number, retData: any) => {
        // http 执行成功
        if (retCode == 0) {
            console.log("任务2执行成功");
            success && success();
            return;
        }
        // http 执行失败
        console.log("任务2执行失败");
        fail && fail();
    }

    GameCommonHttp.wxHttpPost(url, data, httpCallback);
}

let task = (success: () => void, fail: () => void) => {

    console.log("任务1开始执行");

    var url = ShareManager.statisticUrl + "/playerJump";

    let data: any = {};

    data.appId = GameConfig.wxAppId;
    data.playerId = UserData.data.openId;
    data.uuid = UserData.data.playerId;
    data.weixinadinfo = UserData.data.weixinadinfo;
    data.adChannel = UserData.data.adChannel;
    data.adUserId = UserData.data.adUserId;

    let httpCallback = (retCode: number, retData: any) => {
        // http 执行成功
        if (retCode == 0) {
            console.log("任务1执行成功");
            success && success();
            return;
        }
        // http 执行失败
        console.log("任务1执行失败");
        fail && fail();
        // 任务1失败后执行下一个任务
        TaskManager.addTask(taskNext);
    }

    GameCommonHttp.wxHttpPost(url, data, httpCallback);
}

TaskManager.addTask(task); */
