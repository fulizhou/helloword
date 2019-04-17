/**
 * Created by zhouzhiyang on 15/5/14.
 */

var fs = require('fs');

var FILE_NAME = './server_config.json';

var server_config;

/**
 * Modify by shangfanfan on 2016-04-27.
 */

/**
 * 将 Mb, Kb 等字符串 转换成等价的 字节大小
 * example: convertBitSize("10k") = 10240
 * @param str
 * @returns {string|XML}
 */
var convertBitSize = function (str) {
    return str.replace(/(\d+)mb?/i, function ($1) {
        // 1Mb = 1024kb
        return (parseInt($1) * 1024) + "k";
    }).replace(/(\d+)kb?/i, function ($1) {
        // 1kb = 1024字节
        return parseInt($1) * 1024;
    });
};

try {
    var str = fs.readFileSync(FILE_NAME);
    server_config = JSON.parse(str);

    // 使用继承方式设置默认值
    server_config.__proto__ = {
        app_title: "",
        service_url: "",
        server_img_url: "",
        is_demo: 0,
        article_list_count: 30,
        upload_max_size: "50MB",
        app_type:"web_app",

        // 个性化配置
        personality:{
            // 新增稿件的时候和选题, 采访任务关联
            article_to_relation:0
        },

        redis_host: "",
        redis_port: "",
        redis_pwd: "",
        appkey: "",
        appsecret: "",
        upload_choose_dept: 0
    };

    // 转换为字节大小
    server_config.upload_max_size = convertBitSize(server_config.upload_max_size + "");

} catch (e) {
    console.info("加载配置文件: " + FILE_NAME + " 失败");
    throw e;
}

exports = module.exports = server_config;