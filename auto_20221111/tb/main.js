/**
 * TB221111
 * 
 * Author: czj
 * Versions: 1.0.1
 * Github: https://github.com/czj2369/jd_tb_auto
 */
// 任务序号
var TASK_ID = 0;
const appPackageName = "com.taobao.taobao";
// 忽略任务
const IGNORE_TASK_LIST = ['邀请成功最高得', '支付宝', '淘宝乐园', '农场', '消消乐'];
const BACK_LIST = ['任务完成', '任务已经全部完成啦', '下单可获得额外喵果'];
// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
// 任务进行中标记
var task_process = true;
init();
function init() {
    console.log("项目地址:https://github.com/czj2369/jd_tb_auto");
    console.log("音量上键结束脚本运行");
    console.log("如果程序无法自动进入活动页，请手动进入！")
    console.log("如果程序太久没有动静（半分钟内）,请结束脚本之后，重新启动脚本！")
    // 子线程监听音量上键按下
    threads.start(function () {
        events.setKeyInterceptionEnabled("volume_up", true);
        //启用按键监听
        events.observeKey();
        //监听音量上键按下
        events.onKeyDown("volume_up", function (event) {
            console.log("脚本退出!")
            exit();
        });
    });
    // 子线程开启计时
    threads.start(function () {
        if (interval == null) {
            // 开启计时器，进行卡顿计时
            // 启动定时器前，将计数器归为0
            JUDGE_TIME = 0;
            console.log("开启定时器");
            interval = setInterval(function () {
                JUDGE_TIME = JUDGE_TIME + 1;
                //console.log("停留时间计时：", JUDGE_TIME);
                recoverApp();
            }, 1000);
        }
    });

    console.log("当前手机分辨率", device.width, device.height)
    // 设置分辨率
    setScreenMetrics(1090, 1920);
    console.log("设置手机脚本分辨率", 1090, 1920)
    auto.waitFor();
    auto.setMode("normal");

    console.show();
    // 启动淘宝
    app.launch(appPackageName);

    // 启动任务
    while (true) {
        task_process = clikcFinish();
        enterActivity();
        while (task_process) {
            execTask();
        }
    }

}

/**
 * 进入活动界面
 */
function enterActivity() {
    if (desc("我的淘宝").exists() && desc("购物车").exists()) {
        desc("我的淘宝").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
    }

    if (desc("瓜分10亿").exists()) {
        desc("瓜分10亿").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
    }
    if (desc("10亿红包").exists()) {
        desc("10亿红包").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
    }
    if (textContains("天猫双十一 喵喵爱糖果，瓜分十亿红包").exists()) {
        console.log("点击做任务")
        text("去赚能量").findOne().click();
        sleep(2000);
        // 计时器重置
        JUDGE_TIME = 0;
    }
}

/**
 * 
 * @returns 点击去完成
 */
function clikcFinish() {
    const button = text("去完成").find()[TASK_ID];
    if (button != undefined) {
        const parentButton = button.parent();
        var taskName = parentButton.children()[0].children()[0].text();
        for (var i = 0; i < IGNORE_TASK_LIST.length; i++) {
            if (taskName.indexOf(IGNORE_TASK_LIST[i]) >= 0) {
                TASK_ID++;
                console.log("忽略当前任务:", taskName);
                console.log("任务序号自增", TASK_ID);
                return false;
            }
        }
        console.log("当前任务:", taskName);
        //sleep(2000);
        if (button.click()) {
            console.log("点击去完成");
            // 计时器重置
            JUDGE_TIME = 0;
            sleep(3000);
            return true;
        }
    }
    return false;
}

/**
 * 执行任务
 * 
 * @returns 
 */
function execTask() {
    // 判断任务序号是否需要自增
    judgeAddTaskId();

    // 双十一喵果互动
    interactionMG();

    // 浏览任务
    viewTask();
}

/**
 * 判断任务序号是否需要自增
 */
function judgeAddTaskId() {
    if (text("浏览得奖励").exists()) {
        // 计时器重置
        JUDGE_TIME = 0;
    }
}

/**
 * 浏览任务
 */
function viewTask() {
    for (var i = 0; i < BACK_LIST.length; i++) {
        if (text(BACK_LIST[i]).exists() || desc(BACK_LIST[i]).exists() || id("2542212460").exists()) {
            back();
            sleep(2000);
            // 计时器重置
            JUDGE_TIME = 0;
            console.log("浏览完成，返回");
            task_process = false;
            break;
        }
    }
}

/**
 * 双十一喵果互动
 */
function interactionMG() {
    if (text("双十一喵果互动").exists()) {
        text("允许").findOne().click();
        // 计时器重置
        JUDGE_TIME = 0;
        task_process = false;
    }
}

/**
 * 点击控件中点
 * 
 * @param {*} uiName 
 * @param {*} type 
 * @param {*} index 
 * @returns 
 */
function clickCenter(uiName, type, index) {
    let type = type || 'text';
    let index = index || 0;
    try {
        const bounds = type == "desc" ? desc(uiName).find()[index].bounds() : text(uiName).find()[index].bounds();
    } catch (error) {
        return false;
    }
    console.log("点击坐标：", bounds.centerX(), bounds.centerY());
    // 计时器重置
    JUDGE_TIME = 0;
    return click(bounds.centerX(), bounds.centerY());
}

/**
 * 根据坐标直接点击
 * @param {*} bounds 
 * @returns 
 */
function clickCenterXY(x1, y1, x2, y2) {
    // 计时器重置
    JUDGE_TIME = 0;
    return click((x1 + x2) / 2, (y1 + y2) / 2);
}

/**
 * 自动判断程序是否卡顿，恢复方法
 * 判断依据：1.不在活动界面 2.停留某个界面长达15s
 */
function recoverApp() {
    if (JUDGE_TIME > 25) {
        if (back()) {
            sleep(2000);
            task_process = false;
            // 计时器重置
            JUDGE_TIME = 0;
            app.launch(appPackageName);
            log("停留某个页面超过25s,自动返回，重置定时器。");
            console.log("当前任务序号：", TASK_ID)
            return true;
        }
    }
}
 /**
* TB221111
*
* Author: czj
* Versions: 1.0.1
* Github: https://github.com/czj2369/jd_tb_auto
*/
