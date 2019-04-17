var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var util = require("util");
var server_config = JSON.parse(fs.readFileSync('./server_config.json'));
var common = require('./common');
var config = require('./config');
var url = require("url");

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/* 登录页面 */
router.get('/', function (req, res, next) {

    try {

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {

            res.render('notice');
        } else {
            res.render('login', {app_title: server_config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/notice：" + e);
    }

});


//新建稿跳转界面
router.get('/getUserMailList', function (req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if(config.is_demo == 1){
            var catalog_info = JSON.parse(fs.readFileSync('./service/getUserMailList.json'));
            console.log(catalog_info);
             if(common.descrypt_login(req, res)){

             res.send({"success":catalog_info.success,"results": catalog_info.results});
             }
             else{
             res.send({"success":false,"results": catalog_info.results});
             }
        }
        else{
            if(common.descrypt_login(req, res)){

                var get_url = config.service_url + "/newMobile/syn.do?method=getUserMailList&loToken=" + params.loToken;
                console.log("调用获取自采稿分类接口：" + get_url);
                common.get_http_request_json(get_url, function(data) {
                    res.send(data);
                });
            }
            else{
                res.render('login', { app_title: config.app_title, re_login: 1});
            }

        }

    }catch(e){
        console.log("错误：/source_catalogs：" + e);
    }

});

module.exports = router;
